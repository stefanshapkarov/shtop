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
        return Socialite::driver($provider)->scopes(['profile', 'email'])->stateless()->redirect();
    }

    public function handleProviderCallback(Request $request, $provider)
    {
        $accessToken = $request->input('access_token');

        try {
            // Log access token for debugging
            Log::info('Access Token: ' . $accessToken);

            $socialUser = Socialite::driver($provider)->stateless()->userFromToken($accessToken);

            // Log user info for debugging
            Log::info('Social User Email: ' . $socialUser->getEmail());

            // Extract name from email
            $email = $socialUser->getEmail();
            $name = $socialUser->getName() ?? substr($email, 0, strpos($email, '@'));

            Log::info('Social User Name: ' . $name);

        } catch (\Exception $e) {
            // Log error for debugging
            Log::error('Error in Socialite: ' . $e->getMessage());

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            // Create a new user if it doesn't exist
            $user = User::create([
                'name' => $name, // Use extracted name
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(uniqid()), // Generate a random password
            ]);
        }

        // Log the user in
        Auth::login($user);

        // Generate Sanctum token (if using Sanctum for API authentication)
        $token = $user->createToken('socialite-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

}
