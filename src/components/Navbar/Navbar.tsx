
import React from 'react';
import { MdNotificationsNone, MdInfoOutline, MdMenu } from 'react-icons/md';
import { SearchIcon } from '../icons/SearchIcon';

const Navbar = (props: { brandText: string, onOpenSidebar: () => void }) => {
    const { brandText, onOpenSidebar } = props;

    return (
        <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
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
                <div className="flex h-full items-center rounded-full bg-[#F4F7FE] text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                        <SearchIcon className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block h-full w-full rounded-full bg-transparent text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    />
                </div>

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
