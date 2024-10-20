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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;


class RidePostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(RidePost::class, 'ridePost');
    }

    public function getLoggedInUserRides(Request $request)
    {
        $user = auth()->user();

        $as_driver = $request->boolean('as_driver', null);
        $status = $request->input('status');

        $prom = DB::table('ride_post_passenger')
            ->select('ride_post_id')
            ->where('passenger_id', $user->id);

        $ridePosts = RidePost::query()->with(['driver', 'passengers', 'reviews'])
            ->when($as_driver !== null, function ($query) use ($prom, $user, $as_driver) {
                $query->when($as_driver,
                    fn($query) => $query->where('driver_id', $user->id),
                    fn($query) => $query->whereIn('id', $prom));
            }, function ($query) use ($prom, $user) {
                $query->where(fn($query) => $query->where('driver_id', $user->id)
                    ->orWhereIn('id', $prom));
            })
            ->when($status, fn($query) => $query->where('status', $status));

        return RidePostResource::collection($ridePosts->orderBy('departure_time')->simplePaginate(15));
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
            $filters->whereDate('departure_time', $request->departure_date);
        }

        if (!empty($request->sort_by)) {
            $sortBy = $request->sort_by;

            if ($sortBy === 'price') {
                $filters->orderBy('price_per_seat');
            } else if ($sortBy === 'departure_time') {
                $filters->orderBy('departure_time');
            }
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
            Log::info('Request data:', $request->all());

            $validatedRequestData = $request->validate([
                'departure_time' => 'required|date|after:now|date_format:d-m-Y H:i',
                'total_seats' => 'required|numeric|min:1',
                'price_per_seat' => 'required|numeric|min:1',
                'departure_coords' => 'required|string',
                'departure_city' => 'required|string',
                'destination_coords' => 'required|string|different:departure_coords',
                'destination_city' => 'required|string|different:departure_city',
                'duration' => 'required|date_format:H:i',
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
                'duration' => $validatedRequestData['duration'],
                'vehicle' => $validatedRequestData['vehicle'],
                'destination_coords' => $validatedRequestData['destination_coords'],
                'departure_coords' => $validatedRequestData['departure_coords'],
            ]);

            throw_if(!$ridePost, GeneralJsonException::class);
            return new RidePostResource($ridePost);

        } catch (ValidationException $e) {
            Log::error('Validation failed:', $e->errors());

            return response()->json(['message' => 'Invalid input.'], 500);
            // return response()->json([
            //     'message' => 'Validation failed',
            //     'errors' => $e->errors()
            // ], 422);  // Use 422 for validation errors
        } catch (Exception $e) {
            Log::error('Store failed:', ['error' => $e->getMessage()]);

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
                'departure_coords' => 'required|string',
                'departure_city' => 'sometimes|string',
                'destination_coords' => 'required|string|different:departure_coords',
                'destination_city' => 'sometimes|string|different:departure_city',
                'duration' => 'required|date_format:H:i',
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

            // return response()->json(['message' => 'Invalid input.'], 500);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);  // Use 422 for validation errors
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
            Log::info('Current Time:', ['now' => Carbon::now()->toDateTimeString()]);
            Log::info('Departure Time:', ['departure_time' => $ridePost->departure_time]);

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
