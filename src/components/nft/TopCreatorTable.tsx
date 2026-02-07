import React, { useState, useMemo } from "react";
import Card from "@/components/Card/Card";
import { MdModeEditOutline } from "react-icons/md";

const TopCreatorTable = (props: { extra?: string, tableData: any[] }) => {
    const { extra, tableData } = props;

    return (
        <Card extra={`h-full w-full p-4 ${extra}`}>
            <div className="flex h-fit w-full items-center justify-between rounded-t-2xl px-4 pt-4 shadow-2xl shadow-gray-100 dark:shadow-none">
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                    Top Creators
                </h4>
                <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
                    See all
                </button>
            </div>

            <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
                <div className="mt-4 grid grid-cols-12 gap-4 px-2">
                    <p className="col-span-5 text-xs font-bold text-gray-600 dark:text-white">Name</p>
                    <p className="col-span-3 text-center text-xs font-bold text-gray-600 dark:text-white">Artworks</p>
                    <p className="col-span-4 text-right text-xs font-bold text-gray-600 dark:text-white">Rating</p>
                </div>
                <div className="h-full w-full mt-2">
                    {/* Simple list layout instead of full table for this widget style */}
                    {tableData.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 py-2 items-center">
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0">
                                    <img src={item.image} className="h-full w-full rounded-full object-cover" alt="" />
                                </div>
                                <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</p>
                            </div>

                            <div className="col-span-3 flex justify-center">
                                <p className="text-sm font-medium text-gray-600 dark:text-white">
                                    {item.artworks || 9821}
                                </p>
                            </div>

                            <div className="col-span-4 flex justify-end">
                                <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-navy-700 max-w-[100px]">
                                    <div style={{ width: `${item.rating}%` }} className="h-full bg-brand-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default TopCreatorTable;
