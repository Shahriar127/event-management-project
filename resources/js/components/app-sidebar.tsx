import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import eventRoutes from '@/routes/event';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Gift, LayoutGrid, Settings, Tag, ShoppingCart, Users, Sliders, Home, CheckSquare, MessageSquare, Code, Key } from 'lucide-react';
import { type SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Events',
        href: '/events',
        icon: Gift,
    },
    // {
    //     title: 'Customize',
    //     href: '/settings',
    //     icon: Settings,
    // }
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { event } = usePage<SharedData>().props as any;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu className="px-2 py-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {event && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-3 py-2 !h-auto !items-start">EVENT MENU</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={eventRoutes.tickets.url(event)} prefetch>
                                        <Tag />
                                        <span>Tickets</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={eventRoutes.orders.url(event)} prefetch>
                                        <ShoppingCart />
                                        <span>Orders</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/attendees`} prefetch>
                                        <Users />
                                        <span>Attendees</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/customize`} prefetch>
                                        <Sliders />
                                        <span>Customize Event</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
                {event && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-3 py-2 !h-auto !items-start">EVENT TOOLS</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/check-in`} prefetch>
                                        <CheckSquare />
                                        <span>Check-in</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/surveys`} prefetch>
                                        <MessageSquare />
                                        <span>Surveys</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/widgets`} prefetch>
                                        <Code />
                                        <span>Widgets</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/event/${event.id}/access-codes`} prefetch>
                                        <Key />
                                        <span>Access Codes</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}

            </SidebarContent>



            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
