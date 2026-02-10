'use client';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerTable from '@/components/admin/CustomerTable';

const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', ' Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'];
const statuses = ['Active', 'Inactive'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const tableDataCustomers = Array.from({ length: 50 }, (_, i) => {
    const date = new Date(2024, Math.floor(i / 5), (i % 28) + 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Deterministic values based on index
    const spentValue = (500 + (i * 123) % 4500);
    const jobsValue = (1 + (i * 3) % 15);

    return {
        id: (i + 1).toString(),
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        location: locations[i % locations.length],
        spent: spentValue.toLocaleString(),
        jobs: jobsValue,
        status: statuses[i % statuses.length],
        date: `${day} ${month} ${year}`,
        timestamp: date.getTime(),
    };
});

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
