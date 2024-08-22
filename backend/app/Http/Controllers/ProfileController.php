<?php

namespace App\Http\Controllers;

use App\Exceptions\GeneralJsonException;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = DB::transaction(function () use ($request) {

            $user = Auth::user();

            $imagePath = $user->profile_picture;

            if ($request->hasFile('profile_picture')) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $imagePath));

                $file = $request->file('profile_picture');

                $imagePath = $file->store('profile_pictures', 'public');
                $imagePath = asset(Storage::url($imagePath));
            }

            $updated = $user->update([
                'profile_picture' => $imagePath,
                'bio' => $request->input('bio'),
                'location' => $request->input('location'),
                'birth_date' => $request->input('birth_date'),
                'phone_number' => $request->input('phone_number'),
            ]);

            throw_if(!$updated, GeneralJsonException::class, 'Failed to update profile info.');

            return $user;
        });

        return new UserResource($user);
    }
}
