import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    // Read flashed messages (shared via HandleInertiaRequests middleware)
    const flash = usePage<any>().props?.flash;
    const flashSuccess = flash?.success ?? null;

    // Local toast visibility state so we can auto-hide / dismiss
    const [toastVisible, setToastVisible] = useState<boolean>(!!flashSuccess);

    useEffect(() => {
        setToastVisible(!!flashSuccess);

        if (!flashSuccess) return undefined;

        const timer = setTimeout(() => setToastVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [flashSuccess]);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
                {toastVisible && flashSuccess && (
                    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
                        <div
                            role="status"
                            aria-live="polite"
                            onClick={() => setToastVisible(false)}
                            className="cursor-pointer pointer-events-auto rounded-md bg-emerald-600 px-4 py-2 text-sm text-white shadow-lg transition-transform transform hover:scale-[1.02]"
                        >
                            {flashSuccess}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            {children}
            {toastVisible && flashSuccess && (
                <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
                    <div
                        role="status"
                        aria-live="polite"
                        onClick={() => setToastVisible(false)}
                        className="cursor-pointer pointer-events-auto rounded-md bg-emerald-600 px-4 py-2 text-sm text-white shadow-lg transition-transform transform hover:scale-[1.02]"
                    >
                        {flashSuccess}
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}
