'use client';

import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  MdAttachMoney,
  MdBarChart,
  MdCalendarMonth,
  MdCheckCircle,
  MdClose,
  MdOutlineCalendarViewWeek,
  MdPersonAddAlt1,
  MdVerifiedUser,
} from 'react-icons/md';

import Card from '@/components/Card/Card';
import IconBox from '@/components/Widgets/IconBox';
import MiniStatistics from '@/components/Widgets/MiniStatistics';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAppSelector } from '@/store/hooks';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const PIE_COLORS = ['#2286BE', '#58B7E8', '#8ED0F0', '#B7E4F7', '#D3EEF9', '#E9F7FD'];

type DashboardSummary = {
  totalRevenue: number;
  totalBookings: number;
  verifiedProviders: number;
  weeklyOrders: number;
  newUsersLast30Days: number;
  completedOrders: number;
  totalUsers: number;
  currentMonthRevenue: number;
  maxActiveUsers: number;
};

type DashboardCharts = {
  monthlyRevenue: { name: string; revenue: number }[];
  weeklyRevenue: { name: string; revenue: number }[];
  dailyTraffic: { name: string; users: number }[];
  pieRevenue: { name: string; value: number }[];
};

type DashboardOrderPreview = {
  id: string;
  orderNumber: string;
  orderName: string;
  categoryName: string;
  status: string;
  paymentStatus: string;
  paymentAmount: number;
  platformFeeAmount: number;
  providerEarningsAmount: number;
  scheduledDate: string | null;
  scheduledTime: string;
  serviceAddress: string;
  createdAt: string | null;
  completedAt: string | null;
  paidAt: string | null;
  client: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  provider: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    sellerLevel?: string;
  };
  gig: {
    id: string;
    title: string;
    categoryName: string;
  };
};

type DashboardPayload = {
  summary: DashboardSummary;
  charts: DashboardCharts;
  recentOrders: DashboardOrderPreview[];
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  orderName: string;
  categoryName: string;
  status: string;
  packageTitle?: string;
  packagePrice: number;
  scheduledDate?: string | null;
  scheduledTime?: string;
  serviceAddress?: string;
  specialInstructions?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  platformFeeAmount?: number;
  providerEarningsAmount?: number;
  createdAt?: string | null;
  completedAt?: string | null;
  paidAt?: string | null;
  client: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  provider: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    sellerLevel?: string;
    completedOrders?: number;
  };
  gig: {
    title: string;
    categoryName: string;
  };
};

const initialData: DashboardPayload = {
  summary: {
    totalRevenue: 0,
    totalBookings: 0,
    verifiedProviders: 0,
    weeklyOrders: 0,
    newUsersLast30Days: 0,
    completedOrders: 0,
    totalUsers: 0,
    currentMonthRevenue: 0,
    maxActiveUsers: 0,
  },
  charts: {
    monthlyRevenue: [],
    weeklyRevenue: [],
    dailyTraffic: [],
    pieRevenue: [],
  },
  recentOrders: [],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatCurrencyPrecise = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const tooltipCurrency = (value: unknown) => formatCurrencyPrecise(Number(value || 0));

const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
};

const formatDateOnly = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusBadgeClass = (status: string) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'completed' || normalized === 'paid') return 'bg-emerald-50 text-emerald-700';
  if (normalized === 'accepted' || normalized === 'accepting_delivery') return 'bg-sky-50 text-sky-700';
  if (normalized.includes('revision')) return 'bg-amber-50 text-amber-700';
  if (normalized === 'declined' || normalized === 'cancelled') return 'bg-rose-50 text-rose-700';
  return 'bg-slate-100 text-slate-600';
};

const SectionRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-right text-sm font-bold text-navy-700">{value}</span>
  </div>
);

