import React from "react";
import Card from "@/components/Card/Card";


const NotificationItem = ({ label }: { label: string }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <label className="text-base font-medium text-navy-700 dark:text-white mr-4">
                {label}
            </label>
            {/* Simple Custom Switch fallback */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
            </label>
        </div>
    )
}

const Notification = () => {
    return (
        <Card extra={"w-full h-full p-4"}>
            <div className="mb-4 w-full flex justify-between items-center">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    Notifications
                </h4>
                <div className="bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200">
                    ...
                </div>
            </div>

            <div className="flex flex-col">
                <NotificationItem label="Item update notifications" />
                <NotificationItem label="Item comment notifications" />
                <NotificationItem label="Buyer review notifications" />
                <NotificationItem label="Rating reminders notifications" />
                <NotificationItem label="Meetups near you notifications" />
                <NotificationItem label="Company news notifications" />
            </div>
        </Card>
    );
};

export default Notification;
