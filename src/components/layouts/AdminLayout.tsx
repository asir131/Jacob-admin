
'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Map pathname to page title
    const getPageTitle = (pathname: string) => {
        const pageMap: { [key: string]: string } = {
            '/': 'Main Dashboard',
            '/providers': 'Providers',
            '/customers': 'Customers',
            '/services': 'Services',
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

    return (
        <div className="flex h-full w-full">
            <Sidebar open={open} onClose={() => setOpen(false)} />

            <div className="h-full w-full bg-light-bg dark:!bg-navy-900">
                <main className={`h-full flex-none transition-all lg:ml-[290px]`}>
                    <div className="h-full p-5 lg:p-5">
                        <Navbar
                            onOpenSidebar={() => setOpen(true)}
                            brandText={getPageTitle(pathname)}
                        />
                        <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] pb-5">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
