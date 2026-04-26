'use client';

import React, { useMemo, useState } from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdDownload, MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import { downloadCSV } from '@/utils/exportUtils';
import SearchInput from '@/components/ui/SearchInput';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getStoredAdminToken } from '@/lib/auth';
import {
  resetCustomerTableState,
  setCustomerCurrentPage,
  setCustomerCustomRange,
  setCustomerLocationFilter,
  setCustomerReportModal,
  setCustomerRowsPerPage,
  setCustomerSearchQuery,
  setCustomerStatusFilter,
  setCustomerTimeFilter,
} from '@/store/slices/tableStateSlice';

export type CustomerRow = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  phone?: string;
  location: string;
  totalSpent: number;
  totalOrders: number;
  status: string;
  joinedAt?: string | null;
};

type CustomerDetail = {
  customer: CustomerRow & {
    address?: string;
    preferredLanguage?: string;
    savedServicesCount?: number;
    locationLat?: number | null;
    locationLng?: number | null;
  };
  orders: Array<{
    id: string;
    orderNumber: string;
    service: string;
    categoryName: string;
    amount: number;
    paymentStatus: string;
    status: string;
    serviceAddress: string;
    scheduledDate?: string | null;
    scheduledTime?: string;
    provider: {
      id: string;
      name: string;
      avatar?: string;
      email?: string;
    };
  }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
    Number(value || 0)
  );

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusLabel = (value: string) => (value === 'active' ? 'Active' : 'Inactive');

