import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import Card from "@/components/Card/Card";
import Image from "next/image";

interface ProjectProps {
    title: string;
    ranking: string | number;
    link: string;
    image: string;
    desc?: string;
}

const Project = (props: ProjectProps) => {
    const { title, ranking, link, image, desc } = props;

    return (
        <Card extra={"w-full p-4 flex flex-row items-center"}>
            <div className="h-[65px] w-[65px] min-w-[65px] rounded-xl mr-4">
                <img
                    src={image}
                    className="h-full w-full rounded-xl object-cover"
                    alt=""
                />
            </div>

            <div className="w-full">
                <p className="text-sm font-medium text-gray-600">
                    Project #{ranking}
                </p>
                <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                    {title}
                </h5>
                {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
                <a href={link} className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    See project details
                </a>
            </div>

            <div className="ml-auto cursor-pointer p-2 text-gray-600 hover:text-brand-500">
                <MdModeEditOutline />
            </div>
        </Card>
    );
};

export default Project;
