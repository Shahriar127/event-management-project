<?php

use App\Http\Controllers\OrganiserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'serverPing' => [
            'message' => 'pong',
            'time' => now(),
        ],
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/create-organiser', [OrganiserController::class, 'create'])->name('create-organiser');

    // Store organiser (form posts to /organiser)
    Route::post('/organiser', [OrganiserController::class, 'store'])->name('organiser.store');

    // Show organiser details (includes logo URL)
    Route::get('/organiser/{organiser}', [OrganiserController::class, 'show'])->name('organiser.show');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Simple test page to verify frontend <-> backend communication.
Route::get('/test-api', function () {
    return Inertia::render('TestApi');
})->name('test-api');

// A lightweight JSON endpoint used by the frontend test page.
Route::get('/api/ping', function () {
    return response()->json([
        'message' => 'pong',
        'time' => now(),
    ]);
});

require __DIR__.'/settings.php';
