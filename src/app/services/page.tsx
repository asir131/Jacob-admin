'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import {
    MdPlumbing, MdCleaningServices, MdElectricalServices, MdLocalShipping,
    MdMap, MdStar, MdArrowForward, MdTrendingUp, MdAdd
} from 'react-icons/md';
import { IoIosWater, IoIosConstruct } from 'react-icons/io';

export default function ServicesPage() {
    const serviceCategories = [
        {
            title: 'Plumbing',
            count: '124 Providers',
            icon: <MdPlumbing className="h-10 w-10" />,
            color: 'bg-blue-500',
            bg: 'from-blue-400 to-blue-600',
            popular: 'Pipe Repair, Heater',
            rating: 4.8
        },
        {
            title: 'Cleaning',
            count: '85 Providers',
            icon: <MdCleaningServices className="h-10 w-10" />,
            color: 'bg-green-500',
            bg: 'from-green-400 to-green-600',
            popular: 'Deep Clean, Office',
            rating: 4.9
        },
        {
            title: 'Electrical',
            count: '62 Providers',
            icon: <MdElectricalServices className="h-10 w-10" />,
            color: 'bg-amber-500',
            bg: 'from-amber-400 to-amber-600',
            popular: 'Wiring, Installation',
            rating: 4.7
        },
        {
            title: 'Moving',
            count: '45 Providers',
            icon: <MdLocalShipping className="h-10 w-10" />,
            color: 'bg-indigo-500',
            bg: 'from-indigo-400 to-indigo-600',
            popular: 'Local, Long Distance',
            rating: 4.6
        }
    ];

    const topServices = [
        { name: 'Emergency Pipe Fix', cat: 'Plumbing', price: '$120', trend: '+15%', sold: 842 },
        { name: 'Full House Clean', cat: 'Cleaning', price: '$80', trend: '+8%', sold: 654 },
        { name: 'AC Maintenance', cat: 'HVAC', price: '$150', trend: '-2%', sold: 423 },
        { name: 'Lawn Mowing', cat: 'Gardening', price: '$50', trend: '+24%', sold: 321 },
        { name: 'Furniture Assembly', cat: 'General', price: '$65', trend: '+5%', sold: 210 },
    ];

    return (
        <AdminLayout>
            <div className="mt-5 grid grid-cols-1 gap-5">

                {/* Hero / Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-[20px] bg-gradient-to-r from-brand-500 to-brand-400 p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all"></div>
                        <h4 className="text-lg font-bold opacity-80">Total Services Active</h4>
                        <p className="text-4xl font-bold mt-2">1,240</p>
                        <p className="mt-4 text-sm font-medium bg-white/20 w-fit px-2 py-1 rounded-lg flex items-center gap-1">
                            <MdTrendingUp /> +12% this month
                        </p>
                    </div>
                    <Card extra="p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] text-gray-100 dark:text-white/5">
                            <MdMap className="h-40 w-40" />
                        </div>
                        <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Top Location</h4>
                        <p className="text-2xl font-bold text-navy-700 dark:text-white mt-1">New York, NY</p>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 dark:bg-white/10">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">70% of bookings</p>
                    </Card>
                    <Card extra="p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-brand-500 cursor-pointer transition-colors group">
                        <div className="p-4 rounded-full bg-lightPrimary text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                            <MdAdd className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white mt-3">Add New Service</h4>
                        <p className="text-sm text-gray-400">Expand your marketplace</p>
                    </Card>
                </div>

                {/* Service Categories Grid */}
                <h3 className="text-xl font-bold text-navy-700 dark:text-white mt-4">Browse Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {serviceCategories.map((cat, i) => (
                        <Card key={i} extra={`p-1 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-300`}>
                            <div className={`h-24 w-full rounded-t-xl bg-gradient-to-br ${cat.bg} relative`}>
                                <div className="absolute bottom-[-20px] left-4 p-3 rounded-xl bg-white dark:bg-navy-800 shadow-lg text-brand-500">
                                    {cat.icon}
                                </div>
                            </div>
                            <div className="mt-8 px-4 pb-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">{cat.title}</h4>
                                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                        {cat.rating} <MdStar />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {cat.popular.split(', ').map((tag, j) => (
                                        <span key={j} className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Detailed Services Table */}
                <div className="grid grid-cols-1 gap-5">
                    <Card extra="w-full p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">Top Performing Services</h4>
                            <button className="text-brand-500 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                View All Reports <MdArrowForward />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10">
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Service Name</th>
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Category</th>
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Avg Price</th>
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Growth</th>
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Total Sold</th>
                                        <th className="text-left py-3 text-sm font-bold text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topServices.map((service, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-1 rounded-full bg-brand-500"></div>
                                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{service.name}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                                    {service.cat}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-navy-700 dark:text-white">{service.price}</td>
                                            <td className="py-4">
                                                <span className={`text-sm font-bold ${service.trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                    {service.trend}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-navy-700 dark:text-white">{service.sold}</td>
                                            <td className="py-4">
                                                <button className="text-sm font-medium text-brand-500 hover:text-brand-600">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
