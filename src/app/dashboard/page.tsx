"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Users,
  Package,
  AlertCircle,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import * as canteenApi from "@/api/canteen";
import { CanteenWithStats } from "@/types/canteen.types";

export default function MainDashboard() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [canteenList, setCanteenList] = useState<CanteenWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch canteens on component mount
  useEffect(() => {
    fetchCanteens();
  }, []);

  const fetchCanteens = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const canteens = await canteenApi.getCanteens({ include_locked: true });
      setCanteenList(canteens);
    } catch (err: any) {
      console.error("Error fetching canteens:", err);
      setError(err.error || "Failed to load canteens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanteenClick = (canteenId: string): void => {
    // router.push(`/canteen/${canteenId}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Canteen Management System
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all your canteen branches from one place
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push(`/canteen/manage`)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manage Canteens
              </h3>
              <p className="text-sm text-gray-500">
                Add, edit, or remove canteen branches
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push(`/items`)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-green-300 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manage Items
              </h3>
              <p className="text-sm text-gray-500">
                Update inventory and menu items
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push(`/users`)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 rounded-full p-4 mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-gray-500">
                Add or manage staff and permissions
              </p>
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchCanteens}
              className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Canteens Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Canteens ({canteenList.length})
          </h2>
          <button
            onClick={fetchCanteens}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Empty State */}
        {!isLoading && canteenList.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Canteens Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first canteen
            </p>
            <button
              onClick={() => router.push(`/canteen/manage`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Canteen
            </button>
          </div>
        )}

        {/* Canteens Grid */}
        {canteenList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canteenList.map((canteen) => (
              <div
                key={canteen._id}
                onClick={() =>
                  !canteen.is_locked && handleCanteenClick(canteen._id)
                }
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                  canteen.is_locked
                    ? "opacity-75 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg hover:border-blue-300 transform hover:-translate-y-1"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`rounded-lg p-3 ${
                      canteen.is_locked ? "bg-red-100" : "bg-blue-100"
                    }`}
                  >
                    {canteen.is_locked ? (
                      <Lock className="w-8 h-8 text-red-600" />
                    ) : (
                      <Store className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        canteen.type === "main"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {canteen.type === "main" ? "Main" : "Sub"}
                    </span>
                    {canteen.is_locked && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {canteen.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{canteen.location}</p>

                {canteen.is_locked && canteen.lock_reason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-800 font-medium">
                      Lock Reason:
                    </p>
                    <p className="text-xs text-red-700">
                      {canteen.lock_reason}
                    </p>
                  </div>
                )}

                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium text-gray-900">
                      {canteen.contact_number}
                    </span>
                  </div>
                  {canteen.totalItems !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">
                        {canteen.totalItems}
                      </span>
                    </div>
                  )}
                  {canteen.todaySales !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Today's Sales:</span>
                      <span className="font-medium text-green-600">
                        ₹{canteen.todaySales.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {!canteen.is_locked && (
                  <button className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-colors">
                    Open Dashboard
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
