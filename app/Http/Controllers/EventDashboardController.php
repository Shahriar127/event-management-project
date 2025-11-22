<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventDashboardController
{
    /**
     * Display the dashboard for a single event.
     */
    public function show(Event $event, Request $request)
    {
        // Load relations we may want to show (tickets currently)
        $event->load('tickets');

        // Placeholder metrics: real values require orders/attendees implementation
        $ticketsSold = 0;
        $ordersCount = 0;
        $revenue = 0.00;
        $views = 0;

        // Compose chart placeholders (empty series for now)
        $chartData = [
            'tickets_sold' => [],
            'sales_volume' => [],
            'registrations_by_ticket' => [],
        ];

        return Inertia::render('events/dashboard', [
            'event' => $event,
            'metrics' => [
                'revenue' => number_format($revenue, 2, '.', ''),
                'orders' => $ordersCount,
                'tickets_sold' => $ticketsSold,
                'views' => $views,
            ],
            'charts' => $chartData,
        ]);
    }
}
