
'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import AdminRealtimeNotifications from '../notifications/AdminRealtimeNotifications';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeSidebar, openSidebar } from '@/store/slices/uiSlice';
import { clearSession } from '@/store/slices/authSlice';
import { clearNotifications } from '@/store/slices/notificationSlice';
import { clearAdminSession } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => Boolean(state.auth.session));
    const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth/sign-in');
            return;
        }
    }, [isAuthenticated, router]);

    // Map pathname to page title
    const getPageTitle = (pathname: string) => {
        const pageMap: { [key: string]: string } = {
            '/': 'Main Dashboard',
            '/providers': 'Providers',
            '/customers': 'Customers',
            '/services': 'Services',
            '/gig-approvals': 'Gig Approvals',
            '/transactions': 'Transactions',
            '/nft-marketplace': 'NFT Marketplace',
            '/profile': 'Profile',
            '/auth/sign-in': 'Sign In',
        };

        // Check for dynamic routes (e.g., /providers/123)
        if (pathname.startsWith('/providers/')) return 'Provider Details';
        if (pathname.startsWith('/customers/')) return 'Customer Details';

        return pageMap[pathname] || 'Main Dashboard';
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-light-bg">
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-[#2286BE]">
                    Checking access...
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full">
            <Sidebar
                open={sidebarOpen}
                onClose={() => dispatch(closeSidebar())}
                onLogout={() => {
                    clearAdminSession();
                    dispatch(clearSession());
                    dispatch(clearNotifications());
                    dispatch(closeSidebar());
                    router.replace('/auth/sign-in');
                }}
            />

            <div className="h-full w-full bg-light-bg dark:!bg-navy-900">
                <main className={`h-full flex-none transition-all lg:ml-[290px]`}>
                    <div className="h-full p-5 lg:p-5">
                        <Navbar
                            onOpenSidebar={() => dispatch(openSidebar())}
                            brandText={getPageTitle(pathname)}
                        />
                        <AdminRealtimeNotifications />
                        <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] pb-5">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
