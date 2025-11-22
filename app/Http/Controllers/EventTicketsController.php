<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventTicketsController extends Controller
{
    /**
     * Show the tickets management page for an event.
     */
    public function show(Event $event, Request $request)
    {
        // Load tickets for the event so the frontend can render the ticket list
        $tickets = $event->tickets()->get()->map(function ($t) {
            // compute sold count and revenue for each ticket
            $sold = (int) $t->orderItems()->sum('quantity');
            $revenue = (float) DB::table('order_items')->where('ticket_id', $t->id)->select(DB::raw('COALESCE(SUM(quantity * unit_price),0) as total'))->value('total');

            $arr = $t->toArray();
            $arr['sold_count'] = $sold;
            $arr['revenue'] = number_format($revenue, 2, '.', '');
            return $arr;
        });

        // We pass the event, its tickets and forward any first_run query flag to the page
        return Inertia::render('events/tickets', [
            'event' => $event,
            'tickets' => $tickets,
            'first_run' => $request->query('first_run'),
        ]);
    }
}
