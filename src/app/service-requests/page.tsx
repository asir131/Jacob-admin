'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';

type AdminServiceRequest = {
  id: string;
  requestNumber: string;
  categoryName: string;
  categorySlug: string;
  customCategoryName?: string;
  customCategoryDescription?: string;
  customCategoryApprovalStatus?: 'not_requested' | 'pending' | 'approved' | 'rejected';
  serviceAddress: string;
  description: string;
  preferredDate?: string | null;
  preferredTime?: string;
  budget: number;
  status: 'open' | 'accepted' | 'cancelled';
  requestType: 'custom' | 'matched';
  imageUrls?: string[];
  createdAt?: string;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  acceptedProvider?: {
    name?: string;
    email?: string;
  } | null;
  linkedOrderNumber?: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
};

export default function ServiceRequestsPage() {
  const PAGE_SIZE = 10;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const searchParams = useSearchParams();
  const adminToken = useAppSelector((state) => state.auth.session?.accessToken || '');
  const notificationCount = useAppSelector((state) => state.adminNotifications.items.length);
  const highlightedRequestId = searchParams.get('requestId') || '';

  const [items, setItems] = React.useState<AdminServiceRequest[]>([]);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<'all' | 'open' | 'accepted' | 'cancelled'>('all');
  const [requestType, setRequestType] = React.useState<'all' | 'custom' | 'matched'>('all');
  const [loading, setLoading] = React.useState(true);
  const [actioningId, setActioningId] = React.useState('');
  const [notice, setNotice] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const copyToClipboard = React.useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(String(value || ''));
      setNotice({ type: 'success', message: `${label} copied.` });
    } catch {
      setNotice({ type: 'error', message: `Could not copy ${label.toLowerCase()}.` });
    }
  }, []);

  const loadRequests = React.useCallback(async () => {
    if (!apiBase || !adminToken) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        status,
        requestType,
      });

      if (search.trim()) {
        params.set('search', search.trim());
      }

      const response = await fetch(`${apiBase}/api/service-requests/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load service requests.');
      }

      setItems(Array.isArray(payload?.data?.items) ? payload.data.items : []);
      setPagination(
        payload?.data?.pagination || {
          page,
          limit: PAGE_SIZE,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (error: unknown) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load service requests.' });
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiBase, page, requestType, search, status]);

  React.useEffect(() => {
    void loadRequests();
  }, [loadRequests, notificationCount]);

  React.useEffect(() => {
    setPage(1);
  }, [search, status, requestType]);

  React.useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const handleApproveCustomCategory = React.useCallback(
    async (requestId: string) => {
      if (!apiBase || !adminToken || !requestId) return;

      setActioningId(requestId);
      try {
        const response = await fetch(`${apiBase}/api/service-requests/admin/${requestId}/custom-category/approve`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to approve the custom category request.');
        }

        setNotice({ type: 'success', message: payload?.message || 'Custom category request approved.' });
        await loadRequests();
      } catch (error: unknown) {
        setNotice({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to approve the custom category request.',
        });
      } finally {
        setActioningId('');
      }
    },
    [adminToken, apiBase, loadRequests]
  );

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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Client requests</p>
          <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">Requested gigs from search and custom forms</h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            Clients can submit custom service requests when they do not find a matching category or gig. Review all incoming requests here.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search request, category or address..."
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'all' | 'open' | 'accepted' | 'cancelled')}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={requestType}
              onChange={(event) => setRequestType(event.target.value as 'all' | 'custom' | 'matched')}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
            >
              <option value="all">All request types</option>
              <option value="custom">Custom requests</option>
              <option value="matched">Matched category requests</option>
            </select>
            <button
              type="button"
              onClick={() => void loadRequests()}
              className="h-12 rounded-2xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
          {loading ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              Loading service requests...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-lightPrimary p-5 text-sm font-semibold text-gray-500 dark:bg-navy-700 dark:text-gray-300">
              No service requests found for the current filters.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const isHighlighted = highlightedRequestId && highlightedRequestId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[24px] border bg-white p-5 shadow-sm dark:bg-navy-900 ${
                      isHighlighted
                        ? 'border-[#2286BE] ring-2 ring-[#2286BE]/10 dark:border-[#2286BE]'
                        : 'border-gray-100 dark:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {item.requestNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(item.requestNumber, 'Request number')}
                            className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-50"
                          >
                            Copy Number
                          </button>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(item.id, 'Request ID')}
                            className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-50"
                          >
                            Copy ID
                          </button>
                          <span className="rounded-full bg-[#2286BE]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#2286BE]">
                            {item.requestType === 'custom' ? 'Custom request' : 'Matched category'}
                          </span>
                          {item.requestType === 'custom' ? (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                              Category {item.customCategoryApprovalStatus || 'pending'}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                            {item.status}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">{formatDate(item.createdAt)}</span>
                        </div>

                        <h2 className="mt-3 text-lg font-bold text-navy-700 dark:text-white">{item.categoryName || 'Untitled request'}</h2>
                        <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-300">
                          {item.client?.name || 'Unknown client'} · {item.client?.email || 'No email'} · Budget ${item.budget || 0}
                        </p>
                        {item.requestType === 'custom' ? (
                          <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                            Requested new category: {item.customCategoryName || item.categoryName}
                          </p>
                        ) : null}
                        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.description || 'No description provided.'}</p>
                        {item.requestType === 'custom' && item.customCategoryDescription ? (
                          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-300">
                            Category note: {item.customCategoryDescription}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-stretch gap-3">
                        <div className="rounded-2xl bg-lightPrimary px-4 py-3 text-sm font-semibold text-gray-600 dark:bg-navy-700 dark:text-gray-300">
                          {item.linkedOrderNumber ? `Order ${item.linkedOrderNumber}` : 'No linked order yet'}
                        </div>
                        {item.requestType === 'custom' && item.customCategoryApprovalStatus === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => void handleApproveCustomCategory(item.id)}
                            disabled={actioningId === item.id}
                            className="rounded-2xl bg-[#2286BE] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actioningId === item.id ? 'Approving...' : 'Approve Category'}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Service address</div>
                        <div className="mt-2 text-sm font-semibold text-navy-700 dark:text-white">{item.serviceAddress || 'Not provided'}</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                          Preferred: {item.preferredDate ? formatDate(item.preferredDate) : 'Flexible'} {item.preferredTime || ''}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Client details</div>
                        <div className="mt-2 text-sm font-semibold text-navy-700 dark:text-white">{item.client?.name || 'Unknown client'}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{item.client?.phone || 'No phone provided'}</div>
                      </div>
                      <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Accepted provider</div>
                        <div className="mt-2 text-sm font-semibold text-navy-700 dark:text-white">
                          {item.acceptedProvider?.name || 'Not accepted yet'}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{item.acceptedProvider?.email || 'Waiting for provider'}</div>
                      </div>
                    </div>

                    {Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? (
                      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {item.imageUrls.map((imageUrl, index) => (
                          <a
                            key={`${item.id}-image-${index}`}
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-800"
                          >
                            <img src={imageUrl} alt={`Request image ${index + 1}`} className="h-28 w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {pagination.totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-gray-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} requests
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                      disabled={!pagination.hasNextPage}
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
