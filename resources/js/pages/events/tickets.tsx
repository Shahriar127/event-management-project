import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { type SharedData } from '@/types';

export default function EventTickets() {
    const { props } = usePage<SharedData>();
    const event = props.event as any;
    const firstRun = Boolean((props as any).first_run);

    const breadcrumbs = [
        { title: event?.Title ?? 'Event', href: `/events?? ''}` },
        { title: 'Tickets', href: `/event/${event?.id ?? ''}/tickets` },
    ];

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});
    const [localOnSale, setLocalOnSale] = useState<Record<string, boolean>>({});

    const form = useForm({
        title: '',
        price: '',
        quantity: '',
        category: 'mid',
    });

    function submit(e: any) {
        e.preventDefault();
        form.post(`/event/${event?.id ?? ''}/tickets`, {
            onSuccess: () => {
                setShowCreateModal(false);
                form.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event?.Title ? `${event.Title} — Tickets` : 'Event Tickets'} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {firstRun && (
                    <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-900">
                        This event is not visible to the public. <Button className="ml-2">PUBLISH IT</Button>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <svg className="h-6 w-6 text-sidebar-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                            <path d="M7 14l4-4 4 4" />
                        </svg>
                        <div>
                            <h2 className="text-lg font-semibold">Event Tickets</h2>
                            <p className="text-sm text-muted-foreground">Manage tickets for this event</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="default" onClick={() => setShowCreateModal(true)}>
                            Create ticket
                        </Button>
                        <Input placeholder="Search tickets..." className="min-w-[220px]" />
                    </div>
                </div>

                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div> */}

                {((props as any).tickets ?? []).length > 0 ? (
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">{((props as any).tickets ?? []).length} tickets</div>

                        <div className="grid gap-4">
                            {((props as any).tickets ?? []).map((ticket: any) => {
                                const sold = ticket.sold_count ?? 0;
                                const remaining = ticket.quantity === null ? 'Unlimited' : (ticket.quantity - sold);
                                const revenue = Number(ticket.revenue ?? ((Number(ticket.price) || 0) * sold)) || 0;

                                const headerColor = ticket.category === 'high' ? '#4f46e5' : ticket.category === 'mid' ? '#6366f1' : '#06b6d4';

                                function toggle() {
                                    const id = String(ticket.id);

                                    // Optimistic UI: flip local on_sale immediately and mark processing
                                    setLocalOnSale((prev) => ({ ...prev, [id]: !(prev[id] ?? ticket.on_sale) }));
                                    setProcessingIds((prev) => ({ ...prev, [id]: true }));

                                    // Debug: log to the browser console which ticket id is being toggled
                                    try {
                                        // eslint-disable-next-line no-console
                                        console.log('toggling ticket', ticket.id, 'currentOnSale', ticket.on_sale);
                                    } catch (e) {
                                        // noop
                                    }

                                    Inertia.post(
                                        `/event/${event?.id ?? ''}/tickets`,
                                        {
                                            action: 'toggle',
                                            ticket_id: ticket.id,
                                        },
                                        {
                                            onError: () => {
                                                // Revert optimistic update on error
                                                setLocalOnSale((prev) => ({ ...prev, [id]: ticket.on_sale }));
                                            },
                                            onFinish: () => {
                                                setProcessingIds((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy[id];
                                                    return copy;
                                                });
                                            },
                                        }
                                    );
                                }

                                return (
                                    <div key={ticket.id} className="max-w-3xl rounded border bg-card shadow-sm overflow-hidden">
                                        <div style={{ backgroundColor: headerColor }} className="flex items-center justify-between px-4 py-2 text-white">
                                            <div className="flex items-center gap-3">
                                                <svg className="h-4 w-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                                                    <path d="M7 14l4-4 4 4" />
                                                </svg>
                                                <div className="font-semibold">{ticket.title ?? ticket.title}</div>
                                            </div>
                                            <div className="font-medium">{ticket.price ? `€${Number(ticket.price).toFixed(2)}` : '€0.00'}</div>
                                        </div>

                                        <div className="grid grid-cols-3 divide-x px-4 py-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold">{sold}</div>
                                                <div className="text-xs text-muted-foreground">Sold</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">{remaining === 'Unlimited' ? '∞' : remaining}</div>
                                                <div className="text-xs text-muted-foreground">Remaining</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold">€{Number(revenue).toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">Revenue (tax excl.)</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50">
                                            {(() => {
                                                const currentOnSale = localOnSale[ticket.id] ?? ticket.on_sale;
                                                const processing = Boolean(processingIds[ticket.id]);

                                                return (
                                                    <>
                                                        <div className="text-xs text-muted-foreground">{currentOnSale ? 'On Sale' : 'Paused'}</div>
                                                        <div>
                                                            {currentOnSale ? (
                                                                <Button variant="ghost" size="sm" onClick={toggle} className="bg-cyan-200 text-cyan-800" disabled={processing}>
                                                                    {processing ? 'Pausing...' : 'Pause'}
                                                                </Button>
                                                            ) : (
                                                                <Button variant="default" size="sm" onClick={toggle} disabled={processing}>
                                                                    {processing ? 'Starting...' : 'Start'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center gap-6 p-8 text-center">
                            <svg className="mx-auto h-24 w-24 text-sidebar-accent-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                                <path d="M7 14l4-4 4 4" />
                            </svg>
                            <h3 className="text-2xl font-semibold">No Tickets Yet</h3>
                            <p className="text-muted-foreground">Create your first ticket by clicking the button below.</p>
                            <Button variant="default" onClick={() => setShowCreateModal(true)}>
                                Create ticket
                            </Button>
                        </div>
                    </div>
                )}

                {/* Create Ticket Modal */}
                <Dialog open={showCreateModal} onOpenChange={(open) => !open && setShowCreateModal(false)}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Ticket</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-muted-foreground">TICKET TITLE *</label>
                                    <Input
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="E.g: General Admission"
                                    />
                                    {form.errors.title && <div className="text-sm text-destructive">{form.errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">CATEGORY</label>
                                    <select
                                        value={form.data.category}
                                        onChange={(e) => form.setData('category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                                    >
                                        <option value="high">High</option>
                                        <option value="mid">Mid</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground">TICKET PRICE *</label>
                                    <Input
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', e.target.value)}
                                        placeholder="E.g: 25.99"
                                    />
                                    {form.errors.price && <div className="text-sm text-destructive">{form.errors.price}</div>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-muted-foreground">QUANTITY AVAILABLE</label>
                                    <Input
                                        value={form.data.quantity}
                                        onChange={(e) => form.setData('quantity', e.target.value)}
                                        placeholder="E.g: 100 (Leave blank for unlimited)"
                                    />
                                    {form.errors.quantity && <div className="text-sm text-destructive">{form.errors.quantity}</div>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={form.processing}>Create Ticket</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
