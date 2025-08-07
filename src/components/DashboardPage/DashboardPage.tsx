import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Role,
  useGetMeUserQuery,
  useGetUsersCountQuery,
  useGetVideosCountQuery,
  VideoProvider,
} from "@/graphql/generated/graphql";
import { AlertTriangle, X } from "lucide-react";
import { ImportSinglePage } from "@/components/Videos";
import { ImportChannelPage } from "@/components/Videos";

import { useModalDialog } from "@/hooks/useModalDialog";

export const DashboardPage = () => {
  // Single‐video modal
  const singleModal = useModalDialog(
    { title: "Import Single Video", maxWidthClass: "max-w-lg" },
    ({ close }) => <ImportSinglePage onImported={close} />,
  );

  // Channel import modal
  const channelModal = useModalDialog(
    { title: "Import Channel Videos", maxWidthClass: "max-w-lg" },
    ({ close }) => <ImportChannelPage onImported={close} />,
  );

  // Data hooks
  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useGetMeUserQuery();
  const {
    data: vidsData,
    loading: vidsLoading,
    error: vidsError,
  } = useGetVideosCountQuery({
    variables: { provider: VideoProvider.Youtube },
  });
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useGetUsersCountQuery();

  if (meLoading || vidsLoading || usersLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }
  if (meError)
    return <div className="p-8 text-red-600">Error: {meError.message}</div>;
  if (vidsError)
    return <div className="p-8 text-red-600">Error: {vidsError.message}</div>;
  if (usersError)
    return <div className="p-8 text-red-600">Error: {usersError.message}</div>;

  const user = meData?.me;
  const videoCount = vidsData?.connectionVideosCount ?? 0;
  const userCount = usersData?.connectionUsersCount ?? 0;
  const isAdmin = user?.roles?.includes(Role.Admin);

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* ALERT BANNER */}
      <div className="alert-banner">
        <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
        <p className="text-orange-700">
          You have <strong>{videoCount}</strong> videos pending review.
        </p>
      </div>

      {/* GREETING */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-1 text-gray-600">
            Here’s what’s happening in your account.
          </p>
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 20}}>
          <button className={'btn-secondary'} onClick={singleModal.open}>+ Import Video</button>
          <button className={'btn-secondary'} onClick={channelModal.open}>+ Import Channel</button>
        </div>
      </header>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="card"
          style={{ "--card-border-color": "var(--color-primary)" } as any}
        >
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total Videos
          </p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {videoCount}
          </p>
        </div>
        {isAdmin && (
          <div
            className="card"
            style={{ "--card-border-color": "var(--color-secondary)" } as any}
          >
            <p className="text-sm font-medium text-gray-500 uppercase">
              Total Users
            </p>
            <p className="mt-2 text-3xl font-semibold text-secondary">
              {userCount}
            </p>
          </div>
        )}
        <div
          className="card"
          style={{ "--card-border-color": "var(--color-success)" } as any}
        >
          <p className="text-sm font-medium text-gray-500 uppercase">
            Your Role
          </p>
          <p className="mt-2 text-2xl font-medium text-gray-700">
            {user?.roles?.join(", ")}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS TOOLBAR */}
      <div className="toolbar">
        <Link to="/videos">• View All Videos</Link>
        {isAdmin && <Link to="/users">• Manage Users</Link>}
        <Link to="/videos/import/channel">• Import Channel</Link>
        {/* MODAL */}
        {singleModal.dialog}
        {channelModal.dialog}
      </div>
    </div>
  );
};
