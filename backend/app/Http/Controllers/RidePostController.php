<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Resources\RidePostResource;
use App\Models\RidePost;
use App\Notifications\RideCancelled;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class RidePostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(RidePost::class, 'ridePost');
    }

    public function index(Request $request)
    {
        $filters = RidePost::query();

        if (!empty($request->departure_city)) {
            $filters->where('departure_city', $request->departure_city);
        }

        if (!empty($request->destination_city)) {
            $filters->where('destination_city', $request->destination_city);
        }

        if (!empty($request->available_seats)) {
            $filters->whereRaw('total_seats - (SELECT COUNT(*)
                                                    FROM ride_post_passenger
                                                    WHERE ride_post_passenger.ride_post_id = ride_posts.id)
                                     >= ?',
                [$request->available_seats]);
        }

        if (!empty($request->price)) {
            $filters->where('price_per_seat', "<=", $request->price);
        }

        if (!empty($request->departure_date)) {
            $filters->whereDate('departure_date', $request->departure_date);
        }

        return RidePostResource::collection($filters->simplePaginate(15));
    }

    public function show(RidePost $ridePost)
    {
        return new RidePostResource($ridePost);
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
                'vehicle' => 'required|string',
            ]);

            $validatedRequestData['departure_time'] =
                Carbon::createFromFormat('d-m-Y H:i', $validatedRequestData['departure_time'])
                    ->format('Y-m-d H:i:s');

            $ridePost = RidePost::create([
                'driver_id' => auth()->id(),
                'departure_time' => $validatedRequestData['departure_time'],
                'total_seats' => $validatedRequestData['total_seats'],
                'price_per_seat' => $validatedRequestData['price_per_seat'],
                'departure_city' => $validatedRequestData['departure_city'],
                'destination_city' => $validatedRequestData['destination_city'],
                'vehicle' => $validatedRequestData['vehicle'],
            ]);

            throw_if(!$ridePost, GeneralJsonException::class);

            return new RidePostResource($ridePost);

        } catch (ValidationException $e) {

            return response()->json(['message' => 'Invalid input.'], 500);
        } catch (Exception) {

            return response()->json(['message' => 'An error occurred when storing the ride post.'], 500);
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
                'vehicle' => 'required|string',
            ]);

            if (isset($validatedRequestData['departure_time'])) {
                $validatedRequestData['departure_time'] =
                    Carbon::createFromFormat('d-m-Y H:i', $validatedRequestData['departure_time'])
                        ->format('Y-m-d H:i:s');
            }

            $updatedRidePost = $ridePost->update($validatedRequestData);

            throw_if(!$updatedRidePost, GeneralJsonException::class);

            return new RidePostResource($ridePost);

        } catch (ValidationException $e) {

            return response()->json(['message' => 'Invalid input.'], 500);
        } catch (Exception) {

            return response()->json(['message' => 'An error occurred when updating the ride post.'], 500);
        }
    }

    public function destroy(RidePost $ridePost)
    {
        DB::transaction(function () use ($ridePost) {

            $ridePost->requests()->delete();

            if ($ridePost->status == 'pending') {
                Notification::send($ridePost->passengers, new RideCancelled($ridePost));
            }

            $ridePost->delete();
        });
    }

    /**
     * @throws AuthorizationException
     */
    public function complete(RidePost $ridePost)
    {
        $this->authorize('complete', $ridePost);

        DB::transaction(function () use ($ridePost) {

            if (Carbon::now()->isAfter($ridePost->departure_time)) {

                    $ridePost->requests()->delete();

                    $ridePost->status = "completed";

                    $ridePost->save();

            } else {
                throw new GeneralJsonException("You must finish the ride to complete it.", 405);
            }
        });

        return response()->json(['message' => 'Successfully completed ride.']);
    }
}