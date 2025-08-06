import React, { useState, useCallback }  from 'react';
import { Link } from 'react-router-dom';
import {
    Role,
    useGetMeUserQuery,
    useGetUsersCountQuery,
    useGetVideosCountQuery,
    VideoProvider
} from '@/graphql/generated/graphql';
import { AlertTriangle, X } from 'lucide-react';
import { ImportSinglePage } from "@/components/Videos";
import { Modal } from '@/components/Modal';

export const DashboardPage: React.FC = () => {
    const [isImportOpen, setImportOpen] = useState<boolean>(false);

    const openImport  = useCallback(() => setImportOpen(true), []);
    const closeImport = useCallback(() => setImportOpen(false), []);

    // Data hooks
    const { data: meData, loading: meLoading, error: meError } = useGetMeUserQuery();
    const { data: vidsData, loading: vidsLoading, error: vidsError } = useGetVideosCountQuery({
        variables: {provider: VideoProvider.Youtube}
    });
    const { data: usersData, loading: usersLoading, error: usersError } = useGetUsersCountQuery();


        if (meLoading || vidsLoading || usersLoading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }
    if (meError) return <div className="p-8 text-red-600">Error: {meError.message}</div>;
    if (vidsError) return <div className="p-8 text-red-600">Error: {vidsError.message}</div>;
    if (usersError) return <div className="p-8 text-red-600">Error: {usersError.message}</div>;

    const user = meData?.me;
    const videoCount = vidsData?.connectionVideosCount ?? 0;
    const userCount  = usersData?.connectionUsersCount  ?? 0;
    const isAdmin    = user?.roles?.includes(Role.Admin);

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            {/* ALERT BANNER */}
            <div className="alert-banner">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                <p className="text-orange-700">
                    You have <strong>{videoCount}</strong>{' '}
                    videos pending review.
                </p>
            </div>

            {/* GREETING */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="mt-1 text-gray-600">Here’s what’s happening in your account.</p>
                </div>
                <button
                    onClick={openImport}
                    className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
                    style={{padding: 10, marginBottom: 10}}
                >
                    + Import Video
                </button>
            </header>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card" style={{ '--card-border-color': 'var(--color-primary)' } as any}>
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Videos</p>
                    <p className="mt-2 text-3xl font-semibold text-primary">{videoCount}</p>
                </div>
                {isAdmin && (
                    <div className="card" style={{ '--card-border-color': 'var(--color-secondary)' } as any}>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
                        <p className="mt-2 text-3xl font-semibold text-secondary">{userCount}</p>
                    </div>
                )}
                <div className="card" style={{ '--card-border-color': 'var(--color-success)' } as any}>
                    <p className="text-sm font-medium text-gray-500 uppercase">Your Role</p>
                    <p className="mt-2 text-2xl font-medium text-gray-700">
                        {user?.roles?.join(', ')}
                    </p>
                </div>
            </div>

            {/* QUICK ACTIONS TOOLBAR */}
            <div className="toolbar">
                <Link
                    to="/videos"
                >
                    • View All Videos
                </Link>
                {isAdmin && (
                    <Link
                        to="/users"
                    >
                        • Manage Users
                    </Link>
                )}
                <Link
                    to="/videos/import/channel"
                >
                    • Import Channel
                </Link>
                {/* MODAL */}
                <Modal
                    isOpen={isImportOpen}
                    title="Import Video"
                    onClose={closeImport}
                    maxWidthClass="max-w-lg"
                >
                    {/* Your existing import form/component goes here */}
                    <ImportSinglePage />
                </Modal>

            </div>
        </div>
    );
}
