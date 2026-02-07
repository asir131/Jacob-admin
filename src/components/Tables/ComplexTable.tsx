
import React from 'react';
import Card from '../Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';

type RowObj = {
    name: string;
    status: string;
    date: string;
    progress: number;
};

const tableDataComplex: RowObj[] = [
    {
        name: 'Horizon UI PRO',
        status: 'Approved',
        date: '18 Apr 2022',
        progress: 75.5,
    },
    {
        name: 'Horizon UI Free',
        status: 'Disable',
        date: '18 Apr 2022',
        progress: 25.5,
    },
    {
        name: 'Marketplace',
        status: 'Error',
        date: '20 May 2021',
        progress: 90,
    },
    {
        name: 'Weekly Updates',
        status: 'Approved',
        date: '12 Jul 2021',
        progress: 50.5,
    },
];

const ComplexTable = () => {
    return (
        <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
            <div className="relative flex items-center justify-between pt-4 pb-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Complex Table
                </div>
                <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
                    {/* Menu Icon or similar */}
                    ...
                </button>
            </div>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="pr-4 pb-2 text-start font-bold uppercase text-gray-500 text-xs">NAME</th>
                            <th className="pr-4 pb-2 text-start font-bold uppercase text-gray-500 text-xs">STATUS</th>
                            <th className="pr-4 pb-2 text-start font-bold uppercase text-gray-500 text-xs">DATE</th>
                            <th className="pr-4 pb-2 text-start font-bold uppercase text-gray-500 text-xs">PROGRESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableDataComplex.map((row, index) => (
                            <tr key={index}>
                                <td className="pb-4 pt-4 text-sm font-bold text-navy-700 dark:text-white">
                                    {row.name}
                                </td>
                                <td className="pb-4 pt-4 flex items-center gap-2">
                                    {row.status === 'Approved' ? (
                                        <MdCheckCircle className="text-green-500 h-6 w-6" />
                                    ) : row.status === 'Disable' ? (
                                        <MdCancel className="text-red-500 h-6 w-6" />
                                    ) : (
                                        <MdOutlineError className="text-orange-500 h-6 w-6" />
                                    )}
                                    <span className="text-sm font-bold text-navy-700 dark:text-white">{row.status}</span>
                                </td>
                                <td className="pb-4 pt-4 text-sm font-bold text-navy-700 dark:text-white">
                                    {row.date}
                                </td>
                                <td className="pb-4 pt-4">
                                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-700">
                                        <div
                                            className="h-full rounded-full bg-brand-500"
                                            style={{ width: `${row.progress}%` }}
                                        />
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

export default ComplexTable;
