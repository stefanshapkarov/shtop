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
        Schema::create('ride_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->nullable()
                ->constrained('users')->onDelete('set null')->onUpdate('cascade');
            $table->dateTime('departure_time');
            $table->integer('total_seats');
            $table->float('price_per_seat');
            $table->string('departure_city');
            $table->string('destination_city');
            $table->enum('status', ['pending', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ride_posts');
    }
};
