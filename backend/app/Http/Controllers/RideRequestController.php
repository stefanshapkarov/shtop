<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Models\RidePost;
use App\Models\RideRequest;
use Illuminate\Support\Facades\DB;
use Throwable;

class RideRequestController extends Controller
{
    public function getPendingRequestsForPost(RidePost $ridePost)
    {
        return RideRequest::where('ridepost_id', $ridePost->id)->where('status', 'pending')->get();
    }

    public function getRequestsForLoggedInUser()
    {
        return RideRequest::where('passenger_id', auth()->id())->get();
    }

    /**
     * @throws GeneralJsonException
     * @throws Throwable
     */
    public function createRequestForPost(RidePost $ridePost)
    {
        if ($ridePost->available_seats > 0) {

            $request = RideRequest::create([
                'passenger_id' => auth()->id(),
                'ridepost_id' => $ridePost->id
            ]);

        } else {
            throw new GeneralJsonException("Unable to create request - no seats available.");
        }

        throw_if(!$request, GeneralJsonException::class, "Unable to create request.");
    }

    public function acceptRequest(RideRequest $rideRequest)
    {
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

    public function rejectRequest(RideRequest $rideRequest)
    {
        if ($rideRequest->status == "pending") {
            $rideRequest->status = "rejected";
            $rideRequest->save();
        } else {

            return response()->json(['message' => 'Request is not pending, unable to update.']);
        }

        return response()->json(['message' => 'Request rejected.']);
    }
}
