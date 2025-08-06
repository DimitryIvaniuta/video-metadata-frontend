import React, { useState, ChangeEvent } from "react";
import { useConnectionUsersQuery, UserSort } from "@/graphql/generated/graphql";
import { formatDistanceToNow, parseISO } from "date-fns";

export const UserListPage: React.FC = () => {
  // --- State for pagination, search, sorting ---
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<UserSort>(UserSort.Username);
  const [sortDesc, setSortDesc] = useState(false);

  // --- GraphQL query ---
  const { data, loading, error } = useConnectionUsersQuery({
    variables: {
      page,
      pageSize,
      search: search.trim() !== "" ? search : undefined,
      sortBy,
      sortDesc,
    },
    fetchPolicy: "cache-and-network",
  });

  const total = data?.connectionUsers?.total ?? 0;
  const items = data?.connectionUsers?.items ?? [];

  // --- Handlers ---
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleSort = (field: UserSort) => {
    if (sortBy === field) {
      setSortDesc((d) => !d);
    } else {
      setSortBy(field);
      setSortDesc(false);
    }
    setPage(1);
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Users</h1>

      {/* Search & pagination info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by username or email…"
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
        />
        <div className="text-gray-600">
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => toggleSort(UserSort.Username)}
              >
                Username{" "}
                {sortBy === UserSort.Username && (sortDesc ? "↓" : "↑")}
              </th>
              <th
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => toggleSort(UserSort.Email)}
              >
                Email {sortBy === UserSort.Email && (sortDesc ? "↓" : "↑")}
              </th>
              <th className="px-4 py-2">Roles</th>
              <th
                className="px-4 py-2 cursor-pointer select-none"
                onClick={() => toggleSort(UserSort.CreatedAt)}
              >
                Created{" "}
                {sortBy === UserSort.CreatedAt && (sortDesc ? "↓" : "↑")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-red-600">
                  Error: {error.message}
                </td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              items
                .filter((u) => u !== null && u !== undefined)
                .map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.roles?.join(", ")}</td>
                    <td className="px-4 py-2">
                      {user.createdAt &&
                        formatDistanceToNow(parseISO(user.createdAt), {
                          addSuffix: true,
                        })}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
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
