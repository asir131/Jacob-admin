
'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import MiniStatistics from '@/components/Widgets/MiniStatistics';
import IconBox from '@/components/Widgets/IconBox';
import { MdBarChart, MdAttachMoney, MdOutlineShoppingCart, MdFileCopy } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';
import TotalSpent from '@/components/Charts/TotalSpent';
import WeeklyRevenue from '@/components/Charts/WeeklyRevenue';
import CheckTable from '@/components/Tables/CheckTable';
import DailyTraffic from '@/components/Charts/DailyTraffic';
import PieChartCard from '@/components/Charts/PieChartCard';
import ComplexTable from '@/components/Tables/ComplexTable';
import TaskCard from '@/components/Widgets/TaskCard';
import Calendar from '@/components/Widgets/Calendar';

export default function Dashboard() {
  return (
    <AdminLayout>
      {/* Top Section - Mini Stats */}
      <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <MiniStatistics
          icon={<IconBox icon={<MdBarChart className="h-6 w-6" />} className="h-12 w-12 bg-lightPrimary text-brand-DEFAULT dark:bg-navy-700 dark:text-white" />}
          title="Total Revenue"
          value="$120.5K"
        />
        <MiniStatistics
          icon={<IconBox icon={<MdAttachMoney className="h-6 w-6" />} className="h-12 w-12 bg-lightPrimary text-brand-DEFAULT dark:bg-navy-700 dark:text-white" />}
          title="Total Bookings"
          value="845"
        />
        <MiniStatistics
          title="Active Providers"
          value="293"
          growth="+12%"
        />
        <MiniStatistics
          icon={<IconBox icon={<MdOutlineShoppingCart className="h-6 w-6" />} className="h-12 w-12 bg-lightPrimary text-brand-DEFAULT dark:bg-navy-700 dark:text-white" />}
          title="Average Order"
          value="$642"
          endContent={<div className="flex items-center"><span className="text-lg"> </span></div>}
        />
        <MiniStatistics
          icon={<IconBox icon={<FaTasks className="h-6 w-6" />} className="h-12 w-12 bg-brand-DEFAULT text-white" />}
          title="New Users"
          value="1,203"
        />
        <MiniStatistics
          icon={<IconBox icon={<MdFileCopy className="h-6 w-6" />} className="h-12 w-12 bg-lightPrimary text-brand-DEFAULT dark:bg-navy-700 dark:text-white" />}
          title="Completed Services"
          value="782"
        />
      </div>

      {/* Row 2 - Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Row 3 - Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          <CheckTable />
        </div>
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>
      </div>

      {/* Row 4 - Complex Table & Widgets */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ComplexTable />

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <Calendar />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
