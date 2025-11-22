<?php

use App\Http\Controllers\OrganiserController;
use Illuminate\Http\Request;
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

Route::get('/signup', function () {
    return Inertia::render('auth/register', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->middleware(['web'])->name('signup');

// Custom login route to allow authenticated users to access it
Route::get('/login', function (Request $request) {
    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
        'status' => $request->session()->get('status'),
    ]);
})->middleware(['web'])->name('login');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/create-organiser', [OrganiserController::class, 'create'])->name('create-organiser');

    // Store organiser (form posts to /organiser)
    Route::post('/organiser', [OrganiserController::class, 'store'])->name('organiser.store');

    // Show organiser details (includes logo URL)
    Route::get('/organiser/{organiser}', [OrganiserController::class, 'show'])->name('organiser.show');

    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'show'])->name('dashboard');

    // Events listing for the authenticated organiser
    Route::get('/events', function () {
        // Load organiser with latest 10 events to render on the organiser events page
        $organiser = auth()->user()->organiser()
            ->with(['events' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }])
            ->first();

        return Inertia::render('events', [
            'organiser' => $organiser,
        ]);
    })->name('events');

    // Show create event form
    Route::get('/events/create', function () {
        $organiser = auth()->user()->organiser;

        return Inertia::render('events/create', [
            'organiser' => $organiser,
        ]);
    })->name('events.create');

    // Handle create event POST
    Route::post('/events', [\App\Http\Controllers\EventController::class, 'store'])->name('events.store');

    // Event tickets management page (first-run flow)
    Route::get('/event/{event}/tickets', [\App\Http\Controllers\EventTicketsController::class, 'show'])->name('event.tickets');
    // Create ticket for an event (posted by tickets modal)
    Route::post('/event/{event}/tickets', [\App\Http\Controllers\TicketController::class, 'store'])->name('event.tickets.store');
    // Event orders listing page
    Route::get('/event/{event}/orders', [\App\Http\Controllers\EventOrdersController::class, 'show'])->name('event.orders');
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
