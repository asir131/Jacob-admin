'use client';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Image from 'next/image';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#00305E]">
            {/* Left Side - Sign In Card */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 z-10 ">
                <div className="w-full max-w-[500px] bg-white rounded-4xl px-10 py-12 shadow-2xl pb-[48px] pl-[48px] pr-[48px]">
                    {/* Logo */}
                    <div className="flex justify-center mb-6 pt-[48px] ">
                        <div className="w-[100px] h-[100px] flex items-center justify-center">
                            <Image
                                src="/images/nfts/Vector 16.svg"
                                alt="Brand Logo"
                                width={100}
                                height={100}
                                priority
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-center text-3xl font-bold text-[#2286BE] mb-2">
                        Sign In
                    </h2>
                    <p className="text-center text-sm text-gray-500 mb-8">
                        Enter your email and password to sign in!
                    </p>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email*
                        </label>
                        <input
                            type="email"
                            placeholder="mail@simmmple.com"
                            className="w-full px-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#2286BE] focus:ring-1 focus:ring-[#2286BE]"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password*
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#2286BE] focus:ring-1 focus:ring-[#2286BE] pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <RiEyeOffLine className="w-5 h-5" />
                                ) : (
                                    <RiEyeLine className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-[#2286BE] focus:ring-[#2286BE]"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Keep me logged in
                            </span>
                        </label>
                        <a
                            href="#"
                            className="text-sm text-[#2286BE] font-medium hover:opacity-80"
                        >
                            Forget password?
                        </a>
                    </div>

                    {/* Sign In */}
                    <button className="w-full bg-[#2286BE] hover:opacity-90 text-white font-semibold py-3 rounded-lg mb-4">
                        Sign In
                    </button>

                    {/* Register */}
                    <p className="text-center text-sm text-gray-600 mb-6">
                        Not registered yet?{' '}
                        <a href="#" className="text-[#2286BE] font-medium hover:opacity-80">
                            Create an Account
                        </a>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google Sign In */}
                    <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2">
                        <FcGoogle className="w-5 h-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>

            {/* Right Side - Full Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <Image
                    src="/images/Image copy.png"
                    alt="Brand Hero Image"
                    fill
                    className="object-fill"
                    priority
                />
            </div>
        </div>
    );
};

export default SignIn;