<?php

use App\Http\Controllers\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/welcome-mail', function (Request $request) {
    return view('mail.welcome-mail',
        [
            'name' => "Stefan"
        ]
    );
});

Route::get('/verify-email', function (Request $request) {
    return view('mail.verify-email',
        [
            'name' => "Stefan",
            'url' => "url"
        ]
    );
});

// Route::get('/auth/google/redirect', function (Request $request) {
//     return Socialite::driver("google")->redirect();
// });


Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'handleProviderCallback']);