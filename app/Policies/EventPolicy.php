<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        // Allow any authenticated user to list events
        return true;
    }

    public function view(User $user, Event $event): bool
    {
        // Allow viewing if the event belongs to the user's organiser
        if ($user->organiser()->exists()) {
            return $event->organiser_id === $user->organiser->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        // User must have an organiser record to create events
        return $user->organiser()->exists();
    }

    public function update(User $user, Event $event): bool
    {
        // Only the organiser that owns the event may update it
        if ($user->organiser()->exists()) {
            return $event->organiser_id === $user->organiser->id;
        }

        return false;
    }

    public function delete(User $user, Event $event): bool
    {
        // Only the organiser that owns the event may delete it
        if ($user->organiser()->exists()) {
            return $event->organiser_id === $user->organiser->id;
        }

        return false;
    }

    public function restore(User $user, Event $event): bool
    {
        // Follow same rules as delete/update
        if ($user->organiser()->exists()) {
            return $event->organiser_id === $user->organiser->id;
        }

        return false;
    }

    public function forceDelete(User $user, Event $event): bool
    {
        // Follow same rules as delete/update
        if ($user->organiser()->exists()) {
            return $event->organiser_id === $user->organiser->id;
        }

        return false;
    }
}
