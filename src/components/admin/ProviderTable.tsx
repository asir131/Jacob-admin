'use client';

import React, { useMemo, useState } from 'react';
import Card from '@/components/Card/Card';
import {
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
  MdDownload,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdOpenInNew,
  MdLocationOn,
  MdStar,
} from 'react-icons/md';
import { downloadCSV } from '@/utils/exportUtils';
import SearchInput from '@/components/ui/SearchInput';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getStoredAdminToken } from '@/lib/auth';
import {
  resetProviderTableState,
  setProviderCategoryFilter,
  setProviderCurrentPage,
  setProviderCustomRange,
  setProviderRatingFilter,
  setProviderReportModal,
  setProviderRowsPerPage,
  setProviderSearchQuery,
  setProviderTimeFilter,
} from '@/store/slices/tableStateSlice';

export type ProviderRow = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  categories: string[];
  status: string;
  rating: number;
  joinedAt?: string | null;
  onlineStatus?: string;
};

type ProviderDetail = {
  provider: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
    experienceLevel?: string;
    sellerLevel?: string;
    rating: number;
    reviewCount: number;
    totalOrders: number;
    completedOrders: number;
    completionRate: number;
    location: string;
    joinedAt?: string | null;
    status: string;
    onlineStatus: string;
    walletBalance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    locationLat?: number | null;
    locationLng?: number | null;
    serviceLocationLat?: number | null;
    serviceLocationLng?: number | null;
  };
  gigs: Array<{
    id: string;
    title: string;
    categoryName: string;
    categorySlug: string;
    status: string;
    images: string[];
    startingPrice: number;
    avgPackagePrice: number;
  }>;
  reviews: Array<{
    id: string;
    gigName: string;
    rating: number;
    review: string;
    createdAt?: string | null;
    client: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  performance: {
    responseRate: number;
    deliveredOnTime: number;
    orderCompletion: number;
  };
  skills: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const WEB_BASE = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
    Number(value || 0)
  );

const normalizeProviderStatus = (value: string) => {
  if (value === 'verified') return 'Verified';
  if (value === 'disable') return 'Disable';
  return 'Pending';
};

const extractZip = (value?: string) => {
  const match = String(value || '').match(/\b\d{5}(?:-\d{4})?\b/);
  return match ? match[0].slice(0, 5) : '';
};

