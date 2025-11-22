import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { props } = usePage<SharedData>();
    const organiser = (props as any).organiser as any;
    const metrics = (props as any).metrics ?? { revenue: '0.00', orders: 0, tickets_sold: 0, views: 0 };
    const events = (props as any).events ?? [];
    const charts = (props as any).charts ?? { tickets_sold: [], sales_volume: [] };

    function seriesToLabelsAndValues(series: Array<{ date: string; value: number }>) {
        const labels = (series ?? []).map((s) => s.date);
        const values = (series ?? []).map((s) => Number(s.value) || 0);
        return { labels, values };
    }

    const ticketsSeries = charts.tickets_sold ?? [];
    const salesSeries = charts.sales_volume ?? [];

    const ticketsData = (() => {
        const { labels, values } = seriesToLabelsAndValues(ticketsSeries as any);
        return {
            labels,
            datasets: [
                {
                    label: 'Tickets Sold',
                    data: values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    tension: 0.3,
                    fill: true,
                },
            ],
        };
    })();

    const salesData = (() => {
        const { labels, values } = seriesToLabelsAndValues(salesSeries as any);
        return {
            labels,
            datasets: [
                {
                    label: 'Sales Volume',
                    data: values,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6,182,212,0.08)',
                    tension: 0.3,
                    fill: true,
                },
            ],
        };
    })();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index' },
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: false } },
            y: { grid: { color: '#f1f5f9' }, ticks: { beginAtZero: true } },
        },
    } as const;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded border bg-card px-4 py-6 shadow-sm">
                        <div className="text-sm text-muted-foreground">REVENUE</div>
                        <div className="mt-2 text-2xl font-semibold">€{metrics.revenue}</div>
                    </div>

                    <div className="rounded border bg-card px-4 py-6 shadow-sm">
                        <div className="text-sm text-muted-foreground">ORDERS</div>
                        <div className="mt-2 text-2xl font-semibold">{metrics.orders}</div>
                    </div>

                    <div className="rounded border bg-card px-4 py-6 shadow-sm">
                        <div className="text-sm text-muted-foreground">TICKETS SOLD</div>
                        <div className="mt-2 text-2xl font-semibold">{metrics.tickets_sold}</div>
                    </div>

                    <div className="rounded border bg-card px-4 py-6 shadow-sm">
                        <div className="text-sm text-muted-foreground">EVENT VIEWS</div>
                        <div className="mt-2 text-2xl font-semibold">{metrics.views}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        <div className="rounded border bg-card p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">Tickets Sold</h3>
                                    <div className="text-xs text-muted-foreground">{metrics.tickets_sold} total</div>
                                </div>
                                <div className="text-sm font-medium text-success">{metrics.tickets_sold} total</div>
                            </div>

                            <div className="mt-4 h-44 w-full overflow-hidden rounded border">
                                <div className="h-44 w-full">
                                    <Line data={ticketsData} options={chartOptions as any} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded border bg-card p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">Ticket Sales Volume</h3>
                                    <div className="text-xs text-muted-foreground">Sales volume over time</div>
                                </div>
                                <div className="text-sm font-medium text-success">€{Number(metrics.revenue ?? 0).toFixed(2)} total</div>
                            </div>

                            <div className="mt-4 h-44 w-full overflow-hidden rounded border">
                                <div className="h-44 w-full">
                                    <Line data={salesData} options={chartOptions as any} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded border bg-card p-4 shadow-sm">
                                <h4 className="text-sm font-semibold">Event Page Views</h4>
                                <div className="mt-3 h-36 w-full overflow-hidden rounded border border-dashed">
                                    <PlaceholderPattern className="h-full w-full" />
                                </div>
                            </div>

                            <div className="rounded border bg-card p-4 shadow-sm">
                                <h4 className="text-sm font-semibold">Registrations By Ticket</h4>
                                <div className="mt-3 h-36 w-full overflow-hidden rounded border border-dashed">
                                    <PlaceholderPattern className="h-full w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded border bg-card p-4 shadow-sm">
                            <h4 className="text-sm font-semibold">Organiser</h4>
                            <div className="mt-2 text-sm">{organiser?.organiser_name ?? organiser?.name ?? '—'}</div>
                        </div>

                        <div className="rounded border bg-card p-4 shadow-sm">
                            <h4 className="text-sm font-semibold">Quick Actions</h4>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link href="/events" className="inline-flex w-full justify-center">
                                    <Button variant="default">Manage Events</Button>
                                </Link>
                                <Link href="/events/create" className="inline-flex w-full justify-center">
                                    <Button variant="outline">Create Event</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded border bg-card p-4 shadow-sm">
                            <h4 className="text-sm font-semibold">My Events</h4>
                            <div className="mt-3 grid gap-3">
                                {events.length === 0 && <div className="text-sm text-muted-foreground">No events yet</div>}
                                {events.map((ev: any) => {
                                    const title = ev.Title ?? ev.title ?? 'Untitled event';
                                    const img = ev.ImageUrl ?? ev.image_url ?? null;
                                    const start = ev.StartDate ?? ev.start_date ?? null;
                                    const src = img ? (String(img).startsWith('http') || String(img).startsWith('/') ? img : `/storage/${img}`) : null;

                                    return (
                                        <Link key={ev.id} href={`/event/${ev.id}/tickets`} className="group block">
                                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 hover:shadow-sm">
                                                {src ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                ) : (
                                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                )}

                                                <div className="absolute left-3 top-3 rounded bg-white/80 px-2 py-1 text-xs font-medium text-neutral-800">{title}</div>
                                                <div className="absolute left-3 bottom-3 text-xs text-muted-foreground rounded bg-white/80 px-2 py-1">{start ? new Date(start).toLocaleDateString() : '—'}</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
