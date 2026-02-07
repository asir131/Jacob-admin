
import React from 'react';
import Card from '../Card/Card';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Calendar = () => {
    return (
        <Card extra="flex flex-col w-full h-full p-6">
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                    April 2024
                </h4>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F7FE] text-brand-500 hover:bg-gray-100 cursor-pointer transition-colors active:bg-gray-200">
                        <MdChevronLeft className="h-6 w-6" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F7FE] text-brand-500 hover:bg-gray-100 cursor-pointer transition-colors active:bg-gray-200">
                        <MdChevronRight className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-400 uppercase">{day}</div>
                ))}

                {/* Empty slots for spacing if needed (assuming start on Monday for mock) */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                    <div
                        key={date}
                        className={`group relative flex h-10 w-full items-center justify-center cursor-pointer`}
                    >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all
                            ${date === 18
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                                : 'text-navy-700 hover:bg-gray-50'
                            }`}
                        >
                            {date}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Calendar;
