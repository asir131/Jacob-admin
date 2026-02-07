'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import {
    MdVerified, MdStar, MdLocationOn, MdAccessTime, MdPhone, MdEmail,
    MdAttachMoney, MdDescription, MdWork, MdWarning, MdImage, MdInsertDriveFile
} from 'react-icons/md';

export default function ProviderDetail({ params }: { params: { id: string } }) {
    return (
        <AdminLayout>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* Left Sidebar: Profile & Actions - 4 Cols */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
                    <Card extra="w-full p-4 flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                            <div className="h-[120px] w-[120px] rounded-full bg-brand-500 flex items-center justify-center text-4xl text-white font-bold shadow-xl">
                                QP
                            </div>
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md">
                                <MdVerified className="text-blue-500 w-8 h-8" />
                            </div>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">Quick Fix Plumbers</h2>
                        <p className="text-sm text-gray-400 font-medium">Verified since 2021</p>

                        <div className="mt-6 flex gap-4 w-full justify-center border-t border-gray-100 dark:border-white/10 pt-6">
                            <div className="flex flex-col items-center px-4 border-r border-gray-100 dark:border-white/10">
                                <span className="text-2xl font-bold text-navy-700 dark:text-white">4.8</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Rating</span>
                            </div>
                            <div className="flex flex-col items-center px-4">
                                <span className="text-2xl font-bold text-navy-700 dark:text-white">1.2k</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Jobs</span>
                            </div>
                        </div>

                        <div className="mt-6 w-full flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors">
                                <div className="p-2 rounded-full bg-white shadow-sm text-brand-500">
                                    <MdLocationOn className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Service Area</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">New York (10001 - 10045)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors">
                                <div className="p-2 rounded-full bg-white shadow-sm text-brand-500">
                                    <MdPhone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Phone</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">+1 (212) 555-0123</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors">
                                <div className="p-2 rounded-full bg-white shadow-sm text-brand-500">
                                    <MdEmail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Email</p>
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">contact@quickfix.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 w-full flex flex-col gap-3">
                            <h5 className="text-navy-700 dark:text-white font-bold ml-1">Admin Actions</h5>
                            <div className="flex gap-2">
                                <button className="flex-1 rounded-xl bg-green-500 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-green-600 active:bg-green-700 transform active:scale-95">
                                    Approve
                                </button>
                                <button className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:bg-red-600 active:bg-red-700 transform active:scale-95">
                                    Suspend
                                </button>
                            </div>
                            <button className="w-full rounded-xl bg-lightPrimary py-3 text-sm font-bold text-brand-500 transition duration-200 hover:bg-gray-100">
                                Reset Password
                            </button>
                        </div>
                    </Card>

                    {/* Verification Status */}
                    <Card extra="w-full p-4">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-3">Verification</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <MdCheckCircle className="text-green-500" />
                                    <span className="text-sm text-gray-600">Identity Check</span>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-md">PASSED</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <MdCheckCircle className="text-green-500" />
                                    <span className="text-sm text-gray-600">Background Check</span>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-md">PASSED</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <MdCheckCircle className="text-green-500" />
                                    <span className="text-sm text-gray-600">Insurance Valid</span>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded-md">ACTIVE</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Content: Details, Docs, Stats - 8 Cols */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-5">

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Card extra="p-4 flex flex-col gap-1 items-start justify-center">
                            <div className="p-3 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/20">
                                <MdAttachMoney className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Total Earnings</p>
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">$48,250.00</h4>
                        </Card>
                        <Card extra="p-4 flex flex-col gap-1 items-start justify-center">
                            <div className="p-3 rounded-full bg-green-50 text-green-500 dark:bg-green-500/20">
                                <MdWork className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Completed Jobs</p>
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">1,245</h4>
                        </Card>
                        <Card extra="p-4 flex flex-col gap-1 items-start justify-center">
                            <div className="p-3 rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/20">
                                <MdWarning className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Disputes (All Time)</p>
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">3</h4>
                        </Card>
                    </div>

                    {/* Documents Section */}
                    <Card extra="w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Legal Documents</h4>
                            <button className="text-brand-500 font-bold text-sm">Download All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer bg-gray-50 dark:bg-white/5">
                                <MdInsertDriveFile className="w-10 h-10 text-red-500 mb-2" />
                                <span className="font-bold text-navy-700 dark:text-white text-sm">Business License.pdf</span>
                                <span className="text-xs text-gray-400">Uploaded Jan 12, 2024</span>
                            </div>
                            <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer bg-gray-50 dark:bg-white/5">
                                <MdInsertDriveFile className="w-10 h-10 text-blue-500 mb-2" />
                                <span className="font-bold text-navy-700 dark:text-white text-sm">Insurance Policy.pdf</span>
                                <span className="text-xs text-gray-400">Expires Dec 2024</span>
                            </div>
                            <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer bg-gray-50 dark:bg-white/5">
                                <MdImage className="w-10 h-10 text-green-500 mb-2" />
                                <span className="font-bold text-navy-700 dark:text-white text-sm">ID_Passport.jpg</span>
                                <span className="text-xs text-gray-400">Verified</span>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Services Offered */}
                        <Card extra="w-full p-6">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">Services Price List</h4>
                            <div className="flex flex-col gap-3">
                                {['Pipe Leak Repair ($80)', 'Toilet Installation ($200)', 'Drain Cleaning ($100)', 'Heater Maintenance ($150)'].map((service, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-2 last:border-0">
                                        <span className="text-navy-700 dark:text-white font-medium">{service.split('(')[0]}</span>
                                        <span className="text-brand-500 font-bold">{service.split('(')[1].replace(')', '')}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Portfolio / Recent Work */}
                        <Card extra="w-full p-6">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">Portfolio</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-navy-700 animate-pulse relative overflow-hidden group">
                                        {/* Placeholder for images */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:bg-black/20 transition-all">
                                            <MdImage className="w-6 h-6" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Reviews */}
                    <Card extra="w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Customer Reviews</h4>
                            <span className="text-gray-400 text-sm">Showing recent 3 of 845</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { name: 'Alice Johnson', rating: 5, text: 'Clean job, arrived on time.', date: '2 days ago' },
                                { name: 'Mark Smith', rating: 4, text: 'Good work but price was higher than estimate.', date: '1 week ago' },
                                { name: 'Sarah Connor', rating: 5, text: 'Saved my basement from flooding! Hero.', date: '2 weeks ago' }
                            ].map((review, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-navy-800">
                                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-500 flex items-center justify-center font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex justify-between w-full min-w-[200px]">
                                            <p className="font-bold text-navy-700 dark:text-white">{review.name}</p>
                                            <p className="text-xs text-gray-400">{review.date}</p>
                                        </div>
                                        <div className="flex text-amber-500 text-sm my-1">
                                            {Array(review.rating).fill('★').join('')}
                                            {Array(5 - review.rating).fill('☆').join('')}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{review.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </AdminLayout>
    );
}

// Helper icons needed import
import { MdCheckCircle } from 'react-icons/md';
