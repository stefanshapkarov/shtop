<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'ride_id', 'reviewer_id', 'reviewee_id', 'rating', 'comment'
    ];

    protected $casts = [
        'rating' => 'float'
    ];

    public function ride()
    {
        return $this->belongsTo(RidePost::class, 'ride_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee()
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }
}