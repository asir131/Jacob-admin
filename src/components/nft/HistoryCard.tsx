import React from "react";
import Card from "@/components/Card/Card";
import { FaEthereum } from "react-icons/fa";
import Image from "next/image";

const HistoryCard = (props: { extra?: string }) => {
    const { extra } = props;
    const HistoryData = [
        {
            image: "/images/nfts/Nft1.png",
            title: "Colorful Heaven",
            owner: "Mark Benjamin",
            price: 0.91,
            time: "30s ago",
        },
        {
            image: "/images/nfts/Nft2.png",
            title: "Abstract Colors",
            owner: "Esthera Jackson",
            price: 0.91,
            time: "58s ago",
        },
        {
            image: "/images/nfts/Nft3.png",
            title: "ETH AI Brain",
            owner: "Nick Wilson",
            price: 0.91,
            time: "1m ago",
        },
        {
            image: "/images/nfts/Nft1.png",
            title: "Swipe Circles",
            owner: "Peter Will",
            price: 0.91,
            time: "1m ago",
        },
        {
            image: "/images/nfts/Nft2.png",
            title: "Mesh Gradients",
            owner: "Will Smith",
            price: 0.91,
            time: "2m ago",
        },
    ];

    return (
        <Card extra={`h-full !z-5 overflow-hidden ${extra}`}>
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-3xl p-3">
                <div className="text-lg font-bold text-navy-700 dark:text-white">
                    History
                </div>
                <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
                    See all
                </button>
            </div>

            {/* History Items */}
            {HistoryData.map((data, index) => (
                <div className="flex h-full w-full items-start justify-between bg-white px-3 py-4 hover:shadow-2xl dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700" key={index}>
                    <div className="flex items-center gap-3">
                        <div className="flex h-[50px] w-[50px] items-center justify-center">
                            <img
                                className="h-full w-full rounded-xl object-cover"
                                src={data.image}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col">
                            <h5 className="text-base font-bold text-navy-700 dark:text-white">
                                {data.title}
                            </h5>
                            <p className="mt-1 text-sm font-normal text-gray-500">
                                By {data.owner}
                            </p>
                        </div>
                    </div>

                    <div className="mt-1 flex flex-col items-end justify-center text-navy-700 dark:text-white">
                        <div className="flex items-center gap-1">
                            <FaEthereum className="text-navy-700 dark:text-white" />
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                                {data.price} ETH
                            </p>
                        </div>
                        <p className="ml-1 mt-1 text-sm font-normal text-gray-500 whitespace-nowrap">
                            {data.time}
                        </p>
                    </div>
                </div>
            ))}
        </Card>
    );
};

export default HistoryCard;
