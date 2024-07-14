<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

    public function store(StoreReviewRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $review = Review::create([
                'ride_id' => $request->input('ride_id'),
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

