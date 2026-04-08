'use client';

import React, { useEffect, useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSearchParams } from 'next/navigation';
import {
  approveProviderVerification,
  clearProviderVerificationNotice,
  fetchProviderVerifications,
  rejectProviderVerification,
  setRejectionReasonDraft,
  setSelectedProviderId,
} from '@/store/slices/providerVerificationSlice';
import { MdCheckCircle, MdCancel, MdPerson, MdRefresh, MdSchedule } from 'react-icons/md';

const maskAccountNumber = (value: string) => {
  const digits = String(value || '').replace(/\s+/g, '');
  if (!digits) return 'N/A';
  if (digits.length <= 4) return digits;
  return `${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
};

export default function ProviderVerificationsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const { items, loading, selectedProviderId, busyProviderId, rejectionReasonDraft, notice } = useAppSelector(
    (state) => state.providerVerification
  );
  const notificationCount = useAppSelector((state) => state.adminNotifications.items.length);

  const selectedProvider = useMemo(
    () => items.find((item) => item.id === selectedProviderId) || items[0] || null,
    [items, selectedProviderId]
  );

  useEffect(() => {
    if (!adminToken) return;
    void dispatch(fetchProviderVerifications({ apiBase, adminToken }));
  }, [adminToken, apiBase, dispatch, notificationCount]);

  useEffect(() => {
    const providerIdFromQuery = searchParams.get('providerId');
    if (!providerIdFromQuery) return;
    if (!items.some((item) => item.id === providerIdFromQuery)) return;
    dispatch(setSelectedProviderId(providerIdFromQuery));
  }, [dispatch, items, searchParams]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => dispatch(clearProviderVerificationNotice()), 3000);
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
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Provider Verification</p>
              <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Review provider payout + NID submissions</h1>
            </div>

            <button
              type="button"
              onClick={() => void dispatch(fetchProviderVerifications({ apiBase, adminToken }))}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2286BE]/20 bg-[#2286BE]/5 px-4 text-sm font-semibold text-[#2286BE] transition hover:bg-[#2286BE]/10"
            >
              <MdRefresh className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            Loading provider verification requests...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            No pending provider verification requests right now.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-4">
              {items.map((provider) => {
                const isActive = selectedProvider?.id === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => dispatch(setSelectedProviderId(provider.id))}
                    className={`w-full rounded-[24px] border p-5 text-left shadow-sm transition ${
                      isActive
                        ? 'border-[#2286BE] bg-white ring-2 ring-[#2286BE]/10 dark:bg-navy-800'
                        : 'border-gray-100 bg-white hover:border-[#2286BE]/30 dark:border-white/10 dark:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-2xl bg-[#2286BE]/10">
                        {provider.avatar ? (
                          <img src={provider.avatar} alt={provider.firstName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#2286BE]">
                            <MdPerson className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {[provider.firstName, provider.lastName].filter(Boolean).join(' ') || provider.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{provider.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                      <MdSchedule className="h-4 w-4 text-[#2286BE]" />
                      Submitted:{' '}
                      {provider.payoutInfo.submittedAt
                        ? new Date(provider.payoutInfo.submittedAt).toLocaleString()
                        : 'N/A'}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedProvider ? (
              <div className="space-y-6 rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Account Holder Name</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{selectedProvider.payoutInfo.accountHolderName || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Bank Account Number</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{maskAccountNumber(selectedProvider.payoutInfo.bankAccountNumber)}</p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Routing Number</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{selectedProvider.payoutInfo.routingNumber || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Bank Name</p>
                    <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{selectedProvider.payoutInfo.bankName || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700 md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2286BE]">Account Type</p>
                    <p className="mt-2 text-sm font-bold uppercase text-navy-700 dark:text-white">{selectedProvider.payoutInfo.accountType || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <a
                    href={selectedProvider.payoutInfo.nidFrontImageUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-700"
                  >
                    {selectedProvider.payoutInfo.nidFrontImageUrl ? (
                      <img src={selectedProvider.payoutInfo.nidFrontImageUrl} alt="NID Front" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm font-semibold text-gray-400">No front image</div>
                    )}
                  </a>
                  <a
                    href={selectedProvider.payoutInfo.nidBackImageUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-700"
                  >
                    {selectedProvider.payoutInfo.nidBackImageUrl ? (
                      <img src={selectedProvider.payoutInfo.nidBackImageUrl} alt="NID Back" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm font-semibold text-gray-400">No back image</div>
                    )}
                  </a>
                </div>

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold text-navy-700 dark:text-white">Reject Reason (optional)</p>
                  <textarea
                    value={rejectionReasonDraft}
                    onChange={(event) => dispatch(setRejectionReasonDraft(event.target.value))}
                    rows={3}
                    placeholder="Tell the provider what needs correction..."
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      void dispatch(
                        approveProviderVerification({
                          apiBase,
                          adminToken,
                          providerId: selectedProvider.id,
                        })
                      )
                    }
                    disabled={busyProviderId === selectedProvider.id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdCheckCircle className="h-4 w-4" />
                    Approve Verification
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void dispatch(
                        rejectProviderVerification({
                          apiBase,
                          adminToken,
                          providerId: selectedProvider.id,
                          rejectionReason: rejectionReasonDraft,
                        })
                      )
                    }
                    disabled={busyProviderId === selectedProvider.id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 px-5 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    <MdCancel className="h-4 w-4" />
                    Reject Verification
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
