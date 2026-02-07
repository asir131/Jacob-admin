
import React from 'react';
import Card from '../Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';

type TableRow = {
    name: string[];
    status: string;
    date: string;
    progress: number;
};

const tableData: TableRow[] = [
    {
        name: ['Horizon UI PRO', 'Disabled'],
        status: 'Approved',
        date: '18 Apr 2022',
        progress: 75.5,
    },
    {
        name: ['Horizon UI Free', 'Platform'],
        status: 'Disable',
        date: '18 Apr 2022',
        progress: 25.5,
    },
    {
        name: ['Marketplace', 'Micro'],
        status: 'Error',
        date: '20 May 2021',
        progress: 90,
    },
    {
        name: ['Weekly Updates', 'Store'],
        status: 'Approved',
        date: '12 Jul 2021',
        progress: 50.5,
    },
];

const CheckTable = () => {
    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
            <header className="relative flex items-center justify-between pt-4 pb-2">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Recent Bookings
                </div>
            </header>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="!border-px !border-gray-400">
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs">
                                PROVIDER
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs">
                                STATUS
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs">
                                PRICE
                            </th>
                            <th className="pr-4 pb-4 text-start font-bold uppercase text-gray-500 text-xs">
                                DATE
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s] checked:border-none checked:text-white hover:cursor-pointer hover:border-gray-500 checked:bg-brand-500 dark:border-white/10 dark:checked:bg-brand-400" />
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {row.name[0]}
                                        </p>
                                    </div>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                                            {row.status}
                                        </p>
                                    </div>
                                </td>
                                <td className="min-w-[150px] pb-4 pt-4 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                                        ${row.progress}
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

export default CheckTable;
