
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MdHome, MdOutlineShoppingCart, MdBarChart, MdPerson, MdLock, MdClose, MdGroup } from 'react-icons/md';
import { IoDocuments } from "react-icons/io5";

const routes = [
    { name: 'Dashboard', layout: '/admin', path: 'default', icon: <MdHome className="w-6 h-6" /> },
    { name: 'Providers', layout: '/admin', path: 'providers', icon: <MdPerson className="w-6 h-6" /> },
    { name: 'Customers', layout: '/admin', path: 'customers', icon: <MdGroup className="w-6 h-6" /> },
    { name: 'Services', layout: '/admin', path: 'services', icon: <IoDocuments className="w-6 h-6" /> },
    { name: 'Transactions', layout: '/admin', path: 'transactions', icon: <MdBarChart className="w-6 h-6" /> },
    { name: 'NFT Marketplace', layout: '/admin', path: 'nft-marketplace', icon: <MdOutlineShoppingCart className="w-6 h-6" /> },
    { name: 'Profile', layout: '/admin', path: 'profile', icon: <MdPerson className="h-6 w-6" /> },
    { name: 'Sign In', layout: '/auth', path: 'auth/sign-in', icon: <MdLock className="h-6 w-6" /> },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
    const pathname = usePathname();

    // Determine active route based on current pathname
    const getActiveRoute = (pathname: string) => {
        const route = routes.find(route => {
            const routePath = route.path === 'default' ? '/' : `/${route.path}`;
            return pathname === routePath;
        });
        return route?.name || 'Dashboard';
    };

    const activeRoute = getActiveRoute(pathname);

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={onClose}
            />

            <div className={`fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white w-[290px] ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <span className="absolute top-4 right-4 block cursor-pointer lg:hidden" onClick={onClose}>
                    <MdClose className="h-6 w-6 text-navy-700 dark:text-white" />
                </span>

                <div className="mx-[52px] mt-[45px] flex items-center justify-center">
                    <Image
                        src="/images/nfts/Vector 16.svg"
                        alt="Brand Logo"
                        width={120}
                        height={122}
                        priority
                    />
                </div>
                <div className="mt-[50px] mb-7 h-px bg-gray-200 dark:bg-white/30 mx-[52px]" />

                {/* Nav Links */}
                <ul className="mb-auto pt-1">
                    {routes.map((route, key) => (
                        <li key={key} className="relative mb-3 px-8">
                            <Link
                                href={route.path === 'default' ? '/' : `/${route.path}`}
                                className="relative flex cursor-pointer group"
                            >
                                {/* Hover and Active Background Overlay */}
                                <div className="absolute inset-0 rounded-xl bg-gray-50 opacity-0 group-hover:opacity-100 group-active:opacity-100 dark:bg-white/10 transition-opacity duration-200" />

                                <div className={`relative my-[4px] flex cursor-pointer items-center px-6 w-full`}>
                                    <span className={`${activeRoute === route.name ? "font-bold text-brand-500" : "font-medium text-gray-400 group-hover:text-brand-500"}`}>
                                        {route.icon}
                                    </span>
                                    <p className={`leading-1 ml-4 flex ${activeRoute === route.name ? "font-bold text-navy-700 dark:text-white" : "font-medium text-gray-400 group-hover:text-navy-700 dark:group-hover:text-white"}`}>
                                        {route.name}
                                    </p>
                                </div>
                                {activeRoute === route.name ? (
                                    <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500" />
                                ) : null}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Upgrade Card */}
                <div className="flex justify-center px-4">
                    <div className="relative mt-14 w-full max-w-[228px] rounded-[20px] bg-gradient-to-br from-[#868CFF] via-brand-500 to-brand-DEFAULT pb-4 overflow-hidden">
                        <div className="absolute -top-[24px] left-[50%] flex h-[50px] w-[50px] -translate-x-[50%] items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-[#868CFF] to-brand-500">
                            <div className="h-full w-full rounded-full bg-brand-500" />
                        </div>
                        <div className="mt-8 flex flex-col items-center px-4">
                            <h4 className="text-lg font-bold text-white">Upgrade to PRO</h4>
                            <p className="mt-1 text-center text-[10px] font-medium text-white/70">
                                Improve your development process and start doing more with Horizon UI PRO!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
