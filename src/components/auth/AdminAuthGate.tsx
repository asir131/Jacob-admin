'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_AUTH_TOKEN_KEY } from '@/lib/auth';
import { clearAdminSession } from '@/lib/auth';
import { useAppDispatch } from '@/store/hooks';
import { clearSession } from '@/store/slices/authSlice';

const SIGN_IN_PATH = '/auth/sign-in';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [checked, setChecked] = React.useState(false);
  const [hasToken, setHasToken] = React.useState(false);

  const isSignInPath = pathname === SIGN_IN_PATH || pathname.startsWith(`${SIGN_IN_PATH}/`);

  React.useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
      const tokenExists = Boolean(token);

      if (!tokenExists) {
        dispatch(clearSession());
        if (!isMounted) return;
        setHasToken(false);
        setChecked(true);
        if (!isSignInPath) router.replace(SIGN_IN_PATH);
        return;
      }

      if (!API_BASE_URL) {
        if (!isMounted) return;
        setHasToken(true);
        setChecked(true);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }

        if (!isMounted) return;
        setHasToken(true);
        setChecked(true);
      } catch {
        clearAdminSession();
        dispatch(clearSession());

        if (!isMounted) return;
        setHasToken(false);
        setChecked(true);
        if (!isSignInPath) {
          router.replace(SIGN_IN_PATH);
        }
      }
    };

    verifyToken();
    return () => {
      isMounted = false;
    };
  }, [dispatch, isSignInPath, pathname, router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#2286BE]">Checking access...</div>
      </div>
    );
  }

  if (!hasToken && !isSignInPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-bg">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#2286BE]">Redirecting to sign in...</div>
      </div>
    );
  }

  return <>{children}</>;
}
