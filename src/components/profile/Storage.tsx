import React from "react";
import Card from "@/components/Card/Card";
import { MdOutlineCloudUpload } from "react-icons/md";

const Storage = () => {
    return (
        <Card extra={"w-full h-full p-4"}>
            <div className="ml-auto">
                {/* Settings Icon placeholder or simplified */}
                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">...</div>
            </div>

            <div className="mb-auto flex flex-col items-center justify-center">
                <div className="mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-lightPrimary dark:!bg-navy-700">
                    <MdOutlineCloudUpload className="h-10 w-10 text-brand-500 dark:text-white" />
                </div>
                <h4 className="mt-4 text-2xl font-bold text-navy-700 dark:text-white">
                    Your storage
                </h4>
                <p className="mt-2 text-center px-10 text-base font-normal text-gray-600">
                    Supervise your drive space in the easiest way
                </p>
            </div>

            <div className="w-full mt-5 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-white/60">25.6 Gb</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-white/60">50 Gb</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-navy-700">
                    <div className="h-full w-1/2 rounded-full bg-brand-500" />
                </div>
            </div>
        </Card>
    );
};

export default Storage;
