'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { MdClose, MdOutlineNotificationsActive, MdVerified } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { pushNotification, setRealtimeVisible, setSocketConnected } from '@/store/slices/notificationSlice';

type ApprovalNotification = {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  providerName: string;
  notificationType?: string;
  providerId?: string;
  targetPath?: string;
  createdAt: string;
};

type GigApprovalEvent = {
  id?: string;
  title?: string;
  categoryName?: string;
  customCategoryName?: string;
  provider?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt?: string;
};

type SocketNotificationEvent = {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  data?: {
    notificationType?: string;
    providerId?: string;
    providerName?: string;
    targetPath?: string;
    customCategoryName?: string;
    categoryName?: string;
  } | null;
  createdAt?: string;
};

const ADMIN_TOKEN_KEY = 'admin_dashboard_token';
export default function AdminRealtimeNotifications() {
  const dispatch = useAppDispatch();
  const { items: notifications, socketConnected, realtimeVisible: isVisible } = useAppSelector(
    (state) => state.adminNotifications
  );

  const socketUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token || !socketUrl) return;

    const socket: Socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      dispatch(setSocketConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setSocketConnected(false));
    });

    socket.on('gig:approval:requested', (event: GigApprovalEvent) => {
      const providerName = [event.provider?.firstName, event.provider?.lastName].filter(Boolean).join(' ') || 'Unknown provider';
      const notification: ApprovalNotification = {
        id: event.id || `gig-approval-${Date.now()}`,
        title: 'New custom category request',
        description: `${providerName} submitted ${event.customCategoryName || event.categoryName || 'a custom category'} for approval.`,
        categoryName: event.customCategoryName || event.categoryName || 'Custom category',
        providerName,
        notificationType: 'gig_approval_request',
        targetPath: '/gig-approvals',
        createdAt: event.createdAt || new Date().toISOString(),
      };

      dispatch(pushNotification({ ...notification, unread: true }));
      dispatch(setRealtimeVisible(true));
    });

    socket.on('notification:new', (event: SocketNotificationEvent) => {
      const notificationType = event.data?.notificationType || '';
      const isGigApproval =
        notificationType === 'gig_approval_request' ||
        String(event.title || '').toLowerCase().includes('custom category');
      const isProviderVerification = notificationType === 'provider_verification_request';
      const isWithdrawalRequest =
        notificationType === 'withdrawal_request_created' ||
        notificationType === 'withdrawal_request_approved' ||
        notificationType === 'withdrawal_request_rejected' ||
        notificationType === 'withdrawal_paid';

      if (!isGigApproval && !isProviderVerification && !isWithdrawalRequest) return;

      const withdrawalTitleMap: Record<string, string> = {
        withdrawal_request_created: 'New withdrawal request',
        withdrawal_request_approved: 'Withdrawal request approved',
        withdrawal_request_rejected: 'Withdrawal request rejected',
        withdrawal_paid: 'Withdrawal marked paid',
      };

      const notification: ApprovalNotification = {
        id: event.id || `notification-${Date.now()}`,
        title:
          event.title ||
          (isWithdrawalRequest
            ? withdrawalTitleMap[notificationType] || 'Withdrawal update'
            : isProviderVerification
              ? 'Provider verification requested'
              : 'New custom category request'),
        description:
          event.description ||
          (isWithdrawalRequest
            ? 'A provider withdrawal request needs your attention.'
            : isProviderVerification
              ? 'A provider submitted payout + NID verification request.'
              : 'A provider submitted a custom category for approval.'),
        categoryName:
          event.data?.customCategoryName ||
          event.data?.categoryName ||
          (isWithdrawalRequest ? 'Withdrawal' : isProviderVerification ? 'Provider verification' : 'Custom category'),
        providerName: event.data?.providerName || 'System',
        notificationType: isWithdrawalRequest
          ? notificationType
          : isProviderVerification
            ? 'provider_verification_request'
            : 'gig_approval_request',
        providerId: event.data?.providerId,
        targetPath:
          event.data?.targetPath ||
          (isWithdrawalRequest ? '/withdrawals' : isProviderVerification ? '/provider-verifications' : '/gig-approvals'),
        createdAt: event.createdAt || new Date().toISOString(),
      };

      dispatch(pushNotification({ ...notification, unread: true }));
      dispatch(setRealtimeVisible(true));
    });

    return () => {
      socket.disconnect();
      dispatch(setSocketConnected(false));
    };
  }, [dispatch, socketUrl]);

  if (!notifications.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-full max-w-sm flex-col gap-3">
      {isVisible ? (
        <div className="pointer-events-auto rounded-[24px] border border-[#2286BE]/20 bg-white p-4 shadow-2xl shadow-[#2286BE]/10 dark:border-white/10 dark:bg-navy-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-[#2286BE]/10 p-3 text-[#2286BE]">
                <MdOutlineNotificationsActive className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-navy-700 dark:text-white">Realtime approval alert</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] ${
                      socketConnected
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                    }`}
                  >
                    {socketConnected ? 'Live' : 'Connecting'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{notifications[0].title}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{notifications[0].description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch(setRealtimeVisible(false))}
              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
              aria-label="Dismiss approval alert"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MdVerified className="h-4 w-4 text-[#2286BE]" />
              {notifications[0].categoryName}
            </div>
            <Link
              href={notifications[0].targetPath || '/gig-approvals'}
              className="pointer-events-auto rounded-xl bg-[#2286BE] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
            >
              Review now
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
