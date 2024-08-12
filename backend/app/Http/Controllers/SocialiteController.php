<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectToProvider($provider)
    {
        $socialite = Socialite::driver($provider);
        if ($provider === 'facebook') {
            $socialite->setScopes(['email', 'public_profile']);
        } elseif ($provider === 'google') {
            $socialite->setScopes(['openid', 'profile', 'email']);
        }

        return $socialite->redirect();
    }

    public function handleProviderCallback(Request $request, $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
            $user = User::firstOrCreate(
                ['email' => $socialUser->getEmail()],
                ['name' => $socialUser->getName(), 'password' => Hash::make(uniqid())]
            );

            Auth::login($user);
            $request->session()->regenerate();

            return redirect('http://localhost:3000');
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/login')->with('error', 'Failed to login with ' . ucfirst($provider));
        }
    }
}
