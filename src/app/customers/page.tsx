'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerTable from '@/components/admin/CustomerTable';

const tableDataCustomers = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        location: 'New York, NY',
        spent: '1,250',
        jobs: 5,
        status: 'Active',
    },
    {
        id: '2',
        name: 'Michael Smith',
        email: 'michael@example.com',
        location: 'Los Angeles, CA',
        spent: '3,400',
        jobs: 12,
        status: 'Active',
    },
    {
        id: '3',
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        location: 'Chicago, IL',
        spent: '850',
        jobs: 3,
        status: 'Inactive',
    },
    {
        id: '4',
        name: 'David Brown',
        email: 'david@example.com',
        location: 'Houston, TX',
        spent: '2,100',
        jobs: 8,
        status: 'Active',
    },
];

const Customers = () => {
    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 mt-5">
                <CustomerTable tableData={tableDataCustomers} />
            </div>
        </AdminLayout>
    );
};

export default Customers;
