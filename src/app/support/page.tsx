'use client';

import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';

type SupportMessage = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'solved' | 'ignored';
  createdAt?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
};

export default function SupportPage() {
  const PAGE_SIZE = 10;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const [items, setItems] = React.useState<SupportMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [notice, setNotice] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadMessages = React.useCallback(async () => {
    if (!apiBase || !adminToken) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/support/admin`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load support messages.');
      }
      const nextItems = Array.isArray(payload.data) ? payload.data : [];
      setItems(nextItems);
      setPage((current) => {
        const totalPages = Math.max(1, Math.ceil(nextItems.length / PAGE_SIZE));
        return Math.min(current, totalPages);
      });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load support messages.' });
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiBase]);

  React.useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginatedItems = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return items.slice(startIndex, startIndex + PAGE_SIZE);
  }, [items, page]);

  const updateStatus = async (id: string, status: 'solved' | 'ignored') => {
    if (!apiBase || !adminToken) return;
    setBusyId(id);
    try {
      const response = await fetch(`${apiBase}/api/support/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update support message.');
      }
      const updatedItem = payload?.data as SupportMessage | undefined;
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedItem?.status || status,
              }
            : item,
        ),
      );
      setNotice({ type: 'success', message: `Message marked as ${status}.` });
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update support message.' });
    } finally {
      setBusyId('');
    }
  };

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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Support</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Contact Messages</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            Messages submitted from the website contact page will appear here.
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
          {loading ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              Loading support messages...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              No support messages yet.
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedItems.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-navy-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {item.status}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-navy-700 dark:text-white">{item.subject}</h2>
                      <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-300">
                        {item.fullName} · {item.email}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.message}</p>
                    </div>

                    {item.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void updateStatus(item.id, 'solved')}
                          disabled={busyId === item.id}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Solved
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateStatus(item.id, 'ignored')}
                          disabled={busyId === item.id}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Ignore
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-gray-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
