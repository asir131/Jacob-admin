'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import {
    MdAttachMoney, MdReceipt, MdWarning
} from 'react-icons/md';
import TransactionTable from '@/components/admin/TransactionTable';

const users = ['Alice Johnson', 'Michael Smith', 'Sarah Connor', 'John Doe', 'Emily Davis', 'Michael Brown', 'Chris Evans', 'Jessica Alba'];
const services = ['Plumbing Fix', 'Lawn Mowing', 'House Cleaning', 'Wiring Repair', 'Painting', 'Deep Clean', 'AC Repair', 'Furniture Assembly'];
const statuses = ['Completed', 'Pending', 'Failed', 'Refunded'];
const methods = ['Visa •••• 4242', 'MasterCard •••• 5567', 'PayPal', 'Amex •••• 3344', 'Apple Pay', 'Google Pay'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const tableDataTransactions = Array.from({ length: 50 }, (_, i) => {
    const date = new Date(2024, Math.floor(i / 5), (i % 28) + 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Deterministic values based on index
    const amountValue = (50 + (i * 77) % 950);

    return {
        id: `TRX-${9000 + i}`,
        user: users[i % users.length],
        service: services[i % services.length],
        amount: amountValue.toFixed(2),
        date: `${day} ${month} ${year}`,
        timestamp: date.getTime(),
        status: statuses[i % statuses.length],
        method: methods[i % methods.length],
    };
});

export default function TransactionsPage() {
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

                {/* Detailed Transactions Table */}
                <TransactionTable tableData={tableDataTransactions} />
            </div>
        </AdminLayout>
    );
}
