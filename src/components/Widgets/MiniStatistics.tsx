
import React from 'react';
import Card from '../Card/Card';

const MiniStatistics = (props: {
    icon?: React.ReactNode;
    title: string;
    value: string | number;
    growth?: string | number;
    endContent?: React.ReactNode;
}) => {
    const { icon, title, value, growth, endContent } = props;

    return (
        <Card extra="!flex-row flex-grow items-center rounded-[20px] py-[12px] px-[15px]">
            <div className="flex flex-row items-center justify-center">
                {icon && (
                    <span className="flex items-center text-brand-500 dark:text-white">
                        {icon}
                    </span>
                )}
            </div>

            <div className="ml-2 flex w-auto flex-col justify-center">
                <p className="font-dm text-[10px] font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <div className="flex items-center gap-1">
                    <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                        {value}
                    </h4>
                    {growth ? (
                        <span className="text-[10px] font-bold text-green-500">
                            {growth}
                        </span>
                    ) : null}
                </div>
            </div>
            {endContent ? (
                <div className="flex ml-auto h-full w-auto items-center justify-center pr-1">
                    {endContent}
                </div>
            ) : null}
        </Card>
    );
};

export default MiniStatistics;
