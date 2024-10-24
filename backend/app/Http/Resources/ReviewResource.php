<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'ride_id' => $this->ride_id,
            'reviewer_id' => $this->reviewer_id,
            'reviewer_name' => $this->reviewer->name,
            'reviewee_id' => $this->reviewee_id,
            'reviewee_name' => $this->reviewee->name,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
