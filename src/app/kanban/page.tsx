'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import KanbanCard from '@/components/kanban/KanbanCard';
import { MdAdd } from 'react-icons/md';

const Kanban = () => {
    return (
        <AdminLayout>
            <div className="flex w-full flex-col pt-3">
                <div className="mb-4">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">Kanban Board</h4>
                </div>

                {/* Board Columns */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Backlog */}
                    <div className="flex flex-col">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-bold text-navy-700 dark:text-white text-lg">Backlog</h4>
                            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-lightPrimary text-brand-500 hover:bg-gray-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <MdAdd />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <KanbanCard
                                title="Option to 'use local/server version' feature"
                                desc="It usually displays this message when you close an unsaved page when you do it on purpose, and it's getting frustrated to see this every time."
                                status="UPDATES"
                                statusColor="blue"
                                members={["https://i.ibb.co/m0h65pk/Nft2.png", "https://i.ibb.co/hR4yX06/Nft3.png"]}
                            />
                            <KanbanCard
                                title="Add/modify your own CSS-Selectors"
                                desc=""
                                image="https://i.ibb.co/m0h65pk/Nft2.png"
                                status="PENDING"
                                statusColor="orange"
                                members={["https://i.ibb.co/W3M55f5/Nft4.png", "https://i.ibb.co/C5qL90T/Nft1.png"]}
                            />
                            <KanbanCard
                                title="Shortcode for templates to display correctly"
                                desc="When you save some sections as a template and then paste a shortcode to a new page, the layout is broken, some styles are missing - in the editor."
                                status="ERRORS"
                                statusColor="red"
                                members={["https://i.ibb.co/QrHjmfc/Nft6.png"]}
                            />
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="flex flex-col">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-bold text-navy-700 dark:text-white text-lg">In Progress</h4>
                            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-lightPrimary text-brand-500 hover:bg-gray-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <MdAdd />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <KanbanCard
                                title="General ideas to improve 'Edit' workflow"
                                desc="Currently, I have a few templates in the Local Library and when I want to add them I'm always presented (by default)."
                                status="PENDING"
                                statusColor="orange"
                                members={["https://i.ibb.co/hR4yX06/Nft3.png", "https://i.ibb.co/Mhp40tF/Nft5.png"]}
                            />
                            <KanbanCard
                                title="Shortcode for templates to display correctly"
                                desc="When you save some sections as a template and then paste a shortcode to a new page, the layout is broken, some styles are missing - in the editor."
                                status="UPDATES"
                                statusColor="blue"
                                members={["https://i.ibb.co/QrHjmfc/Nft6.png"]}
                            />
                            <KanbanCard
                                title="[UX Design] - Set the default Library tab"
                                desc="I want to be able to set the default Library tab (or a way to remember the last active tab), especially when I already..."
                                image="https://i.ibb.co/hR4yX06/Nft3.png"
                                status="ERRORS"
                                statusColor="red"
                                members={["https://i.ibb.co/m0h65pk/Nft2.png"]}
                            />
                        </div>
                    </div>

                    {/* Done */}
                    <div className="flex flex-col">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-bold text-navy-700 dark:text-white text-lg">Done</h4>
                            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-lightPrimary text-brand-500 hover:bg-gray-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <MdAdd />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <KanbanCard
                                title="Copy/Paste elements between pages"
                                desc="We can only copy/paste elements (or group of elements) in the same page, which is quite limited."
                                status="DONE"
                                statusColor="green"
                                members={["https://i.ibb.co/QrHjmfc/Nft6.png"]}
                            />
                            <KanbanCard
                                title="Remove Extra DIV for each container added"
                                desc="I still hope there won't have an extra div for each container we added. It should be something for better styling..."
                                status="DONE"
                                statusColor="green"
                                members={["https://i.ibb.co/Mhp40tF/Nft5.png", "https://i.ibb.co/W3M55f5/Nft4.png"]}
                            />
                            <KanbanCard
                                title="Add Figma files for the Library design blocks"
                                desc="I want to present my clients the Figma files first, so it would be great if you add those as well, more manual downloads..."
                                status="DONE"
                                statusColor="green"
                                members={["https://i.ibb.co/m0h65pk/Nft2.png"]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Kanban;
