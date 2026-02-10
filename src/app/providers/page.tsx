'use client';
import ProviderTable from '@/components/admin/ProviderTable';
import AdminLayout from '@/components/layouts/AdminLayout';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Carpentry', 'Painting'];
const statuses = ['Approved', 'Pending', 'Disable'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const tableDataProviders = Array.from({ length: 50 }, (_, i) => {
    const date = new Date(2024, Math.floor(i / 5), (i % 28) + 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Deterministic rating based on index
    const rating = Number((3.5 + (i * 0.13) % 1.5).toFixed(1));

    return {
        id: (i + 1).toString(),
        name: `Service Provider ${i + 1}`,
        category: categories[i % categories.length],
        status: statuses[i % statuses.length],
        rating: rating,
        date: `${day} ${month} ${year}`,
        timestamp: date.getTime(),
    };
});

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
