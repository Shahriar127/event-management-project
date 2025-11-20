<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Event::class);

        return EventResource::collection(Event::all());
    }

    public function store(EventRequest $request)
    {
        $this->authorize('create', Event::class);
        $data = $request->validated();

        // Handle uploaded image file
        if ($request->hasFile('ImageUrl')) {
            $path = $request->file('ImageUrl')->store('event-images', 'public');
            $data['ImageUrl'] = $path;
        }

        // Associate with the authenticated organiser if present
        $organiser = $request->user()->organiser;
        if ($organiser) {
            $data['organiser_id'] = $organiser->id;
        }

    // Ensure EventVisibility has a sensible default to satisfy NOT NULL DB constraint.
    $data['EventVisibility'] = $data['EventVisibility'] ?? 'public';
        // AddressLine2 may be nullable in UI, but ensure a value for DB if required.
        $data['AddressLine2'] = $data['AddressLine2'] ?? '';

        $event = Event::create($data);

        // If Inertia request, redirect to events listing with flash
        if ($request->header('X-Inertia')) {
            $request->session()->flash('success', 'Event created successfully.');
            return \Inertia\Inertia::location(route('events'));
        }

        return new EventResource($event);
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);

        return new EventResource($event);
    }

    public function update(EventRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        $event->update($request->validated());

        return new EventResource($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return response()->json();
    }
}
