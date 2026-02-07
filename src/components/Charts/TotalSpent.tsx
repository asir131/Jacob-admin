
'use client';
import React from 'react';
import {
    MdArrowDropUp,
    MdOutlineCalendarToday,
    MdBarChart,
    MdCheckCircle,
} from 'react-icons/md';
import Card from '../Card/Card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const lineChartData = [
    { name: 'SEP', value1: 45, value2: 30 },
    { name: 'OCT', value1: 52, value2: 25 },
    { name: 'NOV', value1: 48, value2: 35 },
    { name: 'DEC', value1: 70, value2: 30 },
    { name: 'JAN', value1: 65, value2: 45 },
    { name: 'FEB', value1: 85, value2: 40 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="relative mb-2">
                <div className="rounded-lg bg-[#2286BE] px-3 py-1.5 shadow-xl">
                    <p className="text-xs font-bold text-white mb-0">${payload[0].value}.00</p>
                </div>
                {/* Tail for speech bubble */}
                <div className="absolute -bottom-1 left-1/2 -ml-1 h-2 w-2 rotate-45 bg-[#2286BE]" />
            </div>
        );
    }
    return null;
};

const TotalSpent = () => {
    return (
        <Card extra="!p-5 text-center h-full">
            <div className="flex justify-between items-start">
                {/* Header Left: Amount & Status */}
                <div className="flex flex-col items-start">
                    <div className="flex items-center rounded-lg bg-[#F4F7FE] px-3 py-2 text-[#A3AED0]">
                        <MdOutlineCalendarToday className="mr-2 h-4 w-4" />
                        <span className="text-xs font-medium">This month</span>
                    </div>

                    <div className="mt-4 flex flex-col items-start px-2">
                        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
                            $12.5K
                        </h2>
                        <div className="flex items-center gap-1">
                            <p className="text-xs font-medium text-gray-400">Platform Revenue</p>
                            <MdArrowDropUp className="h-4 w-4 text-green-500" />
                            <p className="text-xs font-bold text-green-500">+12%</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center px-2">
                        <MdCheckCircle className="h-5 w-5 text-green-500" />
                        <p className="ml-2 text-sm font-bold text-green-500">On track</p>
                    </div>
                </div>

                {/* Header Right: Icon */}
                <div className="flex items-center justify-center rounded-lg bg-[#F4F7FE] p-2 text-brand-500 dark:bg-navy-700">
                    <MdBarChart className="h-6 w-6" />
                </div>
            </div>

            <div className="h-[250px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={lineChartData}
                        margin={{ top: 40, right: 10, left: 0, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis hide={true} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#2286BE', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        {/* Shadow Line 1 */}
                        <Line
                            type="monotone"
                            dataKey="value1"
                            stroke="#2286BE"
                            strokeWidth={4}
                            dot={false}
                            activeDot={{ r: 6, fill: "#2286BE", stroke: "#fff", strokeWidth: 2 }}
                        />
                        {/* Shadow Line 2 */}
                        <Line
                            type="monotone"
                            dataKey="value2"
                            stroke="#6AD2FF"
                            strokeWidth={4}
                            dot={false}
                            activeDot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default TotalSpent;
