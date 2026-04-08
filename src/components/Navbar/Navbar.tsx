'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { MdNotificationsNone, MdInfoOutline, MdMenu, MdChevronRight } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import SearchInput from '../ui/SearchInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markAllAsRead } from '@/store/slices/notificationSlice';
import { setNotificationDropdownOpen } from '@/store/slices/adminUiSlice';

const Navbar = (props: { brandText: string, onOpenSidebar: () => void }) => {
    const { brandText, onOpenSidebar } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const isNotificationOpen = useAppSelector((state) => state.adminUi.notificationDropdownOpen);
    const notifications = useAppSelector((state) => state.adminNotifications.items);
    const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                dispatch(setNotificationDropdownOpen(false));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch]);

    const toggleNotifications = () => {
        dispatch(markAllAsRead());
        dispatch(setNotificationDropdownOpen(!isNotificationOpen));
    };

    const openNotificationTarget = (targetPath?: string) => {
        dispatch(markAllAsRead());
        dispatch(setNotificationDropdownOpen(false));
        router.push(targetPath || '/gig-approvals');
    };

    return (
        <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d] print:hidden">
            <div className="ml-[6px]">
                <div className="h-6 pt-1">
                    <a
                        className="text-xs font-normal text-[#707EAE] hover:underline dark:text-white dark:hover:text-white"
                        href=" "
                    >
                        Pages
                        <span className="mx-1 text-xs text-[#707EAE] hover:text-[#707EAE] dark:text-white">
                            {' '}
                            /{' '}
                        </span>
                    </a>
                    <a
                        className="text-xs font-normal capitalize text-[#707EAE] hover:underline dark:text-white dark:hover:text-white"
                        href="#"
                    >
                        {brandText}
                    </a>
                </div>
                <p className="shrink text-[34px] capitalize text-navy-700 dark:text-white">
                    <a
                        href="#"
                        className="font-bold underline-offset-4 capitalize hover:text-navy-700 dark:hover:text-white"
                    >
                        {brandText}
                    </a>
                </p>
            </div>

            <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
                <SearchInput
                    value={""} // Handle state if necessary, but keep it consistent for now
                    onChange={() => { }}
                    placeholder="Search..."
                    className="xl:w-[225px] !bg-transparent !border-none !shadow-none"
                />

                <span
                    className="flex cursor-pointer text-xl text-gray-600 dark:text-white lg:hidden"
                    onClick={onOpenSidebar}
                >
                    <MdMenu className="h-5 w-5" />
                </span>

                <div ref={dropdownRef} className="relative flex h-full items-center justify-center rounded-lg px-px">
                    <button
                        type="button"
                        onClick={toggleNotifications}
                        className="relative rounded-lg p-1 transition hover:bg-slate-50 dark:hover:bg-white/5"
                        aria-label="Notifications"
                    >
                        <MdNotificationsNone className="h-[18px] w-[18px] text-[#A3AED0]" />
                        {unreadCount > 0 ? (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2286BE] px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                        ) : null}
                    </button>

                    {isNotificationOpen ? (
                        <div className="absolute top-12 right-0 z-50 w-[340px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 dark:border-white/10 dark:bg-navy-800">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
                                <div>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">Notifications</p>
                                    <p className="text-xs text-slate-400">{notifications.length} total</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        dispatch(markAllAsRead());
                                        dispatch(setNotificationDropdownOpen(false));
                                    }}
                                    className="text-xs font-bold text-[#2286BE] hover:underline"
                                >
                                    Mark read
                                </button>
                            </div>

                            <div className="max-h-[360px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-sm text-slate-400">
                                        No notifications right now.
                                    </div>
                                ) : (
                                    notifications.slice(0, 6).map((notification) => (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            onClick={() => openNotificationTarget(notification.targetPath)}
                                            className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                                        >
                                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#2286BE]/10 text-[#2286BE]">
                                                <MdNotificationsNone className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="truncate text-sm font-bold text-navy-700 dark:text-white">
                                                        {notification.title}
                                                    </p>
                                                    <MdChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-300">
                                                    {notification.description}
                                                </p>
                                                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2286BE]">
                                                    {notification.categoryName}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-slate-100 px-4 py-3 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => openNotificationTarget('/gig-approvals')}
                                    className="w-full rounded-2xl bg-[#2286BE] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                >
                                    Open Approvals
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="flex h-full items-center justify-center rounded-lg px-px">
                    <MdInfoOutline className="h-[18px] w-[18px] text-[#A3AED0]" />
                </div>
                <div className="flex h-full items-center justify-center rounded-lg px-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-b from-[#4481EB] to-[#04BEFE]" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
