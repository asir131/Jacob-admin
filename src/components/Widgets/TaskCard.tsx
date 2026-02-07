
import React from 'react';
import Card from '../Card/Card';
import { MdCheckCircle, MdDragIndicator } from 'react-icons/md';

const tasks = [
    { label: 'Landing Page Design', checked: false },
    { label: 'Dashboard Builder', checked: true },
    { label: 'Mobile App Design', checked: true },
    { label: 'Illustrations', checked: false },
    { label: 'Promotional LP', checked: true },
];

const TaskCard = () => {
    return (
        <Card extra="pb-7 p-[20px]">
            <div className="relative flex flex-row justify-between">
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
                        <MdCheckCircle className="h-6 w-6 text-brand-500 dark:text-white" />
                    </div>
                    <h4 className="ml-4 text-lg font-bold text-navy-700 dark:text-white">
                        Tasks
                    </h4>
                </div>
                <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100">
                    ...
                </button>
            </div>

            <div className="h-full w-full">
                {tasks.map((task, index) => (
                    <div key={index} className="mt-5 flex items-center justify-between p-2">
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="checkbox"
                                defaultChecked={task.checked}
                                className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s] checked:border-none checked:text-white hover:cursor-pointer hover:border-gray-500 checked:bg-brand-500 dark:border-white/10 dark:checked:bg-brand-400"
                            />
                            <label className="text-base font-bold text-navy-700 dark:text-white">
                                {task.label}
                            </label>
                        </div>
                        <MdDragIndicator className="h-6 w-6 text-navy-700 dark:text-white cursor-grab" />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TaskCard;
