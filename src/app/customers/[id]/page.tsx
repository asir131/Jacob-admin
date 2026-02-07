'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import {
    MdVerified, MdEmail, MdPhone, MdLocationOn, MdHistory,
    MdCreditCard, MdSecurity, MdNotifications, MdEditNote
} from 'react-icons/md';

export default function CustomerDetail({ params }: { params: { id: string } }) {
    return (
        <AdminLayout>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* Left Sidebar: 4 Cols */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
                    <Card extra="w-full h-full p-4 flex flex-col items-center">
                        <div className="h-[120px] w-[120px] rounded-full bg-brand-500 flex items-center justify-center text-4xl text-white font-bold my-4 shadow-lg">
                            AJ
                        </div>
                        <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Alice Johnson</h2>
                        <p className="text-sm text-gray-400">Homeowner • Premium Member</p>

                        <div className="mt-6 flex gap-4 w-full justify-center text-center">
                            <div className="flex flex-col items-center p-2">
                                <span className="text-xl font-bold text-navy-700 dark:text-white">12</span>
                                <span className="text-xs text-gray-400">Jobs</span>
                            </div>
                            <div className="flex flex-col items-center p-2 border-l border-r border-gray-100">
                                <span className="text-xl font-bold text-brand-500">$3.4k</span>
                                <span className="text-xs text-gray-400">Spent</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                                <span className="text-xl font-bold text-navy-700 dark:text-white">5.0</span>
                                <span className="text-xs text-gray-400">Rating</span>
                            </div>
                        </div>

                        <div className="mt-8 w-full flex flex-col gap-4 px-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-lightPrimary text-brand-500">
                                    <MdEmail />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-400 uppercase">Email</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white truncate">alice@example.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-lightPrimary text-brand-500">
                                    <MdPhone />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Phone</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-lightPrimary text-brand-500">
                                    <MdLocationOn />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Primary Address</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">123 Main St, New York, NY</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 w-full">
                            <h5 className="text-navy-700 dark:text-white font-bold ml-1 mb-2">Internal Notes</h5>
                            <textarea className="w-full p-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-sm border-none focus:ring-2 ring-brand-500 outline-none" rows={4} defaultValue="Customer prefers email communication. Often requests weekend appointments." />
                            <button className="flex items-center gap-2 mt-2 text-brand-500 text-sm font-medium hover:text-brand-600">
                                <MdEditNote className="w-5 h-5" /> Save Note
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Content: 8 Cols */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-5">
                    {/* Account Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Payment Methods */}
                        <Card extra="w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">Saved Cards</h4>
                                <MdCreditCard className="text-gray-400 w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-navy-700 rounded-md"></div>
                                        <span className="font-bold text-navy-700 dark:text-white">•••• 4242</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-500">PRIMARY</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-red-500 rounded-md"></div>
                                        <span className="font-bold text-navy-700 dark:text-white">•••• 5567</span>
                                    </div>
                                    <span className="text-xs text-gray-400">Exp 12/26</span>
                                </div>
                            </div>
                        </Card>

                        {/* Saved Addresses */}
                        <Card extra="w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">Locations</h4>
                                <MdLocationOn className="text-gray-400 w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-navy-700 dark:text-white font-medium">Home</span>
                                    <span className="text-sm text-gray-500">123 Main St, NY</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-navy-700 dark:text-white font-medium">Office</span>
                                    <span className="text-sm text-gray-500">45 Broad St, NY</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-navy-700 dark:text-white font-medium">Mom's House</span>
                                    <span className="text-sm text-gray-500">88 Queens Blvd, NY</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Booking History Table */}
                    <Card extra="w-full p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Booking History</h4>
                            <button className="text-brand-500 font-bold text-sm">Download CSV</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10">
                                        <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Service</th>
                                        <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Provider</th>
                                        <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { service: 'Plumbing Repair', provider: 'Quick Fix', date: 'Feb 12, 2024', amount: '$150.00', status: 'Completed' },
                                        { service: 'Lawn Mowing', provider: 'Green Garden', date: 'Jan 20, 2024', amount: '$85.00', status: 'Completed' },
                                        { service: 'House Cleaning', provider: 'Clean Home', date: 'Dec 15, 2023', amount: '$120.00', status: 'Completed' },
                                        { service: 'Wiring Fix', provider: 'Electric Master', date: 'Nov 02, 2023', amount: '$450.00', status: 'Cancelled' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{row.service}</td>
                                            <td className="py-3 text-sm text-gray-600">{row.provider}</td>
                                            <td className="py-3 text-sm text-gray-600">{row.date}</td>
                                            <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{row.amount}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Completed' ? 'bg-green-100 text-green-500' :
                                                        row.status === 'Cancelled' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'
                                                    }`}>
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Security Logs */}
                    <Card extra="w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <MdSecurity className="text-navy-700 dark:text-white w-5 h-5" />
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white">Security & Login Activity</h4>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-navy-800 rounded-lg">
                                <span className="text-sm text-gray-600">Login from iPhone 13 (New York)</span>
                                <span className="text-xs text-gray-400">2 mins ago</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-navy-800 rounded-lg">
                                <span className="text-sm text-gray-600">Password Changed</span>
                                <span className="text-xs text-gray-400">3 months ago</span>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </AdminLayout>
    );
}
