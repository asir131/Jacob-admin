import React from 'react';
import Card from '../Card/Card';

const tableData = [
    {
        name: 'Marketplace',
        quantity: 2458,
        date: '12.Jan.2021',
        progress: 75.5,
    },
    {
        name: 'Venus DB PRO',
        quantity: 1485,
        date: '21.Feb.2021',
        progress: 35.4,
    },
    {
        name: 'Venus DS',
        quantity: 1024,
        date: '13.Mar.2021',
        progress: 25,
    },
    {
        name: 'Venus 3D Asset',
        quantity: 858,
        date: '24.Jan.2021',
        progress: 100,
    },
];

const ColumnsTable = () => {
    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
            <header className="relative flex items-center justify-between pt-4 pb-2">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Columns Table
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
                                PROGRESS
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                QUANTITY
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs text-[#A3AED0]">
                                DATE
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
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        {row.progress}%
                                    </p>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        {row.quantity}
                                    </p>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        {row.date}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ColumnsTable;
