
'use client';
import React from 'react';
import Card from '../Card/Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { MdBarChart } from 'react-icons/md';

const barChartData = [
    { name: '17', product: 30, revenue: 20, investment: 10 },
    { name: '18', product: 40, revenue: 25, investment: 15 },
    { name: '19', product: 50, revenue: 30, investment: 20 },
    { name: '20', product: 60, revenue: 35, investment: 25 },
    { name: '21', product: 70, revenue: 40, investment: 22 },
    { name: '22', product: 50, revenue: 30, investment: 15 },
    { name: '23', product: 60, revenue: 35, investment: 20 },
    { name: '24', product: 70, revenue: 45, investment: 25 },
    { name: '25', product: 80, revenue: 50, investment: 30 },
];

const WeeklyRevenue = () => {
    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center h-full">
            <div className="mb-auto flex items-center justify-between px-4">
                <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                    Weekly Revenue
                </h2>
                <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
                    <MdBarChart className="h-6 w-6" />
                </button>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[250px] w-full xl:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barChartData}
                            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                            barGap={8}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                style={{ fontSize: '12px', fontWeight: '500', fill: '#A3AED0' }}
                                tick={{ fill: '#A3AED0' }}
                                dy={10}
                            />
                            <YAxis hide={true} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.08)',
                                    color: '#2B3674'
                                }}
                                itemStyle={{ color: '#2B3674', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="product" fill="#6AD2FF" radius={[10, 10, 0, 0]} barSize={15} />
                            <Bar dataKey="revenue" fill="#2286BE" radius={[10, 10, 0, 0]} barSize={15} />
                            <Bar dataKey="investment" fill="#EFF4FB" radius={[10, 10, 0, 0]} barSize={15} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default WeeklyRevenue;
