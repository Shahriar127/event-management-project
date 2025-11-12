<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        // After successful registration, log out the user and redirect to login page.
        Auth::logout();

        if ($request->header('X-Inertia')) {
            return Inertia::location('/login');
        }

        return redirect('/login');
    }
}
