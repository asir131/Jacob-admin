'use client';
import Card from '@/components/Card/Card';
import { ReactNode } from 'react';

const ServiceCategoryCard = ({ title, count, icon, color }: { title: string; count: string; icon: ReactNode, color: string }) => {
    return (
        <Card extra="py-[17px] px-[17px] h-full w-full">
            <div className="flex items-center gap-3">
                <div className={`flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-${color}-50 text-${color}-500 dark:bg-white/5`}>
                    <div className={`text-2xl text-${color}-500`}>
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h5 className="text-base font-bold text-navy-700 dark:text-white">
                        {title}
                    </h5>
                    <p className="text-sm font-medium text-gray-600">
                        {count} Providers
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCategoryCard;
