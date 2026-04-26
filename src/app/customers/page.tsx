'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerTable, { type CustomerRow } from '@/components/admin/CustomerTable';
import { getStoredAdminToken } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const Customers = () => {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      const adminToken = getStoredAdminToken();
      if (!API_BASE || !adminToken) {
        setError('Missing admin session or API base URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/api/profile/admin/customers`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            Accept: 'application/json',
          },
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load customers.');
        }

        setRows(Array.isArray(payload.data) ? payload.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };

    void loadCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="mt-5 flex w-full flex-col gap-5">
        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-sm font-bold text-gray-500 shadow-sm">
            Loading customers...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-sm font-bold text-red-600">
            {error}
          </div>
        ) : (
          <CustomerTable tableData={rows} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