export default function Dashboard() {
  const session = useAppSelector((state) => state.auth.session);
  const [dashboard, setDashboard] = React.useState<DashboardPayload>(initialData);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadDashboard = React.useCallback(async () => {
    if (!API_BASE || !session?.accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/orders/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load dashboard.');
      }

      setDashboard(payload.data || initialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  React.useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const openOrderModal = async (orderId: string) => {
    if (!API_BASE || !session?.accessToken || !orderId) return;
    setOrderLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/orders/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to load order details.');
      }

      setSelectedOrder(payload.data?.order || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details.');
    } finally {
      setOrderLoading(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboard.summary.totalRevenue),
      icon: <MdBarChart className="h-6 w-6" />,
    },
    {
      title: 'Total Bookings',
      value: dashboard.summary.totalBookings.toLocaleString(),
      icon: <MdAttachMoney className="h-6 w-6" />,
    },
    {
      title: 'Verified Providers',
      value: dashboard.summary.verifiedProviders.toLocaleString(),
      icon: <MdVerifiedUser className="h-6 w-6" />,
    },
    {
      title: 'Weekly Orders',
      value: dashboard.summary.weeklyOrders.toLocaleString(),
      icon: <MdOutlineCalendarViewWeek className="h-6 w-6" />,
    },
    {
      title: 'New Users',
      value: dashboard.summary.newUsersLast30Days.toLocaleString(),
      growth: `${dashboard.summary.totalUsers.toLocaleString()} total`,
      icon: <MdPersonAddAlt1 className="h-6 w-6" />,
    },
    {
      title: 'Completed Services',
      value: dashboard.summary.completedOrders.toLocaleString(),
      icon: <MdCheckCircle className="h-6 w-6" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="mt-2 space-y-5">
        {error ? (
          <Card extra="p-4 text-sm font-bold text-red-600">{error}</Card>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {summaryCards.map((card) => (
            <MiniStatistics
              key={card.title}
              icon={
                <IconBox
                  icon={card.icon}
                  className="h-12 w-12 bg-lightPrimary text-brand-DEFAULT dark:bg-navy-700 dark:text-white"
                />
              }
              title={card.title}
              value={loading ? '...' : card.value}
              growth={card.growth}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card extra="p-5 xl:col-span-2">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Platform Revenue</p>
                <h3 className="mt-1 text-2xl font-bold text-navy-700">Monthly Basis</h3>
              </div>
              <div className="rounded-xl bg-lightPrimary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                {formatCurrency(dashboard.summary.currentMonthRevenue)} this month
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.charts.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthlyRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2286BE" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2286BE" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#E8EEF6" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <Tooltip formatter={tooltipCurrency} />
                  <Area type="monotone" dataKey="revenue" stroke="#2286BE" strokeWidth={3} fill="url(#monthlyRevenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card extra="p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Weekly Revenue</p>
                <h3 className="mt-1 text-2xl font-bold text-navy-700">Last 7 Days</h3>
              </div>
              <div className="rounded-xl bg-lightPrimary p-2 text-brand-500">
                <MdCalendarMonth className="h-5 w-5" />
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.charts.weeklyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E8EEF6" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <Tooltip formatter={tooltipCurrency} />
                  <Bar dataKey="revenue" fill="#2286BE" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card extra="p-5 xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Bookings</p>
                <h3 className="mt-1 text-2xl font-bold text-navy-700">All Recent Orders</h3>
              </div>
              <div className="rounded-xl bg-lightPrimary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Scrollable
              </div>
            </div>

            <div className="max-h-[430px] overflow-y-auto pr-1">
              <div className="space-y-3">
                {loading ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm font-bold text-slate-500">
                    Loading recent bookings...
                  </div>
                ) : dashboard.recentOrders.length ? (
                  dashboard.recentOrders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => void openOrderModal(order.id)}
                      className="w-full rounded-[20px] border border-slate-100 bg-white px-4 py-4 text-left transition hover:border-[#2286BE]/30 hover:bg-slate-50"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                              {order.orderNumber}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusBadgeClass(order.status)}`}>
                              {order.status}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusBadgeClass(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                          <h4 className="mt-3 text-lg font-bold text-navy-700">{order.orderName}</h4>
                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {order.client.name} • {order.provider.name}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">{order.serviceAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-[#2286BE]">{formatCurrency(order.paymentAmount)}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-400">{formatDateOnly(order.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm font-bold text-slate-500">
                    No recent orders found.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5">
            <Card extra="p-5">
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-500">Daily Traffic</p>
                <h3 className="mt-1 text-2xl font-bold text-navy-700">
                  {dashboard.summary.maxActiveUsers.toLocaleString()} max active users
                </h3>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.charts.dailyTraffic} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <Tooltip formatter={(value: unknown) => `${Number(value || 0)} users`} />
                    <Bar dataKey="users" fill="#2286BE" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card extra="p-5">
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-500">Revenue Share</p>
                <h3 className="mt-1 text-2xl font-bold text-navy-700">Monthly Revenue Mix</h3>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard.charts.pieRevenue}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {dashboard.charts.pieRevenue.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={tooltipCurrency} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {dashboard.charts.pieRevenue.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-500">
                      {item.name}: {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {(selectedOrder || orderLoading) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2286BE]">Order Details</p>
                <h3 className="mt-2 text-2xl font-bold text-navy-700">
                  {orderLoading ? 'Loading...' : selectedOrder?.orderName || 'Order'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>

            {orderLoading || !selectedOrder ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-8 text-sm font-bold text-slate-500">
                Loading order details...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Card extra="p-5">
                  <h4 className="text-lg font-bold text-navy-700">Overview</h4>
                  <div className="mt-4">
                    <SectionRow label="Order Number" value={selectedOrder.orderNumber} />
                    <SectionRow label="Category" value={selectedOrder.categoryName || 'N/A'} />
                    <SectionRow label="Status" value={<span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span>} />
                    <SectionRow label="Payment" value={<span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusBadgeClass(selectedOrder.paymentStatus || '')}`}>{selectedOrder.paymentStatus || 'N/A'}</span>} />
                    <SectionRow label="Scheduled" value={`${formatDateOnly(selectedOrder.scheduledDate)} ${selectedOrder.scheduledTime || ''}`} />
                    <SectionRow label="Completed" value={formatDateTime(selectedOrder.completedAt)} />
                  </div>
                </Card>

                <Card extra="p-5">
                  <h4 className="text-lg font-bold text-navy-700">Pricing</h4>
                  <div className="mt-4">
                    <SectionRow label="Client Paid" value={formatCurrencyPrecise(selectedOrder.paymentAmount || 0)} />
                    <SectionRow label="Provider Earnings" value={formatCurrencyPrecise(selectedOrder.providerEarningsAmount || 0)} />
                    <SectionRow label="Platform Revenue" value={formatCurrencyPrecise(selectedOrder.platformFeeAmount || 0)} />
                    <SectionRow label="Package Price" value={formatCurrencyPrecise(selectedOrder.packagePrice || 0)} />
                    <SectionRow label="Paid At" value={formatDateTime(selectedOrder.paidAt)} />
                  </div>
                </Card>

                <Card extra="p-5">
                  <h4 className="text-lg font-bold text-navy-700">Client</h4>
                  <div className="mt-4">
                    <SectionRow label="Name" value={selectedOrder.client.name} />
                    <SectionRow label="Email" value={selectedOrder.client.email || 'N/A'} />
                    <SectionRow label="Phone" value={selectedOrder.client.phone || 'N/A'} />
                    <SectionRow label="Address" value={selectedOrder.client.address || 'N/A'} />
                  </div>
                </Card>

                <Card extra="p-5">
                  <h4 className="text-lg font-bold text-navy-700">Provider</h4>
                  <div className="mt-4">
                    <SectionRow label="Name" value={selectedOrder.provider.name} />
                    <SectionRow label="Email" value={selectedOrder.provider.email || 'N/A'} />
                    <SectionRow label="Phone" value={selectedOrder.provider.phone || 'N/A'} />
                    <SectionRow label="Seller Level" value={selectedOrder.provider.sellerLevel || 'N/A'} />
                    <SectionRow label="Completed Orders" value={selectedOrder.provider.completedOrders || 0} />
                  </div>
                </Card>

                <Card extra="p-5 lg:col-span-2">
                  <h4 className="text-lg font-bold text-navy-700">Service Details</h4>
                  <div className="mt-4">
                    <SectionRow label="Service" value={selectedOrder.gig?.title || selectedOrder.orderName} />
                    <SectionRow label="Address" value={selectedOrder.serviceAddress || 'N/A'} />
                    <SectionRow label="Created At" value={formatDateTime(selectedOrder.createdAt)} />
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Special Instructions</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedOrder.specialInstructions || 'No special instructions provided.'}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
