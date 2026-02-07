'use client';
import React from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import Link from 'next/link';

type RowObj = {
    id?: string;
    name: string;
    status: string;
    date: string;
    category: string;
    rating: number;
};

const ProviderTable = (props: { tableData: RowObj[] }) => {
    const { tableData } = props;

    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
            <header className="relative flex items-center justify-between pt-4 pb-2">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    All Service Providers
                </div>
                <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 transition duration-200 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
                    <span className="text-sm font-bold">See all</span>
                </button>
            </header>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">PROVIDER NAME</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">CATEGORY</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">RATING</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">JOIN DATE</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <Link href={`/providers/${row.id || '1'}`} className="flex items-center gap-2 cursor-pointer group">
                                        <div className="h-[30px] w-[30px] rounded-full bg-brand-200 flex items-center justify-center text-brand-500 font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                            {row.name.charAt(0)}
                                        </div>
                                        <p className="text-sm font-bold text-navy-700 dark:text-white group-hover:text-brand-500 transition-colors">{row.name}</p>
                                    </Link>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.category}</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <div className="flex items-center">
                                        {row.status === 'Approved' ? (
                                            <MdCheckCircle className="text-green-500 me-2 h-5 w-5" />
                                        ) : row.status === 'Disable' ? (
                                            <MdCancel className="text-red-500 me-2 h-5 w-5" />
                                        ) : (
                                            <MdOutlineError className="text-amber-500 me-2 h-5 w-5" />
                                        )}
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">{row.status}</p>
                                    </div>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <div className="flex items-center gap-1">
                                        <span className="text-brand-500 font-bold">★</span>
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">{row.rating}</p>
                                    </div>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white date">{row.date}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ProviderTable;