const ProviderTable = ({ tableData }: { tableData: ProviderRow[] }) => {
  const dispatch = useAppDispatch();
  const { searchQuery, categoryFilter, ratingFilter, timeFilter, customRange, currentPage, rowsPerPage, showReportModal } =
    useAppSelector((state) => state.tableState.provider);
  const [selectedProvider, setSelectedProvider] = useState<ProviderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [requestRef, setRequestRef] = useState('');
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteNotice, setInviteNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const categories = useMemo(
    () => ['All', ...new Set(tableData.flatMap((row) => row.categories).filter(Boolean))],
    [tableData]
  );
  const ratings = ['All', '4.5+', '4.0+', '3.0+', 'Below 3.0'];

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const categoryText = row.categories.join(', ').toLowerCase();
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryText.includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || row.categories.includes(categoryFilter);
      const matchesZip = !zipFilter.trim() || extractZip(row.location) === zipFilter.trim();

      let matchesRating = true;
      if (ratingFilter === '4.5+') matchesRating = row.rating >= 4.5;
      else if (ratingFilter === '4.0+') matchesRating = row.rating >= 4.0;
      else if (ratingFilter === '3.0+') matchesRating = row.rating >= 3.0;
      else if (ratingFilter === 'Below 3.0') matchesRating = row.rating < 3.0;

      let matchesTime = true;
      const timestamp = row.joinedAt ? new Date(row.joinedAt).getTime() : 0;
      if (timestamp) {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
        const oneYear = 365 * 24 * 60 * 60 * 1000;

        if (timeFilter === 'Weekly') matchesTime = now - timestamp <= oneWeek;
        else if (timeFilter === '1 Month') matchesTime = now - timestamp <= oneMonth;
        else if (timeFilter === '6 Month') matchesTime = now - timestamp <= sixMonths;
        else if (timeFilter === 'Yearly') matchesTime = now - timestamp <= oneYear;
        else if (timeFilter === 'Custom' && customRange.start && customRange.end) {
          const start = new Date(customRange.start).getTime();
          const end = new Date(customRange.end).getTime();
          matchesTime = timestamp >= start && timestamp <= end;
        }
      }

      return matchesSearch && matchesCategory && matchesZip && matchesRating && matchesTime;
    });
  }, [tableData, searchQuery, categoryFilter, zipFilter, ratingFilter, timeFilter, customRange]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handleDownload = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      downloadCSV(
        filteredData.map((row) => ({
          name: row.name,
          email: row.email,
          categories: row.categories.join(', '),
          status: normalizeProviderStatus(row.status),
          rating: row.rating,
          joinedAt: formatDate(row.joinedAt),
        })),
        'providers_report.csv'
      );
    } else {
      window.print();
    }
    dispatch(setProviderReportModal(false));
  };

  const handleReset = () => {
    dispatch(resetProviderTableState());
    setZipFilter('');
    setSelectedProviderIds([]);
    setRequestRef('');
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviderIds((current) =>
      current.includes(providerId) ? current.filter((item) => item !== providerId) : [...current, providerId]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = paginatedData.map((row) => row.id);
    const allSelected = visibleIds.every((id) => selectedProviderIds.includes(id));
    setSelectedProviderIds((current) =>
      allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]
    );
  };

  const sendRequestToSelectedProviders = async () => {
    const adminToken = getStoredAdminToken();
    if (!API_BASE || !adminToken) {
      setInviteNotice({ type: 'error', message: 'Missing admin session or API base URL.' });
      return;
    }
    if (!requestRef.trim()) {
      setInviteNotice({ type: 'error', message: 'Paste a request ID or request number first.' });
      return;
    }
    if (!selectedProviderIds.length) {
      setInviteNotice({ type: 'error', message: 'Select at least one provider.' });
      return;
    }

    try {
      setInviteLoading(true);
      setInviteNotice(null);
      const response = await fetch(`${API_BASE}/api/service-requests/admin/invite-providers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          requestRef: requestRef.trim(),
          providerIds: selectedProviderIds,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to send provider requests.');
      }

      setInviteNotice({
        type: 'success',
        message: `${payload?.data?.invitedProviders?.length || selectedProviderIds.length} provider request(s) sent.`,
      });
      setSelectedProviderIds([]);
    } catch (error) {
      setInviteNotice({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send provider requests.' });
    } finally {
      setInviteLoading(false);
    }
  };

  const openProviderModal = async (providerId: string) => {
    const adminToken = getStoredAdminToken();
    if (!API_BASE || !adminToken) {
      setDetailError('Missing admin session or API base URL.');
      return;
    }

    try {
      setDetailLoading(true);
      setDetailError('');
      setSelectedProvider(null);
      const response = await fetch(`${API_BASE}/api/profile/admin/providers/${providerId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: 'application/json',
        },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load provider details.');
      }
      setSelectedProvider(payload.data as ProviderDetail);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Failed to load provider details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const timeOptions = [
    { label: 'All Time', value: 'All' },
    { label: 'Weekly', value: 'Weekly' },
    { label: '1 Month', value: '1 Month' },
    { label: '6 Month', value: '6 Month' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'Custom Range', value: 'Custom' },
  ];

  const categoryOptions = categories.map((cat) => ({ label: cat, value: cat }));
  const ratingOptions = ratings.map((r) => ({ label: r, value: r }));
  const rowsOptions = [10, 20, 50, 100].map((n) => ({ label: `${n} Rows`, value: n }));

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 py-4 transition-all">
      <header className="relative flex flex-col gap-6 pt-4 pb-2">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-2xl font-bold text-navy-700 dark:text-white">All Providers</div>
          <div className="flex items-center gap-3">
            {(searchQuery || categoryFilter !== 'All' || zipFilter || ratingFilter !== 'All' || timeFilter !== 'All') && (
              <button
                onClick={handleReset}
                className="rounded-full px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => dispatch(setProviderReportModal(true))}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-white shadow-lg shadow-brand-500/20 transition-all duration-300 hover:bg-brand-600 active:scale-95"
            >
              <MdDownload className="h-5 w-5" />
              <span className="text-sm font-bold">Download Report</span>
            </button>
          </div>
        </div>

        {inviteNotice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-bold ${
              inviteNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
            }`}
          >
            {inviteNotice.message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 items-end gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 lg:flex lg:flex-wrap dark:border-white/5 dark:bg-navy-800/50">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 ml-4 block text-[10px] font-bold uppercase text-gray-400">Quick Search</label>
            <SearchInput
              placeholder="Search name, email or category..."
              value={searchQuery}
              onChange={(e) => dispatch(setProviderSearchQuery(e.target.value))}
            />
          </div>

          <div className="min-w-[140px]">
            <CustomSelect
              label="Time period"
              options={timeOptions}
              value={timeFilter}
              onChange={(val) => dispatch(setProviderTimeFilter(val as string))}
            />
          </div>

          {timeFilter === 'Custom' && (
            <div className="animate-in flex items-center gap-3 fade-in duration-300">
              <CustomDatePicker
                label="From"
                value={customRange.start}
                onChange={(e) => dispatch(setProviderCustomRange({ ...customRange, start: e.target.value }))}
              />
              <div className="mt-6 font-bold text-gray-400">to</div>
              <CustomDatePicker
                label="To"
                value={customRange.end}
                onChange={(e) => dispatch(setProviderCustomRange({ ...customRange, end: e.target.value }))}
              />
            </div>
          )}

          <div className="min-w-[160px]">
            <CustomSelect
              label="Category"
              options={categoryOptions}
              value={categoryFilter}
              onChange={(val) => dispatch(setProviderCategoryFilter(val as string))}
            />
          </div>

          <div className="min-w-[140px]">
            <label className="mb-1 ml-4 block text-[10px] font-bold uppercase text-gray-400">ZIP Code</label>
            <input
              type="text"
              value={zipFilter}
              onChange={(event) => setZipFilter(event.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="10001"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-white/10 dark:bg-navy-900 dark:text-white"
            />
          </div>

          <div className="min-w-[140px]">
            <CustomSelect
              label="Rating"
              options={ratingOptions}
              value={ratingFilter}
              onChange={(val) => dispatch(setProviderRatingFilter(val as string))}
            />
          </div>

          <div className="min-w-[120px]">
            <CustomSelect
              label="Rows"
              options={rowsOptions}
              value={rowsPerPage}
              onChange={(val) => dispatch(setProviderRowsPerPage(Number(val)))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-[#2286BE]/10 bg-[#2286BE]/5 p-6 lg:grid-cols-[1fr_auto] dark:border-[#2286BE]/20 dark:bg-[#2286BE]/10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 ml-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#2286BE]">Request ID or Number</label>
              <input
                type="text"
                value={requestRef}
                onChange={(event) => setRequestRef(event.target.value)}
                placeholder="Paste copied request ID or REQ-..."
                className="h-12 w-full rounded-2xl border border-[#2286BE]/20 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#2286BE] dark:border-[#2286BE]/20 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Select one or more providers below, then send the copied request to them for review.
              </p>
            </div>
          </div>
          <div className="flex items-end justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedProviderIds([])}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={() => void sendRequestToSelectedProviders()}
              disabled={inviteLoading}
              className="h-12 rounded-2xl bg-[#2286BE] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {inviteLoading ? 'Sending...' : `Send To Selected (${selectedProviderIds.length})`}
            </button>
          </div>
        </div>
      </header>

      <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every((row) => selectedProviderIds.includes(row.id))}
                    onChange={toggleSelectAllVisible}
                  />
                  Select
                </label>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">PROVIDER</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">CATEGORY</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">RATING</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">JOIN DATE</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="outline-none transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                <td className="min-w-[90px] border-white/0 py-3 pr-4">
                  <input
                    type="checkbox"
                    checked={selectedProviderIds.includes(row.id)}
                    onChange={() => toggleProviderSelection(row.id)}
                  />
                </td>
                <td className="min-w-[240px] border-white/0 py-3 pr-4">
                  <button type="button" onClick={() => void openProviderModal(row.id)} className="group flex items-center gap-3 text-left">
                    {row.avatar ? (
                      <img src={row.avatar} alt={row.name} className="h-[40px] w-[40px] rounded-full object-cover" />
                    ) : (
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-200 font-bold text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                        {row.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-navy-700 transition-colors group-hover:text-brand-500 dark:text-white">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                  </button>
                </td>
                <td className="min-w-[220px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.categories.join(', ') || 'No categories yet'}</p>
                  <p className="mt-1 text-xs text-gray-400">{extractZip(row.location) || 'No ZIP in profile'}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    {row.status === 'verified' ? (
                      <MdCheckCircle className="me-2 h-5 w-5 text-green-500" />
                    ) : row.status === 'disable' ? (
                      <MdCancel className="me-2 h-5 w-5 text-red-500" />
                    ) : (
                      <MdOutlineError className="me-2 h-5 w-5 text-amber-500" />
                    )}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{normalizeProviderStatus(row.status)}</p>
                  </div>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <MdStar className="text-amber-500" />
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.rating.toFixed(1)}</p>
                  </div>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{formatDate(row.joinedAt)}</p>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No matching providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          Showing <span className="text-navy-700 dark:text-white">{filteredData.length ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to{' '}
          <span className="text-navy-700 dark:text-white">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of{' '}
          <span className="text-navy-700 dark:text-white">{filteredData.length}</span> results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setProviderCurrentPage(Math.max(1, currentPage - 1)))}
            disabled={currentPage === 1}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${currentPage === 1 ? 'cursor-not-allowed opacity-30' : ''}`}
          >
            <MdChevronLeft className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                <button
                  onClick={() => dispatch(setProviderCurrentPage(p))}
                  className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'}`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => dispatch(setProviderCurrentPage(Math.min(totalPages, currentPage + 1)))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed opacity-30' : ''}`}
          >
            <MdChevronRight className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/50 p-4 backdrop-blur-sm print:absolute print:inset-0 print:z-[200] print:bg-white print:p-0">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @media print {
                  body * { visibility: hidden !important; }
                  #printable-report, #printable-report * { visibility: visible !important; }
                  #printable-report {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    padding: 20px !important;
                  }
                  @page { margin: 0; }
                }
              `,
            }}
          />
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl print:max-h-none print:rounded-none print:shadow-none dark:bg-navy-800">
            <header className="flex items-center justify-between border-b border-gray-100 p-6 print:hidden dark:border-white/10">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">Report Preview</h3>
              <button onClick={() => dispatch(setProviderReportModal(false))} className="text-gray-400 hover:text-red-500">
                <MdCancel className="h-6 w-6" />
              </button>
            </header>
            <div className="overflow-y-auto p-6 [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:overflow-visible print:p-0" id="printable-report">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold uppercase text-brand-500">Provider Report</h2>
                  <p className="mt-1 text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">Filters Applied:</p>
                  <p className="text-xs text-gray-500">
                    Time: {timeFilter} | Category: {categoryFilter} | Rating: {ratingFilter}
                  </p>
                </div>
              </div>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 print:bg-gray-100 dark:bg-navy-900">
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Provider</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Email</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Category</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Status</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 print:border-gray-200 dark:border-white/10">
                      <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">{row.name}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.email}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.categories.join(', ')}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{normalizeProviderStatus(row.status)}</td>
                      <td className="p-3 text-sm font-bold text-brand-500">{row.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="flex items-center justify-end gap-4 border-t border-gray-100 bg-gray-50 p-6 print:hidden dark:border-white/10 dark:bg-navy-900">
              <button
                onClick={() => dispatch(setProviderReportModal(false))}
                className="rounded-lg px-6 py-2 text-sm font-bold text-gray-600 transition-colors hover:text-navy-700 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="rounded-lg bg-navy-700 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-800"
              >
                Download CSV
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
              >
                Download PDF
              </button>
            </footer>
          </div>
        </div>
      )}

      {(detailLoading || detailError || selectedProvider) && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-navy-900/60 px-4 pb-4 pt-24 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-navy-800">
            <div className="sticky top-0 z-[210] flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-navy-800">
              <div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Provider Details</h3>
                <p className="text-sm text-gray-500">Admin view with provider profile, gigs, and reviews.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setDetailError('');
                  setDetailLoading(false);
                }}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-white/5"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-10 text-sm font-bold text-gray-500">Loading provider details...</div>
            ) : detailError ? (
              <div className="p-10 text-sm font-bold text-red-600">{detailError}</div>
            ) : selectedProvider ? (
              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <div className="flex flex-col items-center text-center">
                      {selectedProvider.provider.avatar ? (
                        <img
                          src={selectedProvider.provider.avatar}
                          alt={selectedProvider.provider.name}
                          className="h-28 w-28 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-500 text-4xl font-bold text-white">
                          {selectedProvider.provider.name.charAt(0)}
                        </div>
                      )}
                      <h2 className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{selectedProvider.provider.name}</h2>
                      <p className="text-sm text-gray-500">{selectedProvider.provider.email}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedProvider.provider.status === 'verified' ? 'bg-green-100 text-green-600' : selectedProvider.provider.status === 'disable' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          {normalizeProviderStatus(selectedProvider.provider.status)}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedProvider.provider.onlineStatus === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          {selectedProvider.provider.onlineStatus === 'active' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Rating</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.provider.rating.toFixed(1)}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Reviews</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.provider.reviewCount}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Total Orders</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.provider.totalOrders}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Joined</p>
                        <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{formatDate(selectedProvider.provider.joinedAt)}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Phone</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{selectedProvider.provider.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Location</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{selectedProvider.provider.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Bio</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{selectedProvider.provider.bio || 'No bio added yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Coordinates</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">
                          {selectedProvider.provider.serviceLocationLat && selectedProvider.provider.serviceLocationLng
                            ? `${selectedProvider.provider.serviceLocationLat}, ${selectedProvider.provider.serviceLocationLng}`
                            : selectedProvider.provider.locationLat && selectedProvider.provider.locationLng
                              ? `${selectedProvider.provider.locationLat}, ${selectedProvider.provider.locationLng}`
                              : 'N/A'}
                        </p>
                      </div>
                      <a
                        href={`${WEB_BASE}/provider/${selectedProvider.provider.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                      >
                        Open Public Profile
                        <MdOpenInNew className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-gray-100 p-5 shadow-sm dark:border-white/10">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Total Earnings</p>
                      <p className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">{formatMoney(selectedProvider.provider.totalEarnings)}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-100 p-5 shadow-sm dark:border-white/10">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Wallet Balance</p>
                      <p className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">{formatMoney(selectedProvider.provider.walletBalance)}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-100 p-5 shadow-sm dark:border-white/10">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Withdrawn</p>
                      <p className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">{formatMoney(selectedProvider.provider.totalWithdrawn)}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-xl font-bold text-navy-700 dark:text-white">Performance</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MdLocationOn className="h-4 w-4" />
                        {selectedProvider.provider.location}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Response Rate</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.performance.responseRate}%</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Delivered On Time</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.performance.deliveredOnTime}%</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Order Completion</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedProvider.performance.orderCompletion}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">Categories and Gigs</h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedProvider.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-500">
                          {skill}
                        </span>
                      ))}
                      {!selectedProvider.skills.length && (
                        <span className="text-sm text-gray-500">No categories yet.</span>
                      )}
                    </div>
                    <div className="mt-5 space-y-3">
                      {selectedProvider.gigs.map((gig) => (
                        <div key={gig.id} className="rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-lg font-bold text-navy-700 dark:text-white">{gig.title}</p>
                              <p className="text-sm text-gray-500">{gig.categoryName || gig.categorySlug}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600">
                                {gig.status}
                              </span>
                              <span className="text-sm font-bold text-brand-500">{formatMoney(gig.avgPackagePrice)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!selectedProvider.gigs.length && (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-white/10">
                          No gigs found for this provider.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">Customer Reviews</h4>
                    <div className="mt-5 space-y-4">
                      {selectedProvider.reviews.map((review) => (
                        <div key={review.id} className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-navy-700 dark:text-white">{review.client.name}</p>
                              <p className="text-xs text-gray-400">{review.gigName}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <MdStar className="h-4 w-4" />
                              <span className="text-sm font-bold">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{review.review || 'No written review.'}</p>
                          <p className="mt-2 text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                        </div>
                      ))}
                      {!selectedProvider.reviews.length && (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-white/10">
                          No reviews found for this provider.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProviderTable;
