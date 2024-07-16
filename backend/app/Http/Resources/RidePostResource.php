<?php

namespace App\Http\Resources;

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
            'available_seats' => $this->available_seats,
            'price_per_seat' => $this->price_per_seat,
            'departure_city' => $this->departure_city,
            'destination_city' => $this->destination_city,
            'reviews' => ReviewResource::collection($this->reviews),
            'created_at' => $this->created_at->toDateTimeString()
        ];
    }
}
