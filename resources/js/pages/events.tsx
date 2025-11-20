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
        </AppLayout>
    );
}
