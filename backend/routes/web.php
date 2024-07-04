<?php

use Illuminate\Support\Facades\Route;

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


Route::get('/welcome-mail', function (\Illuminate\Http\Request $request) {
    return view('mail.welcome-mail',
        [
            'name' => "Stefan"
        ]
    );
});

Route::get('/verify-email', function (\Illuminate\Http\Request $request) {
    return view('mail.verify-email',
        [
            'name' => "Stefan",
            'url' => "url"
        ]
    );
});
