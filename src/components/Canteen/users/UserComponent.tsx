"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Mail,
  Building,
  RefreshCw,
  AlertCircle,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { User } from "@/types/user.types";
import { getUsers } from "@/api/user";

interface UserComponentProps {
  canteenId: string;
}

export default function UserComponent({ canteenId }: UserComponentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "manager">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Fetch ONLY users that belong to this canteen
  // -----------------------------------------------------------------
  const fetchCanteenUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getUsers({
        canteen_id: canteenId, // <-- server-side filter
        // limit: 200,
      });
      console.log("Fetched canteen users:", data);

      // Extra safety: keep only users whose canteen_id really matches
      const matched = data.filter((u) => {
        if (typeof u.canteen_id === "object") {
          return u.canteen_id._id === canteenId;
        }
        return u.canteen_id === canteenId;
      });

      setUsers(matched);
      setFilteredUsers(matched);
    } catch (err: any) {
      console.error("Error fetching canteen users:", err);
      setError(err.error || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCanteenUsers();
    setIsRefreshing(false);
  };

  // -----------------------------------------------------------------
  // Client-side search + role filter
  // -----------------------------------------------------------------
  useEffect(() => {
    let list = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => {
        const canteenName =
          typeof u.canteen_id === "object"
            ? u.canteen_id.name?.toLowerCase()
            : "";
        return (
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          canteenName.includes(q)
        );
      });
    }

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(list);
  }, [searchQuery, users, roleFilter]);

  // -----------------------------------------------------------------
  // Load on mount / canteen change
  // -----------------------------------------------------------------
  useEffect(() => {
    if (canteenId) fetchCanteenUsers();
  }, [canteenId]);

  // -----------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md mx-auto">
        <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">
          Failed to Load Users
        </h3>
        <p className="text-red-700 mb-6">{error}</p>
        <button
          onClick={fetchCanteenUsers}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assigned Users</h1>
          <p className="text-gray-600 mt-1">
            Users linked to this canteen only
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md disabled:opacity-60"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search + Role Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-800 placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-800"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Cards */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
          <UserIcon className="w-20 h-20 text-gray-300 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery || roleFilter !== "all"
              ? "No matching users"
              : "No users assigned"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || roleFilter !== "all"
              ? "Try adjusting your search or filter"
              : "This canteen has no assigned users yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const canteen =
              typeof user.canteen_id === "object" ? user.canteen_id : null;

            return (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3">
                    <UserIcon className="w-7 h-7 text-blue-700" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <UserCheck className="w-3 h-3" />
                    )}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">@{user.username}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {canteen && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{canteen.name}</p>
                        <p className="text-xs text-gray-500">
                          {canteen.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <p>
                    Joined:{" "}
                    {new Date(user.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
