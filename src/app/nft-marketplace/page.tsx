'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Banner from '@/components/nft/Banner';
import NftCard from '@/components/nft/NftCard';
import HistoryCard from '@/components/nft/HistoryCard';
import TopCreatorTable from '@/components/nft/TopCreatorTable';

const NFTMarketplace = () => {
    // Dummy Data
    const dummyNFTs = [
        { title: "Abstract Colors", author: "Esthera Jackson", price: "0.91", image: "/images/nfts/Nft1.png" },
        { title: "ETH AI Brain", author: "Nick Wilson", price: "0.91", image: "/images/nfts/Nft2.png" },
        { title: "Mesh Gradients", author: "Will Smith", price: "0.91", image: "/images/nfts/Nft3.png" },
    ];

    // Using duplicate data for grid filling
    const recentlyAdded = [
        { title: "Swipe Circles", author: "Peter Will", price: "0.91", image: "/images/nfts/Nft2.png" }, // Reusing Nft2
        { title: "Colorful Heaven", author: "Mark Benjamin", price: "0.91", image: "/images/nfts/Nft1.png" }, // Reusing Nft1
        { title: "3D Cubes Art", author: "Manny Gates", price: "0.91", image: "/images/nfts/Nft3.png" }, // Reusing Nft3
    ];

    const creatorsData = [
        { name: "@maddison_c21", rating: 98, image: "/images/nfts/Nft1.png" }, // Reusing as avatar/art
        { name: "@karl.will02", rating: 88, image: "/images/nfts/Nft2.png" },
        { name: "@andreea.1z", rating: 76, image: "/images/nfts/Nft3.png" },
        { name: "@abraham47.y", rating: 65, image: "/images/nfts/Nft1.png" },
        { name: "@simmmple.web", rating: 50, image: "/images/nfts/Nft2.png" },
        { name: "@venus.sys", rating: 90, image: "/images/nfts/Nft3.png" },
        { name: "@ape.vpp8", rating: 40, image: "/images/nfts/Nft1.png" },
    ];

    return (
        <AdminLayout>
            <div className="mt-3 grid h-full grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                    {/* Banner */}
                    <div className="mb-12">
                        <Banner />
                    </div>

                    {/* Trending NFTs */}
                    <div className="mb-12">
                        <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Trending NFTs</h4>
                            <div className="mt-4 flex items-center gap-3 md:mt-0">
                                <button className="linear rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 dark:bg-navy-800 dark:text-white dark:hover:bg-white/5 active:bg-gray-200 shadow-md">
                                    Art
                                </button>
                                <button className="linear rounded-full bg-white/0 px-4 py-2 text-sm font-medium text-gray-600 transition duration-200 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 hover:text-navy-700">
                                    Music
                                </button>
                                <button className="linear rounded-full bg-white/0 px-4 py-2 text-sm font-medium text-gray-600 transition duration-200 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 hover:text-navy-700">
                                    Collectibles
                                </button>
                                <button className="linear rounded-full bg-white/0 px-4 py-2 text-sm font-medium text-gray-600 transition duration-200 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/5 hover:text-navy-700">
                                    Sports
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {dummyNFTs.map((nft, index) => (
                                <NftCard
                                    key={index}
                                    title={nft.title}
                                    author={nft.author}
                                    price={nft.price}
                                    image={nft.image}
                                    bidders={["https://i.ibb.co/m0h65pk/Nft2.png", "https://i.ibb.co/hR4yX06/Nft3.png"]}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recently Added */}
                    <div>
                        <h4 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">Recently Added</h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {recentlyAdded.map((nft, index) => (
                                <NftCard
                                    key={index}
                                    title={nft.title}
                                    author={nft.author}
                                    price={nft.price}
                                    image={nft.image}
                                    bidders={["https://i.ibb.co/m0h65pk/Nft2.png", "https://i.ibb.co/hR4yX06/Nft3.png"]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1 flex flex-col gap-6">
                    {/* Top Creators & History */}
                    <TopCreatorTable tableData={creatorsData} extra="w-full flex-1" />
                    <HistoryCard extra="w-full flex-1" />
                </div>
            </div>
        </AdminLayout>
    );
};

export default NFTMarketplace;
