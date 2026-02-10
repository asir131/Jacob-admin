'use client';
import React from 'react';
import { MdSearch } from 'react-icons/md';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Search...", className = "" }) => {
    return (
        <div className={`relative flex items-center h-[46px] min-w-[200px] rounded-full bg-lightPrimary dark:bg-navy-900 border border-gray-100 dark:border-white/5 px-4 transition-all focus-within:border-brand-500 focus-within:shadow-2xl focus-within:shadow-brand-500/10 ${className}`}>
            <MdSearch className="h-5 w-5 text-gray-400 dark:text-white" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="ml-2 w-full bg-transparent text-sm font-medium text-navy-700 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
        </div>
    );
};

export default SearchInput;
