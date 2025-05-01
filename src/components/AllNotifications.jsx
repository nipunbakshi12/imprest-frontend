import React, { useEffect, useState } from 'react';
import { Bell, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';

const AllNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/imprest/getAllNotification');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Response", data);
                setNotifications(data?.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch notifications');
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertCircle className="text-red-500" />;
            case 'success':
                return <CheckCircle className="text-green-500" />;
            case 'info':
                return <Info className="text-blue-500" />;
            default:
                return <Bell className="text-gray-500" />;
        }
    };

    // Format timestamp to relative time (e.g. "2 hours ago")
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return past.toLocaleDateString();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" />
                    <span className="text-red-800">{error}</span>
                </div>
                <button
                    className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <Bell className="mr-2" />
                    Notifications
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {notifications.length} new
                </span>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="flex justify-center">
                        <Bell className="text-gray-400 h-12 w-12" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-2 text-gray-500">You're all caught up!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {notifications.map((noti, index) => (
                        <div
                            key={index}
                            className={`p-4 hover:bg-gray-50 transition-colors ${!noti.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(noti.type)}
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="text-sm font-medium text-gray-900">{noti.message}</div>
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {getRelativeTime(noti.createdAt)}
                                    </div>
                                </div>
                                {!noti.read && (
                                    <div className="flex-shrink-0">
                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllNotifications;