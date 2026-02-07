'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import {
    MdAttachMoney, MdReceipt, MdWarning, MdFilterList, MdDownload, MdSearch, MdMoreHoriz
} from 'react-icons/md';

export default function TransactionsPage() {
    const transactions = [
        { id: '#TRX-9871', user: 'Alice Johnson', service: 'Plumbing Fix', amount: '$150.00', date: 'Feb 12, 10:30 AM', status: 'Completed', method: 'Visa •••• 4242' },
        { id: '#TRX-9872', user: 'Mark Smith', service: 'Lawn Mowing', amount: '$85.00', date: 'Feb 12, 09:15 AM', status: 'Pending', method: 'MasterCard •••• 5567' },
        { id: '#TRX-9873', user: 'Sarah Connor', service: 'House Cleaning', amount: '$120.00', date: 'Feb 11, 04:45 PM', status: 'Completed', method: 'PayPal' },
        { id: '#TRX-9874', user: 'John Doe', service: 'Wiring Repair', amount: '$450.00', date: 'Feb 11, 02:20 PM', status: 'Failed', method: 'Visa •••• 1122' },
        { id: '#TRX-9875', user: 'Emily Davis', service: 'Painting', amount: '$300.00', date: 'Feb 10, 11:00 AM', status: 'Completed', method: 'Visa •••• 9988' },
        { id: '#TRX-9876', user: 'Michael Brown', service: 'Deep Clean', amount: '$200.00', date: 'Feb 09, 05:30 PM', status: 'Refunded', method: 'Amex •••• 3344' },
    ];

    return (
        <AdminLayout>
            <div className="mt-5 grid grid-cols-1 gap-5">

                {/* Financial Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card extra="p-5 flex flex-col justify-between h-[140px] bg-navy-800 text-white dark:bg-brand-900 border-none bg-gradient-to-br from-navy-800 to-navy-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Revenue</p>
                                <h4 className="text-3xl font-bold mt-1 text-white">$124,500.00</h4>
                            </div>
                            <div className="p-3 rounded-full bg-white/10 text-white">
                                <MdAttachMoney className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-500 text-white">+12.5%</span>
                            <span className="text-xs text-gray-300">from last month</span>
                        </div>
                    </Card>

                    <Card extra="p-5 flex flex-col justify-between h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending Payouts</p>
                                <h4 className="text-3xl font-bold mt-1 text-navy-700 dark:text-white">$4,250.00</h4>
                            </div>
                            <div className="p-3 rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/20">
                                <MdReceipt className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full dark:bg-white/10 mt-2">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">45 providers waiting</p>
                    </Card>

                    <Card extra="p-5 flex flex-col justify-between h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Active Disputes</p>
                                <h4 className="text-3xl font-bold mt-1 text-navy-700 dark:text-white">12</h4>
                            </div>
                            <div className="p-3 rounded-full bg-red-50 text-red-500 dark:bg-red-500/20">
                                <MdWarning className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-red-500 font-bold">Action Required</span>
                            <span className="text-xs text-gray-400">3 high priority</span>
                        </div>
                    </Card>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm">
                    <div className="relative flex items-center w-full md:w-auto">
                        <MdSearch className="absolute left-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by ID, User, or Amount..."
                            className="pl-10 pr-4 py-2 w-full md:w-[300px] rounded-full bg-gray-50 dark:bg-navy-900 text-navy-700 dark:text-white text-sm outline-none focus:ring-2 ring-brand-500"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-navy-900 text-gray-600 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-gray-100">
                            <MdFilterList /> Status: All
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-navy-900 text-gray-600 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:bg-gray-100">
                            Date Range
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-white text-sm font-bold whitespace-nowrap hover:bg-brand-600 shadow-lg shadow-brand-500/30">
                            <MdDownload /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Detailed Transactions Table */}
                <Card extra="w-full p-6 h-full">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">Recent Transactions</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/10">
                                    <th className="text-left py-3 pl-2 text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">User & Service</th>
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Payment</th>
                                    <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="text-right py-3 pr-2 text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((trx, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-2">
                                            <span className="font-bold text-brand-500 text-sm">{trx.id}</span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-navy-700">
                                                    {trx.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{trx.user}</p>
                                                    <p className="text-xs text-gray-400">{trx.service}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{trx.date}</td>
                                        <td className="py-4 text-sm font-bold text-navy-700 dark:text-white">{trx.amount}</td>
                                        <td className="py-4 text-sm text-gray-500">{trx.method}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${trx.status === 'Completed' ? 'bg-green-100 text-green-500 dark:bg-green-500/20' :
                                                    trx.status === 'Pending' ? 'bg-orange-100 text-orange-500 dark:bg-orange-500/20' :
                                                        trx.status === 'Refunded' ? 'bg-purple-100 text-purple-500 dark:bg-purple-500/20' :
                                                            'bg-red-100 text-red-500 dark:bg-red-500/20'
                                                }`}>
                                                {trx.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <button className="text-gray-500 hover:text-navy-700 dark:hover:text-white transition-colors">
                                                <MdMoreHoriz className="h-6 w-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-500">Showing 6 of 128 transactions</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Previous</button>
                            <button className="px-3 py-1 rounded-lg bg-brand-500 text-sm font-medium text-white hover:bg-brand-600">Next</button>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
