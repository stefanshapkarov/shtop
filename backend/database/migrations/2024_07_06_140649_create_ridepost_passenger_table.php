<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ridepost_passenger', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('passenger_id');
            $table->unsignedBigInteger('ridepost_id');
            $table->timestamps();

            $table->foreign('passenger_id')->references('id')->on('users');
            $table->foreign('ridepost_id')->references('id')->on('rideposts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ridepost_passenger');
    }
};
