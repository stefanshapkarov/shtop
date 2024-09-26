<?php

namespace App\Http\Resources;

use App\Models\RideRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RidePostResource extends JsonResource
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
            'driver' => new UserResource($this->driver),
            'departure_time' => $this->departure_time,
            'total_seats' => $this->total_seats,
            'available_seats' => $this->total_seats - $this->passengers()->count(),
            'price_per_seat' => $this->price_per_seat,
            'departure_city' => $this->departure_city,
            'destination_city' => $this->destination_city,
            'vehicle' => $this->vehicle,
            'status' => $this->status,
            'existing_request_id' => $this->hasRequestForRide(),
            'reviews' => ReviewResource::collection($this->reviews),
            'created_at' => $this->created_at->toDateTimeString()
        ];
    }

    public function hasRequestForRide()
    {
        $userId = auth()->id();

        if ($this->driver->id === $userId) {

            return null;
        }

        $tmp = RideRequest::with(['passenger', 'ridePost'])
            ->where('ridepost_id', $this->id)
            ->where('passenger_id', $userId)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        return $tmp?->id;

    }
}
