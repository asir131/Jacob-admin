'use client';

import React, { useEffect, useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearWithdrawalNotice,
  fetchWithdrawalRequests,
  reviewWithdrawalRequest,
  setReviewNoteDraft,
  setSelectedWithdrawalId,
} from '@/store/slices/withdrawalRequestsSlice';
import { MdCheckCircle, MdCancel, MdPerson, MdRefresh, MdPayments } from 'react-icons/md';

const maskAccountNumber = (value: string) => {
  const digits = String(value || '').replace(/\s+/g, '');
  if (!digits) return 'N/A';
  if (digits.length <= 4) return digits;
  return `${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
};

export default function WithdrawalsPage() {
  const dispatch = useAppDispatch();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const notificationCount = useAppSelector((state) => state.adminNotifications.items.length);
  const { items, loading, selectedWithdrawalId, busyWithdrawalId, reviewNoteDraft, notice } = useAppSelector(
    (state) => state.withdrawalRequests
  );

  const selectedWithdrawal = useMemo(
    () => items.find((item) => item.id === selectedWithdrawalId) || items[0] || null,
    [items, selectedWithdrawalId]
  );

  useEffect(() => {
    if (!adminToken) return;
    void dispatch(fetchWithdrawalRequests({ apiBase, adminToken, status: 'pending' }));
  }, [adminToken, apiBase, dispatch, notificationCount]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => dispatch(clearWithdrawalNotice()), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, notice]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Provider Withdrawals</p>
              <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Review payout requests from providers</h1>
            </div>

            <button
              type="button"
              onClick={() => void dispatch(fetchWithdrawalRequests({ apiBase, adminToken, status: 'pending' }))}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2286BE]/20 bg-[#2286BE]/5 px-4 text-sm font-semibold text-[#2286BE] transition hover:bg-[#2286BE]/10"
            >
              <MdRefresh className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            Loading withdrawal requests...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            No pending withdrawal requests right now.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-4">
              {items.map((item) => {
                const isActive = selectedWithdrawal?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => dispatch(setSelectedWithdrawalId(item.id))}
                    className={`w-full rounded-[24px] border p-5 text-left shadow-sm transition ${
                      isActive
                        ? 'border-[#2286BE] bg-white ring-2 ring-[#2286BE]/10 dark:bg-navy-800'
                        : 'border-gray-100 bg-white hover:border-[#2286BE]/30 dark:border-white/10 dark:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-2xl bg-[#2286BE]/10">
                        {item.providerAvatar ? (
                          <img src={item.providerAvatar} alt={item.providerName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#2286BE]">
                            <MdPerson className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-navy-700 dark:text-white">{item.providerName}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-300">{item.providerEmail}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
                      <span>Requested: {item.requestedAt ? new Date(item.requestedAt).toLocaleString() : 'N/A'}</span>
                      <span className="font-bold text-[#2286BE]">${Number(item.amount || 0).toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedWithdrawal ? (
              <div className="space-y-6 rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Account Holder Name</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">
                      {selectedWithdrawal.payoutInfo.accountHolderName || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Bank Account Number</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">
                      {maskAccountNumber(selectedWithdrawal.payoutInfo.bankAccountNumber)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Routing Number</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">
                      {selectedWithdrawal.payoutInfo.routingNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Bank Name</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">
                      {selectedWithdrawal.payoutInfo.bankName || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700 md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Account Type</p>
                    <p className="mt-2 text-sm font-bold uppercase text-navy-700 dark:text-white">
                      {selectedWithdrawal.payoutInfo.accountType || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <a
                    href={selectedWithdrawal.payoutInfo.nidFrontImageUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-700"
                  >
                    {selectedWithdrawal.payoutInfo.nidFrontImageUrl ? (
                      <img src={selectedWithdrawal.payoutInfo.nidFrontImageUrl} alt="NID Front" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm font-semibold text-gray-400">No front image</div>
                    )}
                  </a>
                  <a
                    href={selectedWithdrawal.payoutInfo.nidBackImageUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-700"
                  >
                    {selectedWithdrawal.payoutInfo.nidBackImageUrl ? (
                      <img src={selectedWithdrawal.payoutInfo.nidBackImageUrl} alt="NID Back" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm font-semibold text-gray-400">No back image</div>
                    )}
                  </a>
                </div>

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold text-navy-700 dark:text-white">Admin Note (optional)</p>
                  <textarea
                    value={reviewNoteDraft}
                    onChange={(event) => dispatch(setReviewNoteDraft(event.target.value))}
                    rows={3}
                    placeholder="Add a note for this withdrawal request..."
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      void dispatch(
                        reviewWithdrawalRequest({
                          apiBase,
                          adminToken,
                          withdrawalId: selectedWithdrawal.id,
                          action: 'approve',
                          note: reviewNoteDraft,
                        })
                      )
                    }
                    disabled={busyWithdrawalId === selectedWithdrawal.id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdCheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void dispatch(
                        reviewWithdrawalRequest({
                          apiBase,
                          adminToken,
                          withdrawalId: selectedWithdrawal.id,
                          action: 'reject',
                          note: reviewNoteDraft,
                        })
                      )
                    }
                    disabled={busyWithdrawalId === selectedWithdrawal.id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 px-5 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    <MdCancel className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void dispatch(
                        reviewWithdrawalRequest({
                          apiBase,
                          adminToken,
                          withdrawalId: selectedWithdrawal.id,
                          action: 'paid',
                          note: reviewNoteDraft,
                        })
                      )
                    }
                    disabled={busyWithdrawalId === selectedWithdrawal.id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-5 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-emerald-500/10"
                  >
                    <MdPayments className="h-4 w-4" />
                    Mark Paid
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-500 dark:bg-navy-700 dark:text-slate-200">
                  {selectedWithdrawal.status === 'pending'
                    ? 'Pending requests can be approved or rejected.'
                    : selectedWithdrawal.status === 'approved'
                      ? 'Approved requests can now be marked paid after the transfer is processed.'
                      : selectedWithdrawal.status === 'paid'
                        ? 'This withdrawal has already been paid.'
                        : 'This withdrawal request was rejected.'}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
