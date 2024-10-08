<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\RidePost;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Review::class, 'review');
    }

    public function index()
    {
        return ReviewResource::collection(Review::all());
    }

    // public function store(StoreReviewRequest $request)
    // {
    //     return DB::transaction(function () use ($request) {
    //         $rideId = $request->input('ride_id');
    //         $ride = RidePost::findOrFail($rideId);

    //         $passengerIds = $ride->passengers->pluck('id')->toArray();

    //         throw_if(in_array(Auth::id(), $passengerIds) || $ride->driver_id != Auth::id(),
    //             GeneralJsonException::class,
    //             'Can`t add a review on a ride where you`re not a passenger or driver.');

    //         throw_if($ride->status !== 'completed',
    //             GeneralJsonException::class,
    //             'Can`t add a review on an uncompleted ride.');

    //         $review = Review::create([
    //             'ride_id' => $rideId,
    //             'reviewer_id' => Auth::id(),
    //             'reviewee_id' => $request->input('reviewee_id'),
    //             'rating' => $request->input('rating'),
    //             'comment' => $request->input('comment'),
    //         ]);

    //         throw_if(!$review, GeneralJsonException::class, 'Failed to create review.');

    //         return new ReviewResource($review);
    //     });
    // }



    public function store(StoreReviewRequest $request)
{
    return DB::transaction(function () use ($request) {
        $rideId = $request->input('ride_id');
        $ride = RidePost::findOrFail($rideId);

        // Get all passengers' IDs from the ride
        $passengerIds = $ride->passengers->pluck('id')->toArray();

        // Check if the user is allowed to submit a review (driver reviews passengers, passenger reviews driver)
        $isPassengerReviewingDriver = in_array(Auth::id(), $passengerIds) && $request->input('reviewee_id') == $ride->driver_id;
        $isDriverReviewingPassenger = Auth::id() == $ride->driver_id && in_array($request->input('reviewee_id'), $passengerIds);

        // If neither condition is true, throw an exception
        throw_if(
            !$isPassengerReviewingDriver && !$isDriverReviewingPassenger,
            GeneralJsonException::class,
            'Can`t add a review on a ride where you`re not a passenger or driver.'
        );

        // Ensure the ride is completed before adding reviews
        throw_if($ride->status !== 'completed',
            GeneralJsonException::class,
            'Can`t add a review on an uncompleted ride.');

        // Create the review
        $review = Review::create([
            'ride_id' => $rideId,
            'reviewer_id' => Auth::id(),
            'reviewee_id' => $request->input('reviewee_id'),
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        throw_if(!$review, GeneralJsonException::class, 'Failed to create review.');

        return new ReviewResource($review);
    });
}
    public function show(Review $review)
    {
        return new ReviewResource($review);
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        return DB::transaction(function () use ($request, $review) {
            $updated = $review->update([
                'rating' => $request->input('rating'),
                'comment' => $request->input('comment'),
            ]);

            throw_if(!$updated, GeneralJsonException::class, 'Failed to update review.');

            return new ReviewResource($review);
        });
    }

    public function destroy(Review $review)
    {
        return DB::transaction(function () use ($review) {
            $deleted = $review->delete();

            throw_if(!$deleted, GeneralJsonException::class, 'Failed to delete review.');

            return response()->json(['message' => 'Review deleted successfully']);
        });
    }

    public function getUserReviews($userId)
    {
        $user = User::findOrFail($userId);
        $reviews = $user->reviewsReceived()->get();
        return ReviewResource::collection($reviews);
    }

    public function getMyReviews()
    {
        $reviews = Auth::user()->reviewsGiven()->get();
        return ReviewResource::collection($reviews);
    }
}

