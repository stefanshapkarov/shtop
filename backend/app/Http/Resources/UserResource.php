<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'admin' => $this->admin,
            'name' => $this->name,
            'email' => $this->email,
            'profile_picture' => $this->profile_picture,
            'phone_number' => $this->phone_number,
            'birth_date' => $this->birth_date,
            'bio' => $this->bio,
            'location' => $this->location,
            'rating_as_passenger' => $this->getRatingAsPassenger() ?? 'N\A',
            'rating_as_driver' => $this->getRatingAsDriver() ?? 'N\A',
            'completed_rides' => $this->drivenRidePosts()->count(),
            'rides_as_driver' => $this->drivenRidePosts,
            'rides_as_passenger' => $this->passengerRidePosts,
            'reviews_given' => $this->reviewsGiven,
            'reviews_received' => $this->reviewsReceived,
            'created_at' => (string)$this->created_at,
            'updated_at' => (string)$this->updated_at
        ];
    }
}
