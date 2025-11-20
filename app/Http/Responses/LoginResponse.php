<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class LoginResponse implements LoginResponseContract
{
    /**
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        // After successful login, decide where to send the user.
        // - If the authenticated user already has an organiser, send to intended URL or dashboard.
        // - If the user does NOT have an organiser, ALWAYS send to create-organiser (force the onboarding step)
        $user = $request->user();

        if ($user && ! $user->organiser()->exists()) {
            // Force new users to the organiser creation onboarding page, ignoring any previously intended URL.
            $intended = route('create-organiser');
        } else {
            // Existing organisers may be redirected to their intended page, falling back to dashboard.
            $intended = $request->session()->pull('url.intended', route('dashboard'));
        }

        if ($request->header('X-Inertia')) {
            return Inertia::location($intended);
        }

        return redirect()->intended($intended);
    }
}
