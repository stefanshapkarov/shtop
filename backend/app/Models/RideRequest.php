<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RideRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function passenger()
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }

    public function ridePost()
    {
        return $this->belongsTo(RidePost::class, 'ridepost_id');
    }
}
