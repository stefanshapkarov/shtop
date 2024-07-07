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
        return $this->belongsTo(User::class);
    }

    public function passengers()
    {
        return $this->belongsToMany(User::class,
            'ride_post_passenger', 'ridepost_id', 'passenger_id');
    }
}
