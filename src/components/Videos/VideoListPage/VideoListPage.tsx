import React, { useState } from "react";
import {
  VideoProvider,
  VideoSort,
  useGetConnectionVideosQuery,
} from "@/graphql/generated/graphql";
import { formatDistanceToNow, parseISO } from "date-fns";

export const VideoListPage: React.FC = () => {
  // 1) Table state: pagination, filter, sort
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const providers: (VideoProvider | "ALL")[] = [
    "ALL",
    ...Object.values(VideoProvider).filter(
      (v): v is VideoProvider => typeof v === "string",
    ),
  ];
  const [providerFilter, setProviderFilter] = useState<"ALL" | VideoProvider>(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<VideoSort>(VideoSort.ImportedAt);
  const [sortDesc, setSortDesc] = useState(true);

  // 2) Fetch from server with variables :contentReference[oaicite:3]{index=3}
  const { data, loading, error } = useGetConnectionVideosQuery({
    variables: {
      page,
      pageSize,
      provider: providerFilter === "ALL" ? undefined : providerFilter,
      sortBy,
      sortDesc,
    },
    fetchPolicy: "cache-and-network",
  });

  // 3) Handlers
  const toggleSort = (field: VideoSort) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
    setPage(1);
  };
  const total = data?.connectionVideos?.total ?? 0;
  const items = data?.connectionVideos?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Videos</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Provider Filter */}
        <select
          value={providerFilter}
          onChange={(e) => {
            setProviderFilter(e.target.value as any);
            setPage(1);
          }}
          className="max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p === "ALL"
                ? "All Providers"
                : p.charAt(0) + p.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        {/* Pagination Info */}
        <div className="text-gray-600">
          Page {page} of {Math.ceil(total / pageSize) || 1}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort(VideoSort.Title)}
              >
                Title {sortBy === VideoSort.Title && (sortDesc ? "↓" : "↑")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => toggleSort(VideoSort.UploadDate)}
              >
                Upload Date{" "}
                {sortBy === VideoSort.UploadDate && (sortDesc ? "↓" : "↑")}
              </th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Imported</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-red-600">
                  Error: {error.message}
                </td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No videos found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              items
                .filter((v) => v !== null)
                .map((video) => (
                  <tr key={video.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{video.title}</td>
                    <td className="px-4 py-2">
                      {video.uploadDate &&
                        new Date(video.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{video.videoProvider}</td>
                    <td className="px-4 py-2">{video.videoCategory}</td>
                    <td className="px-4 py-2">
                      {!video.durationMs
                        ? 0
                        : Math.floor(video.durationMs / 60000)}
                      :
                      {!video.durationMs
                        ? ""
                        : String(
                            Math.floor((video.durationMs % 60000) / 1000),
                          ).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-2">
                      {video.uploadDate &&
                        formatDistanceToNow(parseISO(video.uploadDate), {
                          addSuffix: true,
                        })}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => (p * pageSize < total ? p + 1 : p))}
          disabled={page * pageSize >= total}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
