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
        // After successful login, redirect users to the create-organiser page.
        // For Inertia requests we must return an Inertia location so the
        // client-side router navigates correctly. For regular requests, use
        // the normal redirect()->intended().
        $intended = $request->session()->pull('url.intended', route('create-organiser'));

        if ($request->header('X-Inertia')) {
            return Inertia::location($intended);
        }

        return redirect()->intended($intended);
    }
}
