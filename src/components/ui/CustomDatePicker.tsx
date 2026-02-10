'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import CustomCalendar from './CustomCalendar';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (e: { target: { value: string } }) => void;
    label?: string;
    className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date: Date) => {
        // Format as YYYY-MM-DD
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        onChange({ target: { value: `${y}-${m}-${d}` } });
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-1 relative ${className}`} ref={containerRef}>
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center w-full h-[46px] px-4 rounded-full bg-lightPrimary dark:bg-navy-900 border border-gray-100 dark:border-white/5 text-sm font-medium text-navy-700 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-navy-800 outline-none focus:border-brand-500"
                >
                    <MdCalendarToday className={`h-5 w-5 mr-2 transition-colors ${isOpen ? 'text-brand-500' : 'text-gray-400'}`} />
                    <span>{value || 'Select date'}</span>
                </button>

                {isOpen && (
                    <div className="absolute z-[100] mt-2 left-0 sm:right-0 sm:left-auto animate-in fade-in zoom-in duration-200">
                        <CustomCalendar
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDatePicker;
