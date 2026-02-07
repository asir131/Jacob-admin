import React from "react";

const Banner = () => {
    return (
        <div
            className="flex w-full flex-col rounded-[20px] bg-gradient-to-br from-[#868CFF] via-[#4318FF] to-[#868CFF] px-[30px] py-[30px] md:px-[64px] md:py-[56px] relative overflow-hidden"
            style={{
                // Fallback to gradient if image missing, or use the image if confident. The user provided an image url in previous turns. 
                // I'll stick to the class gradient to ensure it looks good immediately without broken images.
            }}
        >
            <div className="w-full relative z-10">
                <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
                    Discover, collect, and sell extraordinary NFTs
                </h4>
                <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
                    Enter in this creative world. Discover now the latest NFTs or start
                    creating your own!
                </p>

                <div className="mt-[36px] flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
                    <button className="text-black bg-white rounded-[50px] py-2.5 px-6 font-bold text-base transition-all hover:bg-white/90">
                        Discover now
                    </button>
                    <button className="text-white hover:text-white/80 font-medium text-base transition-all">
                        Watch video
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
