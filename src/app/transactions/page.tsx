'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Card from '@/components/Card/Card';
import { MdAttachMoney, MdReceipt, MdTrendingUp } from 'react-icons/md';
import TransactionTable from '@/components/admin/TransactionTable';
import { getStoredAdminToken } from '@/lib/auth';

type TransactionItem = {
  id: string;
  service: string;
  user: string;
  amount: number;
  totalPaid: number;
  providerEarnings: number;
  date: string | null;
  timestamp: number;
  status: string;
  method: string;
};

type Summary = {
  totalAdminFees: number;
  totalProviderEarnings: number;
  paidTransactions: number;
  pendingPayouts: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function TransactionsPage() {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalAdminFees: 0,
    totalProviderEarnings: 0,
    paidTransactions: 0,
    pendingPayouts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      const token = getStoredAdminToken();
      if (!API_BASE || !token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/orders/admin/transactions?status=all&page=1&limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load transactions.');
        }

        if (!isMounted) return;
        setItems(Array.isArray(payload?.data?.items) ? payload.data.items : []);
        setSummary({
          totalAdminFees: Number(payload?.data?.summary?.totalAdminFees || 0),
          totalProviderEarnings: Number(payload?.data?.summary?.totalProviderEarnings || 0),
          paidTransactions: Number(payload?.data?.summary?.paidTransactions || 0),
          pendingPayouts: Number(payload?.data?.summary?.pendingPayouts || 0),
        });
      } catch {
        if (!isMounted) return;
        setItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  const tableData = useMemo(
    () =>
      items.map((item) => {
        const date = item.date ? new Date(item.date) : null;
        return {
          id: item.id,
          user: item.user,
          service: `${item.service} • ${item.method}`,
          amount: Number(item.amount || 0).toFixed(2),
          date: date
            ? date.toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A',
          timestamp: Number(item.timestamp || 0),
          status: item.status || 'Pending',
          method: `Client Paid $${Number(item.totalPaid || 0).toFixed(2)}`,
        };
      }),
    [items]
  );

  return (
    <AdminLayout>
      <div className="mt-5 grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card extra="p-5 flex flex-col justify-between h-[140px] bg-navy-800 text-white dark:bg-brand-900 border-none bg-gradient-to-br from-navy-800 to-navy-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-300 text-sm font-medium">Admin Fee Collected</p>
                <h4 className="text-3xl font-bold mt-1 text-white">${summary.totalAdminFees.toFixed(2)}</h4>
              </div>
              <div className="p-3 rounded-full bg-white/10 text-white">
                <MdAttachMoney className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span>{summary.paidTransactions} paid orders</span>
            </div>
          </Card>

          <Card extra="p-5 flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Provider Payouts</p>
                <h4 className="text-3xl font-bold mt-1 text-navy-700 dark:text-white">${summary.pendingPayouts.toFixed(2)}</h4>
              </div>
              <div className="p-3 rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/20">
                <MdReceipt className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Withdrawals still waiting for admin processing.</p>
          </Card>

          <Card extra="p-5 flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Provider Earnings Released</p>
                <h4 className="text-3xl font-bold mt-1 text-navy-700 dark:text-white">${summary.totalProviderEarnings.toFixed(2)}</h4>
              </div>
              <div className="p-3 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20">
                <MdTrendingUp className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Exact base package earnings credited to providers.</p>
          </Card>
        </div>

        {isLoading ? (
          <Card extra="p-8 text-sm font-bold text-gray-500">Loading transactions...</Card>
        ) : (
          <TransactionTable tableData={tableData} />
        )}
      </div>
    </AdminLayout>
  );
}
