<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'No user found for this email address.'
            ], 400);
        }

        // Check if user has a password (for email login)
        if (!$user->password) {
            return response()->json([
                'error' => 'This account was created with a different login method.'
            ], 400);
        }

        // Check if user is using email provider (case-insensitive)
        if ($user->provider && strtolower($user->provider) !== 'email') {
            return response()->json([
                'error' => "That email address is already in use using {$user->provider} provider."
            ], 400);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Password Incorrect'
            ], 400);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => "Bearer {$token}",
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'first_name' => 'required',
            'last_name' => 'required',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $user = User::create([
            'email' => $request->email,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'password' => Hash::make($request->password),
            'provider' => 'Email',
            'role' => 'ROLE MEMBER'
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => "Bearer {$token}",
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    public function forgot(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'No user found for this email address.'
            ], 400);
        }

        $resetToken = Str::random(60);
        
        $user->update([
            'reset_password_token' => $resetToken,
            'reset_password_expires' => now()->addHour()
        ]);

        // TODO: Send email with reset token

        return response()->json([
            'success' => true,
            'message' => 'Please check your email for the link to reset your password.'
        ]);
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $user = User::where('reset_password_token', $request->token)
                   ->where('reset_password_expires', '>', now())
                   ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Password reset token is invalid or has expired.'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'reset_password_token' => null,
            'reset_password_expires' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your password has been successfully reset.'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to authenticate with Google.'], 401);
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if (!$user) {
            $user = User::create([
                'email' => $googleUser->getEmail(),
                'first_name' => $googleUser->user['given_name'] ?? '',
                'last_name' => $googleUser->user['family_name'] ?? '',
                'provider' => 'Google',
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'role' => 'member',
            ]);
        } else {
            // Nếu user đã tồn tại nhưng chưa có google_id thì cập nhật
            if (!$user->google_id) {
                $user->google_id = $googleUser->getId();
                $user->provider = 'Google';
                $user->avatar = $googleUser->getAvatar();
                $user->save();
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // Redirect về frontend kèm token
        $redirectUrl = config('app.frontend_url', 'http://localhost:3000') . '/auth-success?token=' . urlencode('Bearer ' . $token);
        return redirect($redirectUrl);
    }
} 