import React from 'react';
import { Link } from 'react-router-dom';
import {
    Role,
    useGetMeUserQuery,
    useGetUsersCountQuery,
    useGetVideosCountQuery,
    VideoProvider
} from '@/graphql/generated/graphql';

export const DashboardPage: React.FC = () => {
    // 1) Fetch current user
    const { data: meData, loading: meLoading, error: meError } = useGetMeUserQuery();
    const { data: vidsData, loading: vidsLoading, error: vidsError } = useGetVideosCountQuery({
        variables: {provider: VideoProvider.Youtube}
    });
    const { data: usersData, loading: usersLoading, error: usersError } = useGetUsersCountQuery();

    if (meLoading || vidsLoading || usersLoading) {
        return <p className="text-center mt-20">Loading dashboard…</p>;
    }
    if (meError) return <p className="text-red-600">Error: {meError.message}</p>;
    if (vidsError) return <p className="text-red-600">Error loading videos: {vidsError.message}</p>;
    if (usersError) return <p className="text-red-600">Error loading users: {usersError.message}</p>;

    const user = meData?.me;
    const videoCount = vidsData?.connectionVideosCount ?? 0;
    const userCount  = usersData?.connectionUsersCount  ?? 0;
    const isAdmin    = user?.roles?.includes(Role.Admin);

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Here’s your project overview.
                </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Total Videos</span>
                    <span className="mt-2 text-3xl font-semibold text-primary">{videoCount}</span>
                </div>
                {isAdmin && (
                    <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Total Users</span>
                        <span className="mt-2 text-3xl font-semibold text-primary">{userCount}</span>
                    </div>
                )}
                <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Your Role</span>
                    <span className="mt-2 text-xl font-medium text-gray-700">{user?.roles?.join(', ')}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/videos/import"
                        className="flex-1 min-w-[200px] bg-primary text-white py-3 rounded-lg text-center hover:bg-primary/90 transition"
                    >
                        Import Single Video
                    </Link>
                    <Link
                        to="/videos/import/channel"
                        className="flex-1 min-w-[200px] bg-secondary text-white py-3 rounded-lg text-center hover:bg-secondary/90 transition"
                    >
                        Import Channel
                    </Link>
                    {isAdmin && (
                        <Link
                            to="/users"
                            className="flex-1 min-w-[200px] bg-green-600 text-white py-3 rounded-lg text-center hover:bg-green-700 transition"
                        >
                            Manage Users
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