const CustomerTable = ({ tableData }: { tableData: CustomerRow[] }) => {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, locationFilter, timeFilter, customRange, currentPage, rowsPerPage, showReportModal } =
    useAppSelector((state) => state.tableState.customer);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const locations = useMemo(() => ['All', ...new Set(tableData.map((r) => r.location).filter(Boolean))], [tableData]);
  const statuses = ['All', 'Active', 'Inactive'];

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || statusLabel(row.status) === statusFilter;
      const matchesLocation = locationFilter === 'All' || row.location === locationFilter;

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

      return matchesSearch && matchesStatus && matchesLocation && matchesTime;
    });
  }, [tableData, searchQuery, statusFilter, locationFilter, timeFilter, customRange]);

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
          location: row.location,
          totalSpent: row.totalSpent,
          totalOrders: row.totalOrders,
          status: statusLabel(row.status),
          joinedAt: formatDate(row.joinedAt),
        })),
        'customers_report.csv'
      );
    } else {
      window.print();
    }
    dispatch(setCustomerReportModal(false));
  };

  const handleReset = () => {
    dispatch(resetCustomerTableState());
  };

  const openCustomerModal = async (customerId: string) => {
    const adminToken = getStoredAdminToken();
    if (!API_BASE || !adminToken) {
      setDetailError('Missing admin session or API base URL.');
      return;
    }

    try {
      setDetailLoading(true);
      setDetailError('');
      setSelectedCustomer(null);
      const response = await fetch(`${API_BASE}/api/profile/admin/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          Accept: 'application/json',
        },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load customer details.');
      }
      setSelectedCustomer(payload.data as CustomerDetail);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Failed to load customer details.');
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

  const statusOptions = statuses.map((s) => ({ label: s, value: s }));
  const locationOptions = locations.map((l) => ({ label: l, value: l }));
  const rowsOptions = [10, 20, 50, 100].map((n) => ({ label: `${n} Rows`, value: n }));

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 py-4 transition-all">
      <header className="relative flex flex-col gap-6 pt-4 pb-2">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-2xl font-bold text-navy-700 dark:text-white">All Customers</div>
          <div className="flex items-center gap-3">
            {(searchQuery || statusFilter !== 'All' || locationFilter !== 'All' || timeFilter !== 'All') && (
              <button
                onClick={handleReset}
                className="rounded-full px-4 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => dispatch(setCustomerReportModal(true))}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-white shadow-lg shadow-brand-500/20 transition-all duration-300 hover:bg-brand-600 active:scale-95"
            >
              <MdDownload className="h-5 w-5" />
              <span className="text-sm font-bold">Download Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 lg:flex lg:flex-wrap dark:border-white/5 dark:bg-navy-800/50">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 ml-4 block text-[10px] font-bold uppercase text-gray-400">Quick Search</label>
            <SearchInput
              placeholder="Search name, email or location..."
              value={searchQuery}
              onChange={(e) => dispatch(setCustomerSearchQuery(e.target.value))}
            />
          </div>

          <div className="min-w-[140px]">
            <CustomSelect
              label="Time period"
              options={timeOptions}
              value={timeFilter}
              onChange={(val) => dispatch(setCustomerTimeFilter(val as string))}
            />
          </div>

          {timeFilter === 'Custom' && (
            <div className="animate-in flex items-center gap-3 fade-in duration-300">
              <CustomDatePicker
                label="From"
                value={customRange.start}
                onChange={(e) => dispatch(setCustomerCustomRange({ ...customRange, start: e.target.value }))}
              />
              <div className="mt-6 font-bold text-gray-400">to</div>
              <CustomDatePicker
                label="To"
                value={customRange.end}
                onChange={(e) => dispatch(setCustomerCustomRange({ ...customRange, end: e.target.value }))}
              />
            </div>
          )}

          <div className="min-w-[140px]">
            <CustomSelect
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => dispatch(setCustomerStatusFilter(val as string))}
            />
          </div>

          <div className="min-w-[160px]">
            <CustomSelect
              label="Location"
              options={locationOptions}
              value={locationFilter}
              onChange={(val) => dispatch(setCustomerLocationFilter(val as string))}
            />
          </div>

          <div className="min-w-[120px]">
            <CustomSelect
              label="Rows"
              options={rowsOptions}
              value={rowsPerPage}
              onChange={(val) => dispatch(setCustomerRowsPerPage(Number(val)))}
            />
          </div>
        </div>
      </header>

      <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="!border-px !border-gray-400">
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">CUSTOMER</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">LOCATION</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">TOTAL SPENT</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">TOTAL ORDERS</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pt-4 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} className="outline-none transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                <td className="min-w-[220px] border-white/0 py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => void openCustomerModal(row.id)}
                    className="group flex items-center gap-3 text-left"
                  >
                    {row.avatar ? (
                      <img src={row.avatar} alt={row.name} className="h-[40px] w-[40px] rounded-full object-cover" />
                    ) : (
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-brand-200 font-bold text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                        {row.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold uppercase text-navy-700 transition-colors group-hover:text-brand-500 dark:text-white">
                        {row.name}
                      </p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                  </button>
                </td>
                <td className="min-w-[180px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.location}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{formatMoney(row.totalSpent)}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.totalOrders}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    {row.status === 'active' ? (
                      <MdCheckCircle className="me-2 h-5 w-5 text-green-500" />
                    ) : (
                      <MdCancel className="me-2 h-5 w-5 text-red-500" />
                    )}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{statusLabel(row.status)}</p>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No matching customers found.
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
            onClick={() => dispatch(setCustomerCurrentPage(Math.max(1, currentPage - 1)))}
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
                  onClick={() => dispatch(setCustomerCurrentPage(p))}
                  className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'}`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => dispatch(setCustomerCurrentPage(Math.min(totalPages, currentPage + 1)))}
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
              <button onClick={() => dispatch(setCustomerReportModal(false))} className="text-gray-400 hover:text-red-500">
                <MdCancel className="h-6 w-6" />
              </button>
            </header>
            <div
              className="overflow-y-auto p-6 [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:overflow-visible print:p-0"
              id="printable-report"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold uppercase text-brand-500">Customer Report</h2>
                  <p className="mt-1 text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">Filters Applied:</p>
                  <p className="text-xs text-gray-500">
                    Time: {timeFilter} | Status: {statusFilter} | Location: {locationFilter}
                  </p>
                </div>
              </div>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 print:bg-gray-100 dark:bg-navy-900">
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Customer</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Location</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Total Spent</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Total Orders</th>
                    <th className="border-b p-3 text-xs font-bold uppercase text-gray-400 dark:border-white/10">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 print:border-gray-200 dark:border-white/10">
                      <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">{row.name}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.location}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{formatMoney(row.totalSpent)}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.totalOrders}</td>
                      <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">{statusLabel(row.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="flex items-center justify-end gap-4 border-t border-gray-100 bg-gray-50 p-6 print:hidden dark:border-white/10 dark:bg-navy-900">
              <button
                onClick={() => dispatch(setCustomerReportModal(false))}
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

      {(detailLoading || detailError || selectedCustomer) && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-navy-900/60 px-4 pb-4 pt-24 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-navy-800">
            <div className="sticky top-0 z-[210] flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-navy-800">
              <div>
                <h3 className="text-xl font-bold text-navy-700 dark:text-white">Customer Details</h3>
                <p className="text-sm text-gray-500">Full customer information and order history.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setDetailError('');
                  setDetailLoading(false);
                }}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-white/5"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-10 text-sm font-bold text-gray-500">Loading customer details...</div>
            ) : detailError ? (
              <div className="p-10 text-sm font-bold text-red-600">{detailError}</div>
            ) : selectedCustomer ? (
              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <div className="flex flex-col items-center text-center">
                      {selectedCustomer.customer.avatar ? (
                        <img
                          src={selectedCustomer.customer.avatar}
                          alt={selectedCustomer.customer.name}
                          className="h-28 w-28 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-500 text-4xl font-bold text-white">
                          {selectedCustomer.customer.name.charAt(0)}
                        </div>
                      )}
                      <h2 className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.name}</h2>
                      <p className="text-sm text-gray-500">{selectedCustomer.customer.email}</p>
                      <span className={`mt-4 rounded-full px-3 py-1 text-xs font-bold ${selectedCustomer.customer.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {statusLabel(selectedCustomer.customer.status)}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Total Spent</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{formatMoney(selectedCustomer.customer.totalSpent)}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Total Orders</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.totalOrders}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Joined</p>
                        <p className="mt-2 text-sm font-bold text-navy-700 dark:text-white">{formatDate(selectedCustomer.customer.joinedAt)}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Saved Services</p>
                        <p className="mt-2 text-xl font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.savedServicesCount || 0}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Phone</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Location</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Preferred Language</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">{selectedCustomer.customer.preferredLanguage || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Coordinates</p>
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white">
                          {selectedCustomer.customer.locationLat && selectedCustomer.customer.locationLng
                            ? `${selectedCustomer.customer.locationLat}, ${selectedCustomer.customer.locationLng}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="rounded-3xl border border-gray-100 p-6 shadow-sm dark:border-white/10">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">Order History</h4>
                        <p className="text-sm text-gray-500">Every order placed by this customer on the platform.</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-white/10">
                            <th className="py-3 text-left text-xs font-bold uppercase text-gray-400">Order</th>
                            <th className="py-3 text-left text-xs font-bold uppercase text-gray-400">Provider</th>
                            <th className="py-3 text-left text-xs font-bold uppercase text-gray-400">Amount</th>
                            <th className="py-3 text-left text-xs font-bold uppercase text-gray-400">Date</th>
                            <th className="py-3 text-left text-xs font-bold uppercase text-gray-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCustomer.orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 dark:border-white/5">
                              <td className="py-3">
                                <p className="text-sm font-bold text-navy-700 dark:text-white">{order.service}</p>
                                <p className="text-xs text-gray-400">#{order.orderNumber || order.id}</p>
                                <p className="text-xs text-gray-400">{order.categoryName || 'General'}</p>
                              </td>
                              <td className="py-3">
                                <p className="text-sm font-bold text-navy-700 dark:text-white">{order.provider.name}</p>
                                <p className="text-xs text-gray-400">{order.provider.email || ''}</p>
                              </td>
                              <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{formatMoney(order.amount)}</td>
                              <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(order.scheduledDate)}</td>
                              <td className="py-3">
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold uppercase text-gray-600">
                                  {order.status || order.paymentStatus || 'Unknown'}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {!selectedCustomer.orders.length && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-sm font-bold text-gray-500">
                                No orders found for this customer.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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

export default CustomerTable;
