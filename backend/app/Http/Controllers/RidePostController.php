<?php

namespace App\Http\Controllers;

use App\Models\RidePost;
use Exception;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RidePostController extends Controller
{

    public function index()
    {
        return RidePost::all();
    }

    public function show(RidePost $ridePost)
    {
        return $ridePost;
    }

    public function getRidePostsForLoggedInUser()
    {
        return RidePost::where('driver_id', auth()->id())->get();
    }

    public function store(Request $request)
    {
        try {
            $validatedRequestData = $request->validate([
                'departure_time' => 'required|date|after:now|date_format:d-m-Y H:i',
                'total_seats' => 'required|numeric|min:1',
                'price_per_seat' => 'required|numeric|min:1',
                'departure_city' => 'required|string',
                'destination_city' => 'required|string|different:departure_city',
            ]);

            $driver = auth()->user();

            $validatedRequestData['departure_time'] =
                Carbon::createFromFormat('d-m-Y H:i', $validatedRequestData['departure_time'])
                    ->format('Y-m-d H:i:s');

            RidePost::create([
                'driver_id' => $driver->id,
                'departure_time' => $validatedRequestData['departure_time'],
                'total_seats' => $validatedRequestData['total_seats'],
                'available_seats' => $validatedRequestData['total_seats'],
                'price_per_seat' => $validatedRequestData['price_per_seat'],
                'departure_city' => $validatedRequestData['departure_city'],
                'destination_city' => $validatedRequestData['destination_city'],
            ]);

            return response()->json(['message' => 'Ride post created successfully.'], 201);

        } catch (Exception) {

            return response()->json(['message' => 'Unable to create ride post, check your input and try again.'], 500);
        }
    }

    public function update(Request $request, RidePost $ridePost)
    {
        try {
            $validatedRequestData = $request->validate([
                'departure_time' => 'sometimes|date|after:now|date_format:d-m-Y H:i',
                'total_seats' => 'sometimes|numeric|min:1',
                'price_per_seat' => 'sometimes|numeric|min:1',
                'departure_city' => 'sometimes|string',
                'destination_city' => 'sometimes|string|different:departure_city',
            ]);

            if (isset($validatedRequestData['departure_time'])) {
                $validatedRequestData['departure_time'] =
                    Carbon::createFromFormat('d-m-Y H:i', $validatedRequestData['departure_time'])
                        ->format('Y-m-d H:i:s');
            }

            $ridePost->update($validatedRequestData);

            return response()->json(['message' => 'Ride post updated successfully.']);

        } catch (Exception) {

            return response()->json(['message' => 'Unable to update ride post, check your input and try again.'], 500);
        }
    }

    public function destroy(RidePost $ridePost)
    {
        $ridePost->delete();
    }
}
