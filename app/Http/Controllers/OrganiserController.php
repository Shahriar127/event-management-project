<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganiserRequest;
use App\Http\Resources\OrganiserResource;
use App\Models\Organiser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

class OrganiserController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Organiser::class);

        return OrganiserResource::collection(Organiser::all());
    }

    /**
     * Show the form for creating a new organiser.
     */
    public function create(): Response
    {
        $this->authorize('create', Organiser::class);

        return Inertia::render('Organiser/create-organiser');
    }

    public function store(OrganiserRequest $request)
    {
        $this->authorize('create', Organiser::class);

        $data = $request->validated();

        // Ensure organiser_id is set (DB migration requires non-null).
        // Use the next available organiser_id based on current max to avoid collisions.
        $nextOrganiserId = (int) Organiser::max('organiser_id') + 1;
        $data['organiser_id'] = $nextOrganiserId;

        // Handle logo upload if provided
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('organiser-logos', 'public');
            $data['logo'] = $path;
        }

        // Ensure non-nullable DB columns are not null (migration created these as NOT NULL).
        // Convert potential nulls (from ConvertEmptyStringsToNull) to empty strings so insert doesn't fail.
    $data['facebook_link'] = $data['facebook_link'] ?? '';
    $data['description'] = $data['description'] ?? '';

        // Create organiser associated with the authenticated user so user_id is set.
        $organiser = $request->user()->organiser()->create($data);

        // Flash a success message and redirect the user to the dashboard.
        // For Inertia visits we use Inertia::location after flashing so the
        // client will navigate and the flash will be available on the next
        // GET request. For API clients, return the JSON resource.
        $request->session()->flash('success', 'Organiser created successfully.');

        if ($request->header('X-Inertia')) {
            return \Inertia\Inertia::location(route('dashboard'));
        }

        return redirect()->route('dashboard');
    }

    public function show(Organiser $organiser)
    {
        $this->authorize('view', $organiser);

        return new OrganiserResource($organiser);
    }

    public function update(OrganiserRequest $request, Organiser $organiser)
    {
        $this->authorize('update', $organiser);

        $organiser->update($request->validated());

        return new OrganiserResource($organiser);
    }

    public function destroy(Organiser $organiser)
    {
        $this->authorize('delete', $organiser);

        $organiser->delete();

        return response()->json();
    }
}
