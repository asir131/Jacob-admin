'use client';
import ProviderTable from '@/components/admin/ProviderTable';
import AdminLayout from '@/components/layouts/AdminLayout';

const tableDataProviders = [
    {
        name: 'John Doe Services',
        category: 'Plumbing',
        status: 'Approved',
        rating: 4.8,
        date: '12 Jan 2024',
    },
    {
        name: 'Quick Fix Plumbers',
        category: 'Plumbing',
        status: 'Pending',
        rating: 3.5,
        date: '10 Feb 2024',
    },
    {
        name: 'Electric Master',
        category: 'Electrical',
        status: 'Disable',
        rating: 2.0,
        date: '05 Mar 2024',
    },
    {
        name: 'Clean Home Inc',
        category: 'Cleaning',
        status: 'Approved',
        rating: 5.0,
        date: '15 Mar 2024',
    },
    {
        name: 'Green Garden',
        category: 'Gardening',
        status: 'Approved',
        rating: 4.9,
        date: '20 Mar 2024',
    },
];

const Providers = () => {
    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 mt-5">
                <ProviderTable tableData={tableDataProviders} />
            </div>
        </AdminLayout>
    );
};

export default Providers;
