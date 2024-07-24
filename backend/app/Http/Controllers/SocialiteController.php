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

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Log::info('Social User Email: ' . $socialUser->getEmail());
            // Log::info('Social User Name: ' . $socialUser->getName());

            $email = $socialUser->getEmail();
            $name = $socialUser->getName() ?? substr($email, 0, strpos($email, '@'));

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make(uniqid()),
                ]);
            }

            Auth::login($user);

            $token = $user->createToken('socialite-token')->plainTextToken;
            // dd($token);
            // $accessToken = $request->input('access_token');
            // $accessToken = $socialUser->token;
            $isAuth = false;
            if($token !==null){
                $isAuth = true;
            }
            // return response()->json(['token' => $token]);

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->to($frontendUrl . '?token=' . urlencode($token));

        } catch (\Exception $e) {
            Log::error('Error in Socialite: ' . $e->getMessage());
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

}
