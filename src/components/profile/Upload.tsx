import React from "react";
import Card from "@/components/Card/Card";
import { MdFileUpload } from "react-icons/md";

const Upload = () => {
    return (
        <Card extra={"h-full w-full p-4 p-[20px]"}>
            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl dark:bg-navy-700 border-2 border-dashed border-gray-200 dark:border-white/10 h-full w-full">
                <div className="rounded-full bg-lightPrimary p-4 dark:bg-navy-600">
                    <MdFileUpload className="h-10 w-10 text-brand-500 dark:text-white" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-navy-700 dark:text-white">
                    Upload Files
                </h4>
                <p className="mt-1 text-center text-sm font-medium text-gray-600">
                    PNG, JPG and GIF files are allowed
                </p>
            </div>

            <div className="mt-auto flex w-full flex-col">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white mt-4">
                    Complete your profile
                </h4>
                <p className="mb-4 text-base font-normal text-gray-600">
                    Stay on the pulse of distributed projects with an online whiteboard to plan, coordinate and discuss
                </p>
                <button className="linear w-full rounded-[20px] bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                    Publish now
                </button>
            </div>
        </Card>
    );
};

export default Upload;
