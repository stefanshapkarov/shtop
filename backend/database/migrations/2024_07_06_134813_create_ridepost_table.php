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
        Schema::create('rideposts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->dateTime('departure_time');
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->float('price_per_seat');
            $table->string('departure_city');
            $table->string('destination_city');
            $table->foreign('driver_id')
                ->references('id')->on('users')
                    ->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ridepost');
    }
};
