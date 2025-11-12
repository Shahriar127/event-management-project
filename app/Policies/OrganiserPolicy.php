<?php

namespace App\Policies;

use App\Models\Organiser;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrganiserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {

    }

    public function view(User $user, Organiser $organiser)
    {
    }

    public function create(User $user)
    {
        // Allow any authenticated user to create an organiser.
        // Change this to more restrictive logic if you only want certain users
        // (e.g. based on roles or whether they already have an organiser).
        return true;
    }
    public function update(User $user, Organiser $organiser)
    {
    }

    public function delete(User $user, Organiser $organiser)
    {
    }

    public function restore(User $user, Organiser $organiser)
    {
    }

    public function forceDelete(User $user, Organiser $organiser)
    {
    }
}
