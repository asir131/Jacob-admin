'use client';

import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  storeAdminSession,
} from '@/lib/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSession } from '@/store/slices/authSlice';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.session));

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!apiBaseUrl) {
      setError('Missing NEXT_PUBLIC_API_URL in admin dashboard environment.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          accessToken: string;
          refreshToken: string;
          user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
          };
        };
      };

      if (!response.ok || !payload.success || !payload.data) {
        setError(payload.message || 'Invalid admin email or password.');
        setIsSubmitting(false);
        return;
      }

      if (payload.data.user.role !== 'superAdmin') {
        setError('Only super admin can access the admin dashboard.');
        setIsSubmitting(false);
        return;
      }

      storeAdminSession({
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
        user: payload.data.user,
      });
      dispatch(setSession({
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
        user: payload.data.user,
      }));
      router.replace('/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign in failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#00305E]">
      <div className="z-10 flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[500px] rounded-4xl bg-white px-10 pt-12 pr-[48px] pb-[48px] pl-[48px] shadow-2xl">
          <div className="mb-6 flex justify-center pt-[48px]">
            <div className="flex h-[100px] w-[100px] items-center justify-center">
              <Image
                src="/images/nfts/Vector 16.svg"
                alt="Brand Logo"
                width={100}
                height={100}
                priority
              />
            </div>
          </div>

          <h2 className="mb-2 text-center text-3xl font-bold text-[#2286BE]">Sign In</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Enter your admin email and password to sign in.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Email*</label>
              <input
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-[#F4F7FE] px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#2286BE] focus:ring-1 focus:ring-[#2286BE] focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Password*</label>
              <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-[#F4F7FE] px-4 py-3 pr-11 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#2286BE] focus:ring-1 focus:ring-[#2286BE] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-[#2286BE] focus:ring-[#2286BE]"
                />
                <span className="ml-2 text-sm text-gray-700">Keep me logged in</span>
              </label>
              <span className="text-sm font-medium text-[#2286BE]">Admin access only</span>
            </div>

            {error ? <p className="mb-4 text-sm font-medium text-red-500">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mb-4 w-full rounded-lg bg-[#2286BE] py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mb-6 text-center text-sm text-gray-600">
            Admin credentials are now controlled from the backend environment.
          </p>

          <div className="mb-6 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50">
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </button>
        </div>
      </div>

      <div className="relative hidden lg:flex lg:w-1/2">
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
