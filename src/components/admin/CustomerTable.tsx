'use client';
import React from 'react';
import Card from '@/components/Card/Card';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import Link from 'next/link';

type RowObj = {
  id: string;
  name: string;
  email: string;
  location: string;
  spent: string;
  jobs: number;
  status: string;
};

const CustomerTable = (props: { tableData: RowObj[] }) => {
  const { tableData } = props;

  return (
    <Card extra={'w-full h-full sm:overflow-auto px-6 py-4'}>
      <header className="relative flex items-center justify-between pt-4 pb-2">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Verified Homeowners
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
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">CUSTOMER</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">LOCATION</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">TOTAL SPENT</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">JOBS POSTED</p>
              </th>
              <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-200">STATUS</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <Link href={`/customers/${row.id}`} className="flex items-center gap-2 cursor-pointer group">
                    <div className="h-[35px] w-[35px] rounded-full bg-brand-200 flex items-center justify-center text-brand-500 font-bold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-700 dark:text-white group-hover:text-brand-500 transition-colors">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.location}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">${row.spent}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">{row.jobs}</p>
                </td>
                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                  <div className="flex items-center">
                    {row.status === 'Active' ? (
                      <MdCheckCircle className="text-green-500 me-2 h-5 w-5" />
                    ) : (
                      <MdCancel className="text-red-500 me-2 h-5 w-5" />
                    )}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.status}</p>
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

export default CustomerTable;
