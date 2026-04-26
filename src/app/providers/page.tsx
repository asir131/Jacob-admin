'use client';

import { useEffect, useState } from 'react';
import ProviderTable, { type ProviderRow } from '@/components/admin/ProviderTable';
import AdminLayout from '@/components/layouts/AdminLayout';
import { getStoredAdminToken } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const Providers = () => {
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProviders = async () => {
      const adminToken = getStoredAdminToken();
      if (!API_BASE || !adminToken) {
        setError('Missing admin session or API base URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/api/profile/admin/providers`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            Accept: 'application/json',
          },
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load providers.');
        }

        setRows(Array.isArray(payload.data) ? payload.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load providers.');
      } finally {
        setLoading(false);
      }
    };

    void loadProviders();
  }, []);

  return (
    <AdminLayout>
      <div className="mt-5 flex w-full flex-col gap-5">
        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-sm font-bold text-gray-500 shadow-sm">
            Loading providers...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-sm font-bold text-red-600">
            {error}
          </div>
        ) : (
          <ProviderTable tableData={rows} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Providers;
