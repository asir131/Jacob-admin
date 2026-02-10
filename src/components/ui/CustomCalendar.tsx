'use client';
import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface CustomCalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onDateSelect, className = "" }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const days = [];
    const totalDays = daysInMonth(year, month);
    const offset = firstDayOfMonth(year, month);

    // Add empty placeholders for the start of the month
    for (let i = 0; i < offset; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Add actual days
    for (let d = 1; d <= totalDays; d++) {
        const date = new Date(year, month, d);
        const isSelected = selectedDate &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();

        const isToday = new Date().toDateString() === date.toDateString();

        days.push(
            <button
                key={d}
                onClick={() => onDateSelect(date)}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${isSelected
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110'
                        : isToday
                            ? 'text-brand-500 border border-brand-500/20 bg-brand-500/5'
                            : 'text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
            >
                {d}
            </button>
        );
    }

    return (
        <div className={`p-4 bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-white/10 shadow-3xl shadow-shadow-500 dark:shadow-none w-[320px] ${className}`}>
            <header className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {monthNames[month]} {year}
                </p>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white transition-colors">
                        <MdChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-white transition-colors">
                        <MdChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </header>
            <div className="grid grid-cols-7 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day} className="h-10 w-10 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {days}
            </div>
        </div>
    );
};

export default CustomCalendar;
