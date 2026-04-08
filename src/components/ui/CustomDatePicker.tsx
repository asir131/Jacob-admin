'use client';
import React, { useRef, useEffect, useId } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import CustomCalendar from './CustomCalendar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDatePickerOpen, setDatePickerViewDate } from '@/store/slices/adminUiSlice';

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (e: { target: { value: string } }) => void;
    label?: string;
    className?: string;
    stateKey?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label, className = "", stateKey }) => {
    const dispatch = useAppDispatch();
    const generatedId = useId();
    const pickerId = stateKey || `date-picker-${generatedId}`;
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;
    const pickerState = useAppSelector((state) => state.adminUi.datePickerById[pickerId]);
    const isOpen = pickerState?.open || false;
    const viewDate = pickerState?.viewDateIso ? new Date(pickerState.viewDateIso) : (selectedDate || new Date());

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                dispatch(setDatePickerOpen({ id: pickerId, open: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch, pickerId]);

    useEffect(() => {
        if (pickerState?.viewDateIso) return;
        dispatch(
            setDatePickerViewDate({
                id: pickerId,
                viewDateIso: value ? new Date(value).toISOString() : new Date().toISOString(),
            })
        );
    }, [dispatch, pickerId, pickerState?.viewDateIso, value]);

    const handleDateSelect = (date: Date) => {
        // Format as YYYY-MM-DD
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        onChange({ target: { value: `${y}-${m}-${d}` } });
        dispatch(setDatePickerViewDate({ id: pickerId, viewDateIso: date.toISOString() }));
        dispatch(setDatePickerOpen({ id: pickerId, open: false }));
    };

    return (
        <div className={`flex flex-col gap-1 relative ${className}`} ref={containerRef}>
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() =>
                        dispatch(
                            setDatePickerOpen({
                                id: pickerId,
                                open: !isOpen,
                                fallbackViewDateIso: value ? new Date(value).toISOString() : new Date().toISOString(),
                            })
                        )
                    }
                    className="flex items-center w-full h-[46px] px-4 rounded-full bg-lightPrimary dark:bg-navy-900 border border-gray-100 dark:border-white/5 text-sm font-medium text-navy-700 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-navy-800 outline-none focus:border-brand-500"
                >
                    <MdCalendarToday className={`h-5 w-5 mr-2 transition-colors ${isOpen ? 'text-brand-500' : 'text-gray-400'}`} />
                    <span>{value || 'Select date'}</span>
                </button>

                {isOpen && (
                    <div className="absolute z-[100] mt-2 left-0 sm:right-0 sm:left-auto animate-in fade-in zoom-in duration-200">
                        <CustomCalendar
                            selectedDate={selectedDate}
                            viewDate={viewDate}
                            onPrevMonth={() =>
                                dispatch(
                                    setDatePickerViewDate({
                                        id: pickerId,
                                        viewDateIso: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1).toISOString(),
                                    })
                                )
                            }
                            onNextMonth={() =>
                                dispatch(
                                    setDatePickerViewDate({
                                        id: pickerId,
                                        viewDateIso: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1).toISOString(),
                                    })
                                )
                            }
                            onDateSelect={handleDateSelect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomDatePicker;
