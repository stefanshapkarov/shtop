<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Resources\RideRequestResource;
use App\Models\RidePost;
use App\Models\RideRequest;
use App\Notifications\PassengerKickedFromRide;
use App\Notifications\PassengerLeftRide;
use App\Notifications\RideRequestAccepted;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
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
     * @throws GeneralJsonException
     * @throws Throwable
     */
    public function createRequestForPost(RidePost $ridePost)
    {
        $this->authorize('createRequestForPost', $ridePost);

        $userId = auth()->id();

        DB::transaction(function () use ($ridePost, $userId) {

            $available_seats = $ridePost->total_seats - $ridePost->passengers()->count();

            if ($available_seats > 0) {

                // Check if user has a request for current ride, or an accepted request for another pending ride
                $existingRequest =
                    RideRequest::where('passenger_id', $userId)->where('ridepost_id', $ridePost->id)->first();
                if ($existingRequest != null) {

                    throw new GeneralJsonException("You already have a request for this ride post.");
                }
                if ($this->isPassengerPartOfAPendingRide($userId)) {

                    throw new GeneralJsonException("You are already part of another pending ride post.");
                }

                $request = RideRequest::create([
                    'passenger_id' => $userId,
                    'ridepost_id' => $ridePost->id
                ]);

                throw_if(!$request, GeneralJsonException::class, "Unable to create request.");

            } else {
                throw new GeneralJsonException("Unable to create request - no seats available.");
            }
        });

        return response()->json(['message' => 'Request created successfully.']);
    }

    /**
     * @throws AuthorizationException
     * @throws GeneralJsonException
     */
    public function acceptRequest(RideRequest $rideRequest)
    {
        $this->authorize('acceptRequest', $rideRequest);

        DB::transaction(function () use ($rideRequest) {

            if ($this->isPassengerPartOfAPendingRide($rideRequest->passenger->id)) {
                throw new GeneralJsonException("Passenger got accepted in another ride.");
            }

            $ridePost = $rideRequest->ridePost;

            $available_seats = $ridePost->total_seats - $ridePost->passengers()->count();

            if ($available_seats > 0) {

                $ridePost->passengers()->attach($rideRequest->passenger);

                $rideRequest->status = "accepted";

                $ridePost->save();

                $rideRequest->save();

            } else {
                throw new GeneralJsonException("Unable to accept request - no seats available.");
            }
        });

        Notification::send($rideRequest->passenger, new RideRequestAccepted($rideRequest->ridePost));

        return response()->json(['message' => 'Request accepted, passenger added to ride.']);
    }

    /**
     * @throws AuthorizationException
     */
    public function rejectRequest(RideRequest $rideRequest)
    {
        $this->authorize('rejectRequest', $rideRequest);

        DB::transaction(function () use ($rideRequest) {

            if ($rideRequest->status == "pending") {

                $rideRequest->status = "rejected";

                $rideRequest->save();

            } else {
                throw new GeneralJsonException("Request is not pending.");
            }
        });

        return response()->json(['message' => 'Request rejected.']);
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(RideRequest $rideRequest)
    {
        $this->authorize('destroy', $rideRequest);

        DB::transaction(function () use ($rideRequest) {

            if ($rideRequest->status == "accepted") {

                $rideRequest->ridePost->passengers()->detach($rideRequest->passenger->id);

                if (auth()->id() == $rideRequest->passenger->id) {
                    Notification::send($rideRequest->ridePost->driver, new PassengerLeftRide());
                } else {
                    Notification::send($rideRequest->passenger, new PassengerKickedFromRide());
                }
            }

            $rideRequest->delete();
        });
    }

    private function isPassengerPartOfAPendingRide($userId)
    {
        $rideRequest = RideRequest::where('passenger_id', $userId)->where('status', 'accepted')->first();

        if ($rideRequest === null) {

            return false;
        }

        return true;
    }
}
