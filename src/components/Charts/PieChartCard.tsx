
'use client';
import React from 'react';
import Card from '../Card/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const pieChartData = [
    { name: 'Your files', value: 63 },
    { name: 'System', value: 25 },
    { name: 'Empty', value: 12 },
];

// Reference Image Colors: 
// Darker Blue: #2286BE (or Brand)
// Lighter Blue: #6AD2FF
// Soft Gray/White: #EFF4FB

const COLORS = ['#2286BE', '#6AD2FF', '#EFF4FB'];

const PieChartCard = () => {
    return (
        <Card extra="rounded-[20px] p-4 flex flex-col justify-between items-center h-full">
            <div className="flex flex-row justify-between px-2 pt-2 w-full">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    Your Pie Chart
                </h4>
                <div className="flex items-center gap-1 cursor-pointer">
                    <span className="text-sm font-bold text-gray-400">Monthly</span>
                    <MdOutlineKeyboardArrowDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            <div className="relative flex h-[220px] w-full items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.08)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Box */}
            <div className="flex w-full flex-row justify-center gap-10 rounded-2xl bg-white px-6 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-500" />
                        <p className="text-sm font-medium text-gray-400">Your files</p>
                    </div>
                    <p className="text-2xl font-bold text-navy-700 dark:text-white">63%</p>
                </div>

                <div className="w-px h-12 bg-gray-100 dark:bg-white/10" />

                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
                        <p className="text-sm font-medium text-gray-400">System</p>
                    </div>
                    <p className="text-2xl font-bold text-navy-700 dark:text-white">25%</p>
                </div>
            </div>
        </Card>
    );
};

export default PieChartCard;
