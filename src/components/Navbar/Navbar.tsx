
import React from 'react';
import { MdNotificationsNone, MdInfoOutline, MdMenu } from 'react-icons/md';
import { SearchIcon } from '../icons/SearchIcon';
import SearchInput from '../ui/SearchInput';

const Navbar = (props: { brandText: string, onOpenSidebar: () => void }) => {
    const { brandText, onOpenSidebar } = props;

    return (
        <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d] print:hidden">
            <div className="ml-[6px]">
                <div className="h-6 pt-1">
                    <a
                        className="text-xs font-normal text-[#707EAE] hover:underline dark:text-white dark:hover:text-white"
                        href=" "
                    >
                        Pages
                        <span className="mx-1 text-xs text-[#707EAE] hover:text-[#707EAE] dark:text-white">
                            {' '}
                            /{' '}
                        </span>
                    </a>
                    <a
                        className="text-xs font-normal capitalize text-[#707EAE] hover:underline dark:text-white dark:hover:text-white"
                        href="#"
                    >
                        {brandText}
                    </a>
                </div>
                <p className="shrink text-[34px] capitalize text-navy-700 dark:text-white">
                    <a
                        href="#"
                        className="font-bold underline-offset-4 capitalize hover:text-navy-700 dark:hover:text-white"
                    >
                        {brandText}
                    </a>
                </p>
            </div>

            <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
                <SearchInput
                    value={""} // Handle state if necessary, but keep it consistent for now
                    onChange={() => { }}
                    placeholder="Search..."
                    className="xl:w-[225px] !bg-transparent !border-none !shadow-none"
                />

                <span
                    className="flex cursor-pointer text-xl text-gray-600 dark:text-white lg:hidden"
                    onClick={onOpenSidebar}
                >
                    <MdMenu className="h-5 w-5" />
                </span>

                <div className="flex h-full items-center justify-center rounded-lg px-px">
                    <MdNotificationsNone className="h-[18px] w-[18px] text-[#A3AED0]" />
                </div>
                <div className="flex h-full items-center justify-center rounded-lg px-px">
                    <MdInfoOutline className="h-[18px] w-[18px] text-[#A3AED0]" />
                </div>
                <div className="flex h-full items-center justify-center rounded-lg px-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-b from-[#4481EB] to-[#04BEFE]" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
