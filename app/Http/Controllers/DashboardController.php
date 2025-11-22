<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;

class DashboardController
{
    /**
     * Show the global organiser dashboard.
     */
    public function show(Request $request)
    {
        // Load organiser and eager-load latest 10 events for the right column, but
        // aggregate across ALL organiser events for metrics.
        $organiser = auth()->user()->organiser;
        $eventsForList = $organiser ? $organiser->events()->orderBy('created_at', 'desc')->limit(10)->get() : collect();

        // Aggregated metrics from orders/order_items (if organiser has events)
        $revenue = 0.00;
        $ordersCount = 0;
        $ticketsSold = 0;
        $views = 0; // page views not implemented

        $eventIds = [];
        if ($organiser) {
            // collect all event ids for this organiser (not limited)
            $eventIds = $organiser->events()->pluck('id')->toArray();

            if (count($eventIds) > 0) {
                // Total tickets sold (sum of order_items.quantity for tickets in organiser's events)
                $ticketsSold = (int) OrderItem::whereHas('ticket', function ($q) use ($eventIds) {
                    $q->whereIn('event_id', $eventIds);
                })->sum('quantity');

                // Total revenue (sum quantity * unit_price) via join for accuracy
                $revenue = (float) DB::table('order_items')
                    ->join('tickets', 'order_items.ticket_id', '=', 'tickets.id')
                    ->whereIn('tickets.event_id', $eventIds)
                    ->select(DB::raw('COALESCE(SUM(order_items.quantity * order_items.unit_price),0) as total'))
                    ->value('total');

                // Orders count for organiser events
                $ordersCount = Order::whereIn('event_id', $eventIds)->count();
            }
        }

        // Build simple time-series placeholders for charts (last 14 days)
        $days = 14;
        $ticketsSoldSeries = [];
        $salesVolumeSeries = [];

        // Build time-series for last $days using a grouped single query for efficiency
        $start = now()->subDays($days - 1)->startOfDay();
        $end = now()->endOfDay();

        if (count($eventIds) > 0) {
            $rows = DB::table('order_items')
                ->join('tickets', 'order_items.ticket_id', '=', 'tickets.id')
                ->whereIn('tickets.event_id', $eventIds)
                ->whereBetween('order_items.created_at', [$start, $end])
                ->select(DB::raw("DATE(order_items.created_at) as date"), DB::raw('SUM(order_items.quantity) as tickets_sold'), DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue'))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date');

            for ($i = 0; $i < $days; $i++) {
                $date = now()->subDays($days - $i - 1)->toDateString();
                if (isset($rows[$date])) {
                    $ticketsSoldSeries[] = ['date' => $date, 'value' => (int) $rows[$date]->tickets_sold];
                    $salesVolumeSeries[] = ['date' => $date, 'value' => (float) $rows[$date]->revenue];
                } else {
                    $ticketsSoldSeries[] = ['date' => $date, 'value' => 0];
                    $salesVolumeSeries[] = ['date' => $date, 'value' => 0.0];
                }
            }
        } else {
            for ($i = 0; $i < $days; $i++) {
                $date = now()->subDays($days - $i - 1)->toDateString();
                $ticketsSoldSeries[] = ['date' => $date, 'value' => 0];
                $salesVolumeSeries[] = ['date' => $date, 'value' => 0.0];
            }
        }

        // Only pass the latest events for the right-column (was $eventsForList defined above)
        $eventsForList = $eventsForList->map(function ($e) {
            return [
                'id' => $e->id,
                // some imports use Title, others use title — provide both where available
                'Title' => $e->Title ?? $e->title ?? null,
                'ImageUrl' => $e->ImageUrl ?? $e->image_url ?? null,
                'StartDate' => $e->StartDate ?? ($e->start_date ?? null),
            ];
        })->values();

        return Inertia::render('dashboard', [
            'organiser' => $organiser,
            'metrics' => [
                'revenue' => number_format($revenue, 2, '.', ''),
                'orders' => $ordersCount,
                'tickets_sold' => $ticketsSold,
                'views' => $views,
            ],
            'events' => $eventsForList,
            'charts' => [
                'tickets_sold' => $ticketsSoldSeries,
                'sales_volume' => $salesVolumeSeries,
            ],
        ]);
    }
}
