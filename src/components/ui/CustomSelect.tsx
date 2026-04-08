'use client';
import React, { useRef, useEffect, useId } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectOpen } from '@/store/slices/adminUiSlice';

interface Option {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    className?: string;
    stateKey?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label, className = "", stateKey }) => {
    const dispatch = useAppDispatch();
    const generatedId = useId();
    const selectId = stateKey || `select-${generatedId}`;
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isOpen = useAppSelector((state) => state.adminUi.selectOpenById[selectId] || false);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                dispatch(setSelectOpen({ id: selectId, open: false }));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch, selectId]);

    return (
        <div className={`flex flex-col gap-1 ${className}`} ref={dropdownRef}>
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => dispatch(setSelectOpen({ id: selectId, open: !isOpen }))}
                    className="flex items-center justify-between w-full h-[46px] px-4 rounded-full bg-lightPrimary dark:bg-navy-900 border border-gray-100 dark:border-white/5 text-sm font-medium text-navy-700 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-navy-800 outline-none"
                >
                    <span className="truncate">{selectedOption?.label}</span>
                    <MdExpandMore className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full min-w-[150px] bg-white dark:bg-navy-800 rounded-2xl shadow-3xl shadow-shadow-500 dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="py-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        dispatch(setSelectOpen({ id: selectId, open: false }));
                                    }}
                                    className={`flex items-center w-full px-4 py-2 text-sm text-start transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${option.value === value ? 'bg-brand-50 text-brand-500 font-bold dark:bg-brand-500/10' : 'text-navy-700 dark:text-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;
