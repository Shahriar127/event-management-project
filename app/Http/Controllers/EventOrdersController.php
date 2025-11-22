<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventOrdersController extends Controller
{
    /**
     * Display a listing of the orders for an event.
     */
    public function show(Request $request, Event $event)
    {
        // Authorize using existing event policy if present
        if (method_exists($this, 'authorize')) {
            $this->authorize('view', $event);
        }

        $perPage = 15;
        $orders = $event->orders()
            ->with(['user', 'items.ticket'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('events/orders', [
            'event' => $event,
            'orders' => $orders,
        ]);
    }
}
