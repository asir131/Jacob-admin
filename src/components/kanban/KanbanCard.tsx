import React from "react";
import { MdEdit } from "react-icons/md";
import Card from "@/components/Card/Card";
import Image from "next/image";

interface KanbanCardProps {
    title: string;
    desc?: string;
    status?: string;
    statusColor?: string; // "blue", "orange", "green" for badges
    image?: string;
    members?: string[];
}

const KanbanCard = ({ title, desc, status, statusColor, image, members }: KanbanCardProps) => {
    return (
        <Card extra="flex flex-col w-full p-[20px] h-fit mb-5 shadow-sm hover:shadow-2xl transition-all duration-300 dark:!bg-navy-700">
            <div className="flex justify-between items-start mb-3">
                <h5 className="text-base font-bold text-navy-700 dark:text-white">{title}</h5>
                <div className="cursor-pointer text-gray-400 hover:text-brand-500">
                    <MdEdit className="h-4 w-4" />
                </div>
            </div>

            {image && (
                <div className="w-full mb-3 h-[140px] rounded-2xl overflow-hidden relative">
                    <img src={image} className="w-full h-full object-cover rounded-2xl" alt="" />
                </div>
            )}

            {desc && (
                <p className="text-sm text-gray-600 mb-3 font-medium dark:text-white/60 leading-relaxed">
                    {desc}
                </p>
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex -space-x-3 items-center">
                    {members?.map((m, i) => (
                        <div key={i} className="h-7 w-7 rounded-full border-[2.5px] border-white dark:border-navy-700 bg-gray-300">
                            <img src={m} className="h-full w-full rounded-full object-cover" alt="" />
                        </div>
                    ))}
                    {members && (
                        <div className="h-7 w-7 rounded-full border-[2.5px] border-white dark:border-navy-700 bg-brand-500 flex items-center justify-center text-white text-[9px] font-bold">
                            +
                        </div>
                    )}
                </div>

                {status && (
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${statusColor === 'green' ? 'bg-[#E6F8EF] text-[#05CD99]' :
                            statusColor === 'orange' ? 'bg-[#FFF6E5] text-[#FFB547]' :
                                statusColor === 'blue' ? 'bg-[#E7F2FF] text-[#4318FF]' :
                                    statusColor === 'red' ? 'bg-[#FEEFEE] text-[#EE5D50]' :
                                        'bg-gray-100 text-gray-500'
                        }`}>
                        {status}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default KanbanCard;
