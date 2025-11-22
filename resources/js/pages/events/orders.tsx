import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { type SharedData } from '@/types';

export default function EventOrders() {
    const { props } = usePage<SharedData>();
    const event = (props as any).event as any;
    const orders = (props as any).orders ?? { data: [], meta: {} };

    const breadcrumbs = [
        { title: event?.Title ?? 'Event', href: `/events` },
        { title: 'Orders', href: `/event/${event?.id ?? ''}/orders` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event?.Title ? `${event.Title} — Orders` : 'Event Orders'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <svg className="h-6 w-6 text-sidebar-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3h18v4H3z" />
                            <path d="M3 11h18v10H3z" />
                        </svg>
                        <div>
                            <h2 className="text-lg font-semibold">Orders</h2>
                            <p className="text-sm text-muted-foreground">List of purchases for this event</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/event/${event?.id ?? ''}/orders`} as="a">
                            <Button variant="ghost">Refresh</Button>
                        </Link>
                    </div>
                </div>

                {(orders.data ?? []).length > 0 ? (
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-md border bg-card">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-4 py-2">Order</th>
                                        <th className="px-4 py-2">Buyer</th>
                                        <th className="px-4 py-2">Items</th>
                                        <th className="px-4 py-2">Total</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((order: any) => (
                                        <tr key={order.id} className="border-b last:border-b-0 hover:bg-white/3">
                                            <td className="px-4 py-3 font-mono">#{order.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold">{order.user?.name ?? order.user?.email ?? 'Guest'}</div>
                                                <div className="text-xs text-muted-foreground">{order.user?.email ?? ''}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    {order.items?.map((item: any) => (
                                                        <div key={item.id} className="text-sm">
                                                            <span className="font-medium">{item.ticket?.title ?? 'Ticket'}</span>
                                                            <span className="text-muted-foreground"> — {item.quantity} × €{Number(item.unit_price).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">€{Number(order.total ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-3"><span className="text-sm text-muted-foreground">{order.status ?? 'paid'}</span></td>
                                            <td className="px-4 py-3">{format(new Date(order.created_at), 'PP p')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Showing {orders.meta?.from ?? 0} — {orders.meta?.to ?? 0} of {orders.meta?.total ?? 0}</div>

                            <div className="flex items-center gap-2">
                                {orders.meta && (
                                    <>
                                        {orders.meta.current_page > 1 && (
                                            <Link href={`?page=${orders.meta.current_page - 1}`} as="a">
                                                <Button variant="ghost">Previous</Button>
                                            </Link>
                                        )}

                                        {orders.meta.current_page < orders.meta.last_page && (
                                            <Link href={`?page=${orders.meta.current_page + 1}`} as="a">
                                                <Button variant="ghost">Next</Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center gap-6 p-8 text-center">
                            <svg className="mx-auto h-24 w-24 text-sidebar-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3h18v4H3z" />
                                <path d="M3 11h18v10H3z" />
                            </svg>
                            <h3 className="text-2xl font-semibold">No Orders Yet</h3>
                            <p className="text-muted-foreground">Visitors haven't purchased tickets for this event yet.</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
