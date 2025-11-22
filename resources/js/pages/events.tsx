import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Organiser Page', href: '/events' },
];

export default function Events({ organiser }: { organiser: any }) {
    const organiserName = organiser?.organiser_name ?? 'Your Organiser';
    const events = organiser?.events ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold ml-4"> {organiserName} Events</h2>
                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href="/events/create">+ CREATE EVENT</Link>
                    </Button>
                    <div>
                        <input
                            type="search"
                            placeholder="Search Events.."
                            className="rounded-md border border-input px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="rounded-lg border border-muted-foreground/20 bg-white p-8 text-center">
                    <div className="mx-auto max-w-lg mt-6">
                        <div className="mb-40 mt-6">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="mx-auto text-indigo-600">
                                <path d="M2 7h20v10H2z" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 7v10" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-3xl font-semibold">No Event Yet!</h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                            Looks like you have yet to create an event. You can create one by clicking the button below.
                        </p>
                        <div>
                            <Button asChild>
                                <Link href="/events/create">CREATE EVENT</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {events.map((ev: any) => (
                            <Link key={ev.id} href={`/event/${ev.id}/tickets`} className="group">
                                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg">
                                    {ev.ImageUrl ? (
                                        <img src={`/storage/${ev.ImageUrl}`} alt={ev.Title ?? 'Event'} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                    )}

                                    <div className="absolute left-3 top-3 rounded bg-white/80 px-2 py-1 text-xs font-medium text-neutral-800">{ev.Title ?? 'Untitled'}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
