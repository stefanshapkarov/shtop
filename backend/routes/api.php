<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RidePostController;
use App\Http\Controllers\RideRequestController;
use App\Http\Controllers\SocialiteController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/loginFrontend/{id}', function ($id) {
    Auth::loginUsingId($id);
});

Route::get('/reset-password/{token}', function ($token){
    return response([
        'token' => $token
    ]);
})->middleware(['guest:'.config('fortify.guard')])
    ->name('password.reset');

Route::middleware('auth:sanctum')
    ->group(function () {
        Route::get('/user', function (Request $request) {
            return new UserResource($request->user());
        });

        Route::get('/user/{id}', function ($id) {
            $user = User::findOrFail($id);
            return new UserResource($user);
        });

        Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'updateProfile'])->name('updateProfile');

        // REVIEWS
        Route::apiResource('reviews', ReviewController::class);

        Route::get('users/{userId}/reviews', [ReviewController::class, 'getUserReviews'])->name('users.reviews');
        Route::get('my-reviews', [ReviewController::class, 'getMyReviews'])->name('my.reviews');

        // RIDE POSTS
        Route::post('/ridePost', [RidePostController::class, 'store']);
        Route::patch('/ridePost/{ridePost:id}', [RidePostController::class, 'update']);
        Route::delete('/ridePost/{ridePost:id}', [RidePostController::class, 'destroy']);
        Route::get('/ridePost/{ridePost:id}/complete', [RidePostController::class, 'complete']);
        Route::get('/ridePost/myRides', [RidePostController::class, 'getLoggedInUserRides']);

        // RIDE REQUESTS
        Route::get('/ridePost/{ridePost:id}/requests', [RideRequestController::class, 'getRequestsForPost']);
        Route::get('/ridePost/{ridePost:id}/requests/new', [RideRequestController::class, 'createRequestForPost']);
        Route::get('/ridePost/requests/{rideRequest:id}/accept', [RideRequestController::class, 'acceptRequest']);
        Route::get('/ridePost/requests/{rideRequest:id}/reject', [RideRequestController::class, 'rejectRequest']);
        Route::get('/ridePost/requests/{rideRequest:id}/cancel', [RideRequestController::class, 'destroy']);
    });

// RIDE POSTS UNAUTHORIZED ACCESS

Route::get('/ridePost', [RidePostController::class, 'index']);
Route::get('/ridePost/{ridePost:id}', [RidePostController::class, 'show']);

