<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\OrganiserResource;
use Illuminate\Http\JsonResponse;

class OrganiserResponse
{

    public function create(): \Inertia\Response
    {
        return Inertia::render('Organiser/create-organiser');
    }

    public function created(Request $request, $organiser)
    {
        $request->session()->flash('success', 'Organiser created successfully.');

        if ($request->header('X-Inertia')) {
            return Inertia::location(route('dashboard'));
        }

        return redirect()->route('dashboard');
    }


    public function collection($collection)
    {
        return OrganiserResource::collection($collection);
    }

    /**
     * Return single organiser resource.
     */
    public function resource($organiser)
    {
        return new OrganiserResource($organiser);
    }

    /**
     * Return an empty JSON response (for delete).
     */
    public function json(): JsonResponse
    {
        return response()->json();
    }
}
