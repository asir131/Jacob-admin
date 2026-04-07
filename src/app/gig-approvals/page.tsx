'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';
import {
  MdAddCircleOutline,
  MdBrush,
  MdBuild,
  MdDelete,
  MdFavoriteBorder,
  MdMemory,
  MdHandyman,
  MdLocalShipping,
  MdOpacity,
  MdContentCut,
  MdVerified,
  MdAutoAwesome,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdLocationOn,
  MdPerson,
  MdDescription,
  MdImage,
  MdInventory2,
} from 'react-icons/md';

type PendingGigRequest = {
  _id: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  customCategoryName?: string;
  customCategoryDescription?: string;
  customCategoryIconName?: string;
  description?: string;
  requirements?: string;
  packages?: Array<{
    name?: string;
    title?: string;
    description?: string;
    deliveryTime?: string;
    price?: number;
  }>;
  images?: string[];
  baseCity?: string;
  locationLat?: number | null;
  locationLng?: number | null;
  travelRadiusKm?: number | null;
  status?: string;
  createdAt?: string;
  rejectionReason?: string;
  providerId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
};

const ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <MdVerified className="h-5 w-5" />,
  Sparkles: <MdAutoAwesome className="h-5 w-5" />,
  Paintbrush: <MdBrush className="h-5 w-5" />,
  Wrench: <MdBuild className="h-5 w-5" />,
  Zap: <MdAddCircleOutline className="h-5 w-5" />,
  Trash2: <MdDelete className="h-5 w-5" />,
  Heart: <MdFavoriteBorder className="h-5 w-5" />,
  Cpu: <MdMemory className="h-5 w-5" />,
  Hammer: <MdHandyman className="h-5 w-5" />,
  Truck: <MdLocalShipping className="h-5 w-5" />,
  Droplets: <MdOpacity className="h-5 w-5" />,
  Scissors: <MdContentCut className="h-5 w-5" />,
};

const ICON_OPTIONS = Object.keys(ICONS);

const formatDate = (value?: string) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

