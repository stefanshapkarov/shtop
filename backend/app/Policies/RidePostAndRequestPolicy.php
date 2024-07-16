<?php

namespace App\Policies;

use App\Models\RidePost;
use App\Models\RideRequest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RidePostAndRequestPolicy
{
    /**
     * Determine whether the user can view any Ride Posts.
     */
    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view a Ride Post.
     */
    public function view(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view their own Ride Posts.
     */
    public function getRidePostsForLoggedInUser(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create a Ride Post.
     */
    public function create(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update a Ride Post.
     */
    public function update(User $user, RidePost $ridePost): bool
    {
        return $user->id === $ridePost->driver->id;
    }

    /**
     * Determine whether the user can delete a Ride Post.
     */
    public function delete(User $user, RidePost $ridePost): bool
    {
        return $user->id === $ridePost->driver->id;
    }

    /**
     * Determine whether the user can see all ride requests for a ride post.
     */
    public function getRequestsForPost(User $user, RidePost $ridePost): bool
    {
        return $user->id == $ridePost->driver->id;
    }

    /**
     * Determine whether the user can view any personal ride request.
     */
    public function getRequestsForLoggedInUser(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create ride requests.
     */
    public function createRequestForPost(User $user, RidePost $ridePost): bool
    {
        return $user->id != $ridePost->driver->id;
    }

    /**
     * Determine whether the user can accept the ride request.
     */
    public function acceptRequest(User $user, RideRequest $rideRequest): bool
    {
        return $user->id == $rideRequest->ridePost->driver->id;
    }

    /**
     * Determine whether the user can reject the ride request.
     */
    public function rejectRequest(User $user, RideRequest $rideRequest): bool
    {
        return $user->id == $rideRequest->ridePost->driver->id;
    }
}
