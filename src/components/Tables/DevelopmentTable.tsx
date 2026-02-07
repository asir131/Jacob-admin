import React from 'react';
import Card from '../Card/Card';
import { FaApple, FaAndroid, FaWindows } from 'react-icons/fa';

const tableData = [
    {
        name: 'Marketplace',
        tech: ['apple', 'android', 'windows'],
        date: '12.Jan.2021',
        progress: 75.5,
    },
    {
        name: 'Venus DB PRO',
        tech: ['apple'],
        date: '21.Feb.2021',
        progress: 35.4,
    },
    {
        name: 'Venus DS',
        tech: ['apple', 'windows'],
        date: '13.Mar.2021',
        progress: 25,
    },
    {
        name: 'Venus 3D Asset',
        tech: ['android', 'windows'],
        date: '24.Jan.2021',
        progress: 100,
    },
];

const DevelopmentTable = () => {
    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
            <header className="relative flex items-center justify-between pt-4 pb-2">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Development Table
                </div>
            </header>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                NAME
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                TECH
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                DATE
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                PROGRESS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        {row.name}
                                    </p>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-2 text-xl text-gray-600 dark:text-white">
                                        {row.tech.includes('apple') && <FaApple />}
                                        {row.tech.includes('android') && <FaAndroid />}
                                        {row.tech.includes('windows') && <FaWindows />}
                                    </div>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        {row.date}
                                    </p>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {row.progress}%
                                        </p>
                                        <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-700">
                                            <div
                                                className="h-full rounded-full bg-brand-500"
                                                style={{ width: `${row.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default DevelopmentTable;