export default function GigApprovalsPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [adminToken, setAdminToken] = useState('');
  const [pendingRequests, setPendingRequests] = useState<PendingGigRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [selectedIcons, setSelectedIcons] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [busyRequestId, setBusyRequestId] = useState<string>('');
  const latestNotificationCount = useAppSelector((state) => state.adminNotifications.items.length);

  const selectedRequest = useMemo(
    () => pendingRequests.find((request) => request._id === selectedRequestId) || pendingRequests[0] || null,
    [pendingRequests, selectedRequestId]
  );

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 3000);
  };

  const loadRequests = useCallback(async () => {
    if (!apiBase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/gigs/pending`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined,
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        showNotice('error', payload?.message || 'Could not load pending approvals.');
        setPendingRequests([]);
        return;
      }

      const requests = Array.isArray(payload.data) ? payload.data : [];
      setPendingRequests(requests);
      setSelectedRequestId((current) => {
        if (current && requests.some((request: PendingGigRequest) => request._id === current)) {
          return current;
        }
        return requests[0]?._id || '';
      });
    } catch {
      showNotice('error', 'Could not load pending approvals.');
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiBase]);

  useEffect(() => {
    const token = localStorage.getItem('admin_dashboard_token') || '';
    setAdminToken(token);
  }, []);

  useEffect(() => {
    if (!adminToken) {
      setLoading(false);
      return;
    }

    void loadRequests();
  }, [adminToken, loadRequests, latestNotificationCount]);

  const approveRequest = async (id: string) => {
    if (!apiBase) return;

    setBusyRequestId(id);
    try {
      const response = await fetch(`${apiBase}/api/gigs/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({
          iconName: selectedIcons[id] || '',
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        showNotice('error', payload?.message || 'Could not approve request.');
        return;
      }

      showNotice('success', 'Approved and added to categories.');
      setPendingRequests((prev) => prev.filter((request) => request._id !== id));
      setSelectedIcons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setRejectionReasons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedRequestId((current) => (current === id ? '' : current));
    } catch {
      showNotice('error', 'Could not approve request.');
    } finally {
      setBusyRequestId('');
    }
  };

  const rejectRequest = async (id: string) => {
    if (!apiBase) return;

    setBusyRequestId(id);
    try {
      const response = await fetch(`${apiBase}/api/gigs/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({
          rejectionReason: rejectionReasons[id] || '',
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        showNotice('error', payload?.message || 'Could not reject request.');
        return;
      }

      showNotice('success', 'Gig request rejected.');
      setPendingRequests((prev) => prev.filter((request) => request._id !== id));
      setSelectedIcons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setRejectionReasons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedRequestId((current) => (current === id ? '' : current));
    } catch {
      showNotice('error', 'Could not reject request.');
    } finally {
      setBusyRequestId('');
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Gig approvals</p>
              <h1 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
                Review custom categories before they go live
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-300">
                When a provider creates a custom category, approving this request will automatically add that category to the
                main categories list. You can also choose an icon, or leave it empty to use the default shield icon.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadRequests()}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2286BE]/20 bg-[#2286BE]/5 px-4 text-sm font-semibold text-[#2286BE] transition hover:bg-[#2286BE]/10"
            >
              <MdRefresh className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-lightPrimary px-4 py-4 dark:bg-navy-700">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
                Pending requests
              </div>
              <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">{pendingRequests.length}</div>
            </div>
            <div className="rounded-2xl bg-lightPrimary px-4 py-4 dark:bg-navy-700">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
                Approval outcome
              </div>
              <div className="mt-2 text-sm font-semibold text-navy-700 dark:text-white">
                Approve to publish and add to categories
              </div>
            </div>
            <div className="rounded-2xl bg-lightPrimary px-4 py-4 dark:bg-navy-700">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
                Default icon
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                <MdVerified className="h-4 w-4 text-[#2286BE]" />
                ShieldCheck
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            Loading pending requests...
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
            No pending custom category requests right now.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const isActive = selectedRequest?._id === request._id;
                const providerName = [request.providerId?.firstName, request.providerId?.lastName].filter(Boolean).join(' ') || 'Unknown provider';

                return (
                  <button
                    key={request._id}
                    type="button"
                    onClick={() => setSelectedRequestId(request._id)}
                    className={`w-full rounded-[24px] border p-5 text-left shadow-sm transition ${
                      isActive
                        ? 'border-[#2286BE] bg-white ring-2 ring-[#2286BE]/10 dark:bg-navy-800'
                        : 'border-gray-100 bg-white hover:border-[#2286BE]/30 dark:border-white/10 dark:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2286BE]">
                          Custom category request
                        </p>
                        <h2 className="mt-2 text-lg font-bold text-navy-700 dark:text-white">
                          {request.customCategoryName || request.categoryName}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{request.title}</p>
                    </div>
                    <div className="rounded-2xl bg-lightPrimary p-3 text-[#2286BE] dark:bg-navy-700">
                      {ICONS[request.customCategoryIconName || 'ShieldCheck'] || (
                          <MdVerified className="h-5 w-5" />
                        )}
                    </div>
                  </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <MdPerson className="h-4 w-4" />
                        <span>{providerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdSchedule className="h-4 w-4" />
                        <span>{formatDate(request.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCheckCircle className="h-4 w-4" />
                        <span>Approve to add this category to the main list</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedRequest ? (
              <div className="space-y-6 rounded-[24px] bg-white p-6 shadow-sm dark:bg-navy-800">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#2286BE]">Selected request</p>
                    <h2 className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
                      {selectedRequest.customCategoryName || selectedRequest.categoryName}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-300">
                      {selectedRequest.customCategoryDescription ||
                        'No category description was provided by the provider.'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-lightPrimary p-4 text-[#2286BE] dark:bg-navy-700">
                    {ICONS[selectedIcons[selectedRequest._id] || selectedRequest.customCategoryIconName || 'ShieldCheck'] || (
                      <MdVerified className="h-6 w-6" />
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                      <MdPerson className="h-4 w-4 text-[#2286BE]" />
                      Provider
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {[selectedRequest.providerId?.firstName, selectedRequest.providerId?.lastName].filter(Boolean).join(' ') || 'Unknown provider'}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{selectedRequest.providerId?.email || 'No email provided'}</div>
                  </div>

                  <div className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                      <MdLocationOn className="h-4 w-4 text-[#2286BE]" />
                      Location
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {selectedRequest.baseCity || 'Location not provided'}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.travelRadiusKm ? `Travel radius: ${selectedRequest.travelRadiusKm} km` : 'Travel radius not set'}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                      <MdDescription className="h-4 w-4 text-[#2286BE]" />
                      Gig description
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {selectedRequest.description || 'No gig description provided.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                      <MdCancel className="h-4 w-4 text-[#2286BE]" />
                      Requirements
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {selectedRequest.requirements || 'No requirements provided.'}
                    </p>
                  </div>
                </div>

                  <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                    <MdInventory2 className="h-4 w-4 text-[#2286BE]" />
                    Packages
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {(selectedRequest.packages || []).map((pkg, index) => (
                      <div key={`${selectedRequest._id}-${pkg.name || index}`} className="rounded-2xl bg-lightPrimary p-4 dark:bg-navy-700">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#2286BE]">
                          {pkg.name || `Package ${index + 1}`}
                        </div>
                        <div className="mt-2 text-sm font-bold text-navy-700 dark:text-white">
                          {pkg.title || 'Untitled package'}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                          {pkg.description || 'No package description provided.'}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-sm font-semibold text-navy-700 dark:text-white">
                          <span>{pkg.deliveryTime || 'N/A'}</span>
                          <span>${pkg.price ?? 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-white">
                    <MdImage className="h-4 w-4 text-[#2286BE]" />
                    Uploaded images
                  </div>
                  {selectedRequest.images?.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {selectedRequest.images.map((image, index) => (
                        <a
                          key={`${selectedRequest._id}-image-${index}`}
                          href={image}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-navy-700"
                        >
                          <img src={image} alt={`Gig image ${index + 1}`} className="h-32 w-full object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-300">No images were uploaded for this request.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-navy-700 dark:text-white">Choose category icon</div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                        If you do not choose an icon, the default shield icon will be used.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedIcons((prev) => {
                          const next = { ...prev };
                          delete next[selectedRequest._id];
                          return next;
                        })
                      }
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-[#2286BE]/40 hover:text-[#2286BE]"
                    >
                      Use default icon
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-8">
                    {ICON_OPTIONS.map((iconName) => {
                      const isSelected = (selectedIcons[selectedRequest._id] || selectedRequest.customCategoryIconName || '') === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            setSelectedIcons((prev) => ({
                              ...prev,
                              [selectedRequest._id]: iconName,
                            }))
                          }
                          className={`flex h-12 items-center justify-center rounded-xl border transition ${
                            isSelected
                              ? 'border-[#2286BE] bg-[#2286BE]/10 text-[#2286BE]'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-[#2286BE]/40 dark:border-white/10 dark:bg-navy-700'
                          }`}
                          title={iconName}
                        >
                          {ICONS[iconName]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                  <div className="text-sm font-semibold text-navy-700 dark:text-white">Reject reason</div>
                  <textarea
                    value={rejectionReasons[selectedRequest._id] || ''}
                    onChange={(event) =>
                      setRejectionReasons((prev) => ({
                        ...prev,
                        [selectedRequest._id]: event.target.value,
                      }))
                    }
                    placeholder="Optional reason for rejection..."
                    rows={3}
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void approveRequest(selectedRequest._id)}
                    disabled={busyRequestId === selectedRequest._id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdCheckCircle className="h-4 w-4" />
                    Approve & add to categories
                  </button>
                  <button
                    type="button"
                    onClick={() => void rejectRequest(selectedRequest._id)}
                    disabled={busyRequestId === selectedRequest._id}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 px-5 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                  >
                    <MdCancel className="h-4 w-4" />
                    Reject request
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] bg-white p-8 text-sm font-semibold text-gray-500 shadow-sm dark:bg-navy-800">
                Select a request to view details.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
