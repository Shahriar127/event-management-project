<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganiserRequest;
use App\Http\Resources\OrganiserResource;
use App\Http\Responses\OrganiserResponse;
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
        $res = new OrganiserResponse();
        return $res->collection(Organiser::all());
    }

    /**
     * Show the form for creating a new organiser.
     */
    public function create(): Response
    {
        $this->authorize('create', Organiser::class); //whether the currently logged-in user is allowed to create a new Organiser.
        $res = new OrganiserResponse();
        return $res->create();
    }

    public function store(OrganiserRequest $request)
    {
        $this->authorize('create', Organiser::class);

        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('organiser-logos', 'public'); //Laravel auto-generates a unique file name to prevent overwrite.
            $data['logo'] = $path;
        }

       $organiser = $request->user()->organiser()->create($data);

        $res = new OrganiserResponse();
        return $res->created($request, $organiser);
    }

    public function show(Organiser $organiser)
    {
        $this->authorize('view', $organiser);
        $res = new OrganiserResponse();
        return $res->resource($organiser);
    }

    public function update(OrganiserRequest $request, Organiser $organiser)
    {
        $this->authorize('update', $organiser);

        $organiser->update($request->validated());
        $res = new OrganiserResponse();
        return $res->resource($organiser);
    }

    public function destroy(Organiser $organiser)
    {
        $this->authorize('delete', $organiser);

        $organiser->delete();
        $res = new OrganiserResponse();
        return $res->json();
    }
}
