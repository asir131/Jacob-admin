'use client';
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Storage from '@/components/profile/Storage';
import Upload from '@/components/profile/Upload';
import Project from '@/components/profile/Project';
import General from '@/components/profile/General';
import Notification from '@/components/profile/Notification';

const Profile = () => {
    return (
        <AdminLayout>
            <div className="flex w-full flex-col gap-5 dark:!bg-navy-900">
                <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
                    <div className="col-span-4 lg:!mb-0">
                        <ProfileHeader />
                    </div>
                    <div className="col-span-3 lg:!mb-0">
                        <Storage />
                    </div>
                    <div className="col-span-5 lg:!mb-0">
                        <Upload />
                    </div>
                </div>

                <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
                    <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
                            All Projects
                        </h4>
                        <p className="mb-4 text-base font-medium text-gray-600">
                            Here you can find more details about your projects. Keep you user engaged by providing meaningful information.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Project
                                title="Technology behind the Blockchain"
                                ranking={1}
                                link="#"
                                image="https://i.ibb.co/m0h65pk/Nft2.png"
                            />
                            <Project
                                title="Greatest way to a good Economy"
                                ranking={2}
                                link="#"
                                image="https://i.ibb.co/hR4yX06/Nft3.png"
                            />
                            <Project
                                title="Most essential tips for Burnout"
                                ranking={3}
                                link="#"
                                image="https://i.ibb.co/W3M55f5/Nft4.png"
                            />
                        </div>
                    </div>

                    <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
                        <General />
                    </div>

                    <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
                        <Notification />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Profile;
