'use client';
import React, { useMemo } from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdDownload, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Link from 'next/link';
import { downloadCSV } from '@/utils/exportUtils';
import SearchInput from '@/components/ui/SearchInput';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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

type RowObj = {
  id: string;
  name: string;
  email: string;
  location: string;
  spent: string;
  jobs: number;
  status: string;
  date: string;
  timestamp: number;
};

const CustomerTable = (props: { tableData: RowObj[] }) => {
  const { tableData } = props;
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, locationFilter, timeFilter, customRange, currentPage, rowsPerPage, showReportModal } =
    useAppSelector((state) => state.tableState.customer);

  // Extract unique locations for filter
  const locations = useMemo(() => ['All', ...new Set(tableData.map(r => r.location))], [tableData]);
  const statuses = ['All', 'Active', 'Inactive'];

  // Filter Logic
  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
      const matchesLocation = locationFilter === 'All' || row.location === locationFilter;

      let matchesTime = true;
      if (row.timestamp) {
        const now = new Date().getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
        const oneYear = 365 * 24 * 60 * 60 * 1000;

        if (timeFilter === 'Weekly') matchesTime = now - row.timestamp <= oneWeek;
        else if (timeFilter === '1 Month') matchesTime = now - row.timestamp <= oneMonth;
        else if (timeFilter === '6 Month') matchesTime = now - row.timestamp <= sixMonths;
        else if (timeFilter === 'Yearly') matchesTime = now - row.timestamp <= oneYear;
        else if (timeFilter === 'Custom' && customRange.start && customRange.end) {
          const start = new Date(customRange.start).getTime();
          const end = new Date(customRange.end).getTime();
          matchesTime = row.timestamp >= start && row.timestamp <= end;
        }
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesTime;
    });
  }, [tableData, searchQuery, statusFilter, locationFilter, timeFilter, customRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handleDownload = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      downloadCSV(filteredData, 'customers_report.csv');
    } else {
      window.print();
    }
    dispatch(setCustomerReportModal(false));
  };

  const handleReset = () => {
    dispatch(resetCustomerTableState());
  };

  const timeOptions = [
    { label: 'All Time', value: 'All' },
    { label: 'Weekly', value: 'Weekly' },
    { label: '1 Month', value: '1 Month' },
    { label: '6 Month', value: '6 Month' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'Custom Range', value: 'Custom' },
  ];

  const statusOptions = statuses.map(s => ({ label: s, value: s }));
  const locationOptions = locations.map(l => ({ label: l, value: l }));
  const rowsOptions = [10, 20, 50, 100].map(n => ({ label: `${n} Rows`, value: n }));

  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6 py-4 transition-all'}>
      <header className="relative flex flex-col gap-6 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold text-navy-700 dark:text-white">
            Verified Homeowners
          </div>
          <div className="flex items-center gap-3">
            {(searchQuery || statusFilter !== 'All' || locationFilter !== 'All' || timeFilter !== 'All') && (
              <button
                onClick={handleReset}
                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => dispatch(setCustomerReportModal(true))}
              className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-white transition-all duration-300 hover:bg-brand-600 active:scale-95 shadow-lg shadow-brand-500/20"
            >
              <MdDownload className="h-5 w-5" />
              <span className="text-sm font-bold">Download Report</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap items-end gap-5 bg-white dark:bg-navy-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 block">Quick Search</label>
            <SearchInput
              placeholder="Search name, email or location..."
              value={searchQuery}
              onChange={(e) => dispatch(setCustomerSearchQuery(e.target.value))}
            />
          </div>

          {/* Time Filter */}
          <div className="min-w-[140px]">
            <CustomSelect
              label="Time period"
              options={timeOptions}
              value={timeFilter}
              onChange={(val) => dispatch(setCustomerTimeFilter(val as string))}
            />
          </div>

          {/* Custom Range */}
          {timeFilter === 'Custom' && (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <CustomDatePicker
                label="From"
                value={customRange.start}
                onChange={(e) => dispatch(setCustomerCustomRange({ ...customRange, start: e.target.value }))}
              />
              <div className="mt-6 text-gray-400 font-bold">to</div>
              <CustomDatePicker
                label="To"
                value={customRange.end}
                onChange={(e) => dispatch(setCustomerCustomRange({ ...customRange, end: e.target.value }))}
              />
            </div>
          )}

          {/* Status Filter */}
          <div className="min-w-[140px]">
            <CustomSelect
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => dispatch(setCustomerStatusFilter(val as string))}
            />
          </div>

          {/* Location Filter */}
          <div className="min-w-[160px]">
            <CustomSelect
              label="Location"
              options={locationOptions}
              value={locationFilter}
              onChange={(val) => dispatch(setCustomerLocationFilter(val as string))}
            />
          </div>

          {/* Rows Per Page */}
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
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">CUSTOMER</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">LOCATION</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">TOTAL SPENT</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">JOBS POSTED</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none">
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <Link href={`/customers/${row.id}`} className="flex items-center gap-2 cursor-pointer group">
                    <div className="h-[35px] w-[35px] rounded-full bg-brand-200 flex items-center justify-center text-brand-500 font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-700 dark:text-white group-hover:text-brand-500 transition-colors uppercase">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.location}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">${row.spent}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white text-center sm:text-left">{row.jobs}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    {row.status === 'Active' ? (
                      <MdCheckCircle className="text-green-500 me-2 h-5 w-5" />
                    ) : (
                      <MdCancel className="text-red-500 me-2 h-5 w-5" />
                    )}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.status}</p>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">No matching customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          Showing <span className="text-navy-700 dark:text-white">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="text-navy-700 dark:text-white">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="text-navy-700 dark:text-white">{filteredData.length}</span> results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(setCustomerCurrentPage(Math.max(1, currentPage - 1)))}
            disabled={currentPage === 1}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <MdChevronLeft className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
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
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${currentPage === totalPages || totalPages === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <MdChevronRight className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm print:absolute print:inset-0 print:bg-white print:p-0 print:z-[200]">
          <style dangerouslySetInnerHTML={{
            __html: `
                        @media print {
                            body * { visibility: hidden !important; }
                            #printable-report, #printable-report * { visibility: visible !important; }
                            #printable-report { 
                                position: absolute !important; 
                                left: 0 !important; 
                                top: 0 !important; 
                                width: 100% !important; 
                                visibility: visible !important;
                                padding: 20px !important;
                            }
                            @page { margin: 0; }
                        }
                    `}} />
          <div className="w-full max-w-4xl bg-white dark:bg-navy-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
            <header className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between print:hidden">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">Report Preview</h3>
              <button onClick={() => dispatch(setCustomerReportModal(false))} className="text-gray-400 hover:text-red-500">
                <MdCancel className="h-6 w-6" />
              </button>
            </header>
            <div className="p-6 overflow-y-auto print:p-0 print:overflow-visible [print-color-adjust:exact] [-webkit-print-color-adjust:exact]" id="printable-report">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-brand-500 uppercase">Customer Report</h2>
                  <p className="text-sm text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">Filters Applied:</p>
                  <p className="text-xs text-gray-500">Time: {timeFilter} | Status: {statusFilter} | Location: {locationFilter}</p>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-navy-900 print:bg-gray-100">
                    <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Customer</th>
                    <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Location</th>
                    <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Total Spent</th>
                    <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Jobs</th>
                    <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="border-b dark:border-white/10 border-gray-100 print:border-gray-200">
                      <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">{row.name}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.location}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">${row.spent}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.jobs}</td>
                      <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 text-center text-xs text-gray-400 print:hidden">
                © {new Date().getFullYear()} Jacob Dashboard. All rights reserved.
              </div>
            </div>
            <footer className="p-6 bg-gray-50 dark:bg-navy-900 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-4 print:hidden">
              <button
                onClick={() => dispatch(setCustomerReportModal(false))}
                className="px-6 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-navy-700 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-navy-700 text-white hover:bg-navy-800 transition-colors"
              >
                Download CSV
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="px-6 py-2 rounded-lg text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
              >
                Download PDF
              </button>
            </footer>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CustomerTable;
