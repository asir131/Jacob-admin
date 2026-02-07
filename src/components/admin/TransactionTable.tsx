'use client';
import React from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';

type RowObj = {
    id: string;
    provider: string;
    service: string;
    amount: number;
    date: string;
    status: string;
};

const TransactionTable = (props: { tableData: RowObj[] }) => {
    const { tableData } = props;

    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
            <header className="relative flex items-center justify-between pt-4 pb-2">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Latest Transactions
                </div>
                <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 transition duration-200 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
                    <span className="text-sm font-bold">View Report</span>
                </button>
            </header>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">ID</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">PROVIDER</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">SERVICE</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">AMOUNT</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
                            </th>
                            <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">DATE</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td className="min-w-[80px] border-white/0 py-3  pr-4">
                                    <p className="text-sm font-bold text-gray-600 dark:text-white">#{row.id}</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3  pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.provider}</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3  pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.service}</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3  pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">${row.amount.toFixed(2)}</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3  pr-4">
                                    <div className="flex items-center">
                                        {row.status === 'Paid' ? (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-100/10 gap-1">
                                                <MdCheckCircle className="text-green-500 h-4 w-4" />
                                                <p className="text-xs font-bold text-green-500">PAID</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-100/10 gap-1">
                                                <MdOutlineError className="text-amber-500 h-4 w-4" />
                                                <p className="text-xs font-bold text-amber-500">PENDING</p>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3  pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.date}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TransactionTable;
