'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import CheckTable from '@/components/Tables/CheckTable';
import ComplexTable from '@/components/Tables/ComplexTable';
import DevelopmentTable from '@/components/Tables/DevelopmentTable';
import ColumnsTable from '@/components/Tables/ColumnsTable';

const Tables = () => {
    return (
        <AdminLayout>
            <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                <DevelopmentTable />
                <CheckTable />
                <ColumnsTable />
                <ComplexTable />
            </div>
        </AdminLayout>
    );
};

export default Tables;
