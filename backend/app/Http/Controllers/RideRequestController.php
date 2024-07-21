<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Resources\RideRequestResource;
use App\Models\RidePost;
use App\Models\RideRequest;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Throwable;

class RideRequestController extends Controller
{
    /**
     * @throws AuthorizationException
     */
    public function getRequestsForPost(RidePost $ridePost)
    {
        $this->authorize('getRequestsForPost', $ridePost);

        return RideRequestResource::collection(
            RideRequest::where('ridepost_id', $ridePost->id)->get());
    }

    /**
     * @throws AuthorizationException
     */
    public function getRequestsForLoggedInUser()
    {
        $this->authorize('getRequestsForLoggedInUser', RideRequest::class);

        return RideRequestResource::collection(RideRequest::where('passenger_id', auth()->id())->get());
    }

    /**
     * @throws GeneralJsonException
     * @throws Throwable
     */
    public function createRequestForPost(RidePost $ridePost)
    {
        $this->authorize('createRequestForPost', $ridePost);

        $userId = auth()->id();

        if ($ridePost->available_seats > 0) {

            $existingRequest = RideRequest::where('passenger_id', $userId)
                ->where('ridepost_id', $ridePost->id)
                ->whereRaw('status IN ("accepted", "pending")')
                ->first();

            if ($existingRequest) {
                throw new GeneralJsonException("You already have a request for this ride post.");
            }

            $request = RideRequest::create([
                'passenger_id' => $userId,
                'ridepost_id' => $ridePost->id
            ]);

        } else {
            throw new GeneralJsonException("Unable to create request - no seats available.");
        }

        throw_if(!$request, GeneralJsonException::class, "Unable to create request.");

        return response()->json(['message' => 'Request created successfully.']);
    }

    /**
     * @throws AuthorizationException
     */
    public function acceptRequest(RideRequest $rideRequest)
    {
        $this->authorize('acceptRequest', $rideRequest);

        DB::transaction(function () use ($rideRequest) {

            $ridePost = $rideRequest->ridePost;

            if ($ridePost->available_seats > 0) {

                $ridePost->passengers()->attach($rideRequest->passenger);
                $ridePost->available_seats -= 1;

                $rideRequest->status = "accepted";

                $ridePost->save();

                $rideRequest->save();

            } else {
                throw new GeneralJsonException("Unable to accept request - no seats available.");
            }
        });

        return response()->json(['message' => 'Request accepted, passenger added to ride.']);
    }

    /**
     * @throws AuthorizationException
     */
    public function rejectRequest(RideRequest $rideRequest)
    {
        $this->authorize('rejectRequest', $rideRequest);

        if ($rideRequest->status == "pending") {

            $rideRequest->status = "rejected";

            $rideRequest->save();

        } else {

            return response()->json(['message' => 'Request is not pending, unable to update.']);
        }

        return response()->json(['message' => 'Request rejected.']);
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(RideRequest $rideRequest)
    {
        $this->authorize('destroy', $rideRequest);

        if ($rideRequest->status == "accepted") {
            $rideRequest->ridePost->passengers()->detach(auth()->id());
        }

        $rideRequest->delete();
    }
}
