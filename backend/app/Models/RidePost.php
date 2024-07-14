<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SebastianBergmann\CodeCoverage\Driver\Driver;

class RidePost extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function requests()
    {
        return $this->hasMany(RideRequest::class);
    }

    public function passengers()
    {
        return $this->belongsToMany(User::class,
            'ride_post_passenger', 'ride_post_id', 'passenger_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'ride_id');
    }
}
