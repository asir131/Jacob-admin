'use client';
import React, { useState, useMemo } from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError, MdDownload, MdChevronLeft, MdChevronRight, MdMoreHoriz } from 'react-icons/md';
import { downloadCSV } from '@/utils/exportUtils';
import SearchInput from '@/components/ui/SearchInput';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

type RowObj = {
    id: string;
    user: string;
    service: string;
    amount: string;
    date: string;
    timestamp: number;
    status: string;
    method: string;
};

const TransactionTable = (props: { tableData: RowObj[] }) => {
    const { tableData } = props;

    // State for filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [methodFilter, setMethodFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('All');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for Report Modal
    const [showReportModal, setShowReportModal] = useState(false);

    // Filter Options
    const statuses = ['All', 'Completed', 'Pending', 'Failed', 'Refunded'];
    const methods = ['All', ...new Set(tableData.map(r => r.method.split(' ')[0]))]; // Show primary method name

    // Filter Logic
    const filteredData = useMemo(() => {
        return tableData.filter(row => {
            const matchesSearch = row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.service.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
            const matchesMethod = methodFilter === 'All' || row.method.includes(methodFilter);

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

            return matchesSearch && matchesStatus && matchesMethod && matchesTime;
        });
    }, [tableData, searchQuery, statusFilter, methodFilter, timeFilter, customRange]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    const handleDownload = (format: 'pdf' | 'csv') => {
        if (format === 'csv') {
            downloadCSV(filteredData, 'transactions_report.csv');
        } else {
            window.print();
        }
        setShowReportModal(false);
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('All');
        setMethodFilter('All');
        setTimeFilter('All');
        setCustomRange({ start: '', end: '' });
        setCurrentPage(1);
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
    const methodOptions = methods.map(m => ({ label: m, value: m }));
    const rowsOptions = [10, 20, 50, 100].map(n => ({ label: `${n} Rows`, value: n }));

    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4 transition-all'}>
            <header className="relative flex flex-col gap-6 pt-4 pb-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-2xl font-bold text-navy-700 dark:text-white">
                        Recent Transactions
                    </div>
                    <div className="flex items-center gap-3">
                        {(searchQuery || statusFilter !== 'All' || methodFilter !== 'All' || timeFilter !== 'All') && (
                            <button
                                onClick={handleReset}
                                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                Reset Filters
                            </button>
                        )}
                        <button
                            onClick={() => setShowReportModal(true)}
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
                            placeholder="Search ID, User, or Service..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Time Filter */}
                    <div className="min-w-[140px]">
                        <CustomSelect
                            label="Time period"
                            options={timeOptions}
                            value={timeFilter}
                            onChange={(val) => { setTimeFilter(val as string); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Custom Range */}
                    {timeFilter === 'Custom' && (
                        <div className="flex items-center gap-3 animate-in fade-in duration-300">
                            <CustomDatePicker
                                label="From"
                                value={customRange.start}
                                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                            />
                            <div className="mt-6 text-gray-400 font-bold">to</div>
                            <CustomDatePicker
                                label="To"
                                value={customRange.end}
                                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Status Filter */}
                    <div className="min-w-[140px]">
                        <CustomSelect
                            label="Status"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(val) => { setStatusFilter(val as string); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Method Filter */}
                    <div className="min-w-[140px]">
                        <CustomSelect
                            label="Method"
                            options={methodOptions}
                            value={methodFilter}
                            onChange={(val) => { setMethodFilter(val as string); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Rows Per Page */}
                    <div className="min-w-[120px]">
                        <CustomSelect
                            label="Rows"
                            options={rowsOptions}
                            value={rowsPerPage}
                            onChange={(val) => { setRowsPerPage(Number(val)); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </header>

            <div className="mt-4 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">Transaction ID</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">User & Service</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">Date</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">Amount</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">Payment</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200 uppercase">Status</p>
                            </th>
                            <th className="text-right py-4 pr-2 text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none">
                                <td className="py-4 pr-4">
                                    <span className="font-bold text-brand-500 text-sm">#{row.id}</span>
                                </td>
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-500">
                                            {row.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-navy-700 dark:text-white">{row.user}</p>
                                            <p className="text-xs text-gray-400">{row.service}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 pr-4 text-sm text-gray-600 dark:text-gray-300">{row.date}</td>
                                <td className="py-4 pr-4 text-sm font-bold text-navy-700 dark:text-white">${row.amount}</td>
                                <td className="py-4 pr-4 text-sm text-gray-500">{row.method}</td>
                                <td className="py-4 pr-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.status === 'Completed' ? 'bg-green-100 text-green-500 dark:bg-green-500/20' :
                                        row.status === 'Pending' ? 'bg-orange-100 text-orange-500 dark:bg-orange-500/20' :
                                            row.status === 'Refunded' ? 'bg-purple-100 text-purple-500 dark:bg-purple-500/20' :
                                                'bg-red-100 text-red-500 dark:bg-red-500/20'
                                        }`}>
                                        {row.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-4 pr-2 text-right">
                                    <button className="text-gray-500 hover:text-navy-700 dark:hover:text-white transition-colors">
                                        <MdMoreHoriz className="h-6 w-6" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-gray-500">No matching transactions found.</td>
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
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <MdChevronLeft className="h-5 w-5 text-gray-600 dark:text-white" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
                        <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                            <button
                                onClick={() => setCurrentPage(p)}
                                className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'}`}
                            >
                                {p}
                            </button>
                        </React.Fragment>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-red-500">
                                <MdCancel className="h-6 w-6" />
                            </button>
                        </header>
                        <div className="p-6 overflow-y-auto print:p-0 print:overflow-visible [print-color-adjust:exact] [-webkit-print-color-adjust:exact]" id="printable-report">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-500 uppercase">Transaction Report</h2>
                                    <p className="text-sm text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">Filters Applied:</p>
                                    <p className="text-xs text-gray-500">Time: {timeFilter} | Status: {statusFilter} | Method: {methodFilter}</p>
                                </div>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-navy-900 print:bg-gray-100">
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">ID</th>
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">User</th>
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Service</th>
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Amount</th>
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Status</th>
                                        <th className="p-3 text-xs font-bold text-gray-400 uppercase border-b dark:border-white/10">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr key={idx} className="border-b dark:border-white/10 border-gray-100 print:border-gray-200">
                                            <td className="p-3 text-sm font-bold text-brand-500">#{row.id}</td>
                                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.user}</td>
                                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.service}</td>
                                            <td className="p-3 text-sm font-bold text-navy-700 dark:text-white">${row.amount}</td>
                                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.status}</td>
                                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{row.date}</td>
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
                                onClick={() => setShowReportModal(false)}
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

export default TransactionTable;
