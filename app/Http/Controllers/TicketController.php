<?php

namespace App\Http\Controllers;

use App\Http\Requests\TicketRequest;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    use AuthorizesRequests;
    public function store(Event $event, Request $request)
    {
        $this->authorize('update', $event);

        // Support two behaviours on the same POST route:
        // 1) Creating a new ticket (title, category, price, quantity)
        // 2) Toggling an existing ticket's on_sale state when called with
        //    action=toggle and ticket_id. This allows the frontend to reuse
        //    the existing '/event/{event}/tickets' POST route for toggles.

        // Handle toggle requests (no full validation required)
            if ($request->input('action') === 'toggle' && $request->has('ticket_id')) {
                // Log toggle requests for debugging independence issues
                try {
                    Log::info('ticket.toggle.request', [
                        'user_id' => optional($request->user())->id,
                        'event_id' => $event->id,
                        'ticket_id' => $request->input('ticket_id'),
                        'ip' => $request->ip(),
                    ]);
                } catch (\Throwable $e) {
                    // swallow logging errors to avoid interfering with behavior
                }
            $ticket = Ticket::findOrFail($request->input('ticket_id'));

            if ($ticket->event_id !== $event->id) {
                abort(404);
            }

            $ticket->on_sale = !$ticket->on_sale;
            $ticket->save();

            if ($request->header('X-Inertia')) {
                $request->session()->flash('success', $ticket->on_sale ? 'Ticket resumed.' : 'Ticket paused.');
                return Inertia::location(route('event.tickets', ['event' => $event->id]));
            }

            return response()->json($ticket);
        }

        // Otherwise this is a normal ticket creation request.
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:high,mid,low'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        // Normalize quantity to an integer (nullable means unlimited)
        if (isset($data['quantity']) && $data['quantity'] !== null) {
            $data['quantity'] = (int) $data['quantity'];
        }

        $ticket = $event->tickets()->create([
            'title' => $data['title'],
            'category' => $data['category'],
            'price' => $data['price'],
            // null quantity represents "unlimited"
            'quantity' => $data['quantity'] ?? null,
        ]);

        if ($request->header('X-Inertia')) {
            $request->session()->flash('success', 'Ticket created successfully.');
            return Inertia::location(route('event.tickets', ['event' => $event->id]));
        }

        return response()->json($ticket);
    }

    /**
     * Toggle the on_sale state of a ticket (pause / resume sales).
     */
    public function toggle(Event $event, Ticket $ticket, Request $request)
    {
        $this->authorize('update', $event);

        // ensure ticket belongs to event
        if ($ticket->event_id !== $event->id) {
            abort(404);
        }

        $ticket->on_sale = !$ticket->on_sale;
        $ticket->save();

        if ($request->header('X-Inertia')) {
            $request->session()->flash('success', $ticket->on_sale ? 'Ticket resumed.' : 'Ticket paused.');
            return Inertia::location(route('event.tickets', ['event' => $event->id]));
        }

        return response()->json($ticket);
    }
}
