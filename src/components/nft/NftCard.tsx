import React, { useMemo } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import Card from "@/components/Card"; // Assuming a Card component exists, check import path
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setNftLiked } from "@/store/slices/adminUiSlice";

interface NftCardProps {
    title: string;
    author: string;
    price: string | number;
    image: string;
    bidders?: string[];
    extra?: string;
    cardId?: string;
}

const NftCard = ({ title, author, price, image, bidders, extra, cardId }: NftCardProps) => {
    const dispatch = useAppDispatch();
    const resolvedCardId = useMemo(() => cardId || `${title}-${author}-${image}`, [author, cardId, image, title]);
    const heart = useAppSelector((state) => state.adminUi.nftLikedById[resolvedCardId] ?? true);

    return (
        <Card extra={`flex flex-col w-full h-full !p-3 3xl:p-![18px] bg-white dark:bg-navy-800 ${extra}`}>
            <div className="h-full w-full">
                <div className="relative w-full">
                    <div className="mb-3 h-[120px] w-full rounded-2xl 3xl:h-full">
                        <img
                            src={image}
                            className="mb-3 h-full w-full rounded-2xl object-cover"
                            alt={title}
                        />
                    </div>
                    <button
                        onClick={() => dispatch(setNftLiked({ id: resolvedCardId, liked: !heart }))}
                        className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer shadow-sm transition-all hover:shadow-lg"
                    >
                        <div className="flex h-full w-full items-center justify-center rounded-full text-xl">
                            {heart ? (
                                <IoHeart className="text-brand-500" />
                            ) : (
                                <IoHeartOutline className="text-brand-500" />
                            )}
                        </div>
                    </button>
                </div>

                <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div className="mb-2">
                        <p className="text-lg font-bold text-navy-700 dark:text-white">
                            {title}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                            By {author}
                        </p>
                    </div>

                    <div className="flex flex-row-reverse md:mt-2 lg:mt-0">
                        {/* Bidders Avatars */}
                        <span className="z-0 ml-px inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E0E5F2] text-xs text-navy-700 dark:!border-navy-800 dark:bg-gray-800 dark:text-white">
                            +20
                        </span>
                        {bidders?.map((avt, key) => (
                            <span key={key} className="z-10 -mr-3 h-8 w-8 rounded-full border-2 border-white dark:!border-navy-800">
                                <img className="h-full w-full rounded-full object-cover" src={avt} alt="" />
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between md:items-center lg:justify-between">
                    <div className="flex">
                        <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
                            Current Bid: {price} ETH
                        </p>
                    </div>
                    <button className="linear rounded-[50px] bg-brand-900 px-7 py-2.5 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90">
                        Place Bid
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default NftCard;
