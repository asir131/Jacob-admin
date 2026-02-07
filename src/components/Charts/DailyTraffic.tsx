
'use client';
import React from 'react';
import Card from '../Card/Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { MdArrowDropUp } from 'react-icons/md';

const barChartDataDailyTraffic = [
    { name: '00', visitors: 10 },
    { name: '04', visitors: 20 },
    { name: '08', visitors: 30 },
    { name: '12', visitors: 40 },
    { name: '14', visitors: 50 },
    { name: '16', visitors: 60 },
    { name: '18', visitors: 70 },
];

const DailyTraffic = () => {
    return (
        <Card extra="pb-7 p-[20px]">
            <div className="flex flex-row justify-between">
                <div className="ml-1 pt-2">
                    <p className="text-sm font-medium text-gray-600">Daily Traffic</p>
                    <div className="flex flex-row items-end gap-2">
                        <h4 className="text-3xl font-bold text-navy-700 dark:text-white">
                            2.579
                        </h4>
                        <div className="mb-1 flex items-center">
                            <span className="text-sm font-bold text-gray-600">Visitors</span>
                            <span className="ml-1 flex items-center text-sm font-bold text-green-500">
                                <MdArrowDropUp className="h-5 w-5" />
                                +2.45%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full pt-10 pb-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barChartDataDailyTraffic}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        barSize={15}
                    >
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
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: '12px', fontWeight: '500' }}
                        />
                        <YAxis hide={true} />
                        <Bar dataKey="visitors" fill="#2286BE" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default DailyTraffic;
