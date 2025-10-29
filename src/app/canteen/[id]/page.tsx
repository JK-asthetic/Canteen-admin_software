"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Store,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  FileText,
  Info,
  Menu,
  X,
  RefreshCw,
  Lock,
  Unlock,
  ArrowLeft,
  AlertCircle,
  Calendar,
} from "lucide-react";
import SalesComponent from "@/components/Canteen/sale/SaleComponent";
import * as canteenApi from "@/api/canteen";
import { Canteen } from "@/types/supply.types";
import StockComponent from "@/components/Canteen/stock/StockScreen";
import SupplyComponent from "@/components/Canteen/supply/SupplyScreen";
import UserComponent from "@/components/Canteen/users/UserComponent";

// Mock data for sections not yet implemented
const mockStockItems = [
  { id: 1, name: "Samosa", stock: 150, minStock: 50, status: "good" },
  { id: 2, name: "Tea Cups", stock: 45, minStock: 100, status: "low" },
  { id: 3, name: "Sandwich Bread", stock: 20, minStock: 30, status: "low" },
  { id: 4, name: "Coffee Powder", stock: 200, minStock: 50, status: "good" },
];

const mockSupplies = [
  {
    id: 1,
    supplier: "Fresh Foods Ltd",
    item: "Vegetables",
    lastDelivery: "2024-10-25",
    nextDelivery: "2024-10-27",
  },
  {
    id: 2,
    supplier: "Dairy Products Co",
    item: "Milk & Dairy",
    lastDelivery: "2024-10-24",
    nextDelivery: "2024-10-26",
  },
  {
    id: 3,
    supplier: "Snacks Wholesale",
    item: "Packaged Snacks",
    lastDelivery: "2024-10-20",
    nextDelivery: "2024-10-30",
  },
];

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    role: "Manager",
    contact: "+91 9876543210",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Staff",
    contact: "+91 9876543211",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Staff",
    contact: "+91 9876543212",
    status: "active",
  },
];

export default function CanteenDashboard() {
  const params = useParams();
  const router = useRouter();
  const canteenId = params?.id as string;

  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [activeSection, setActiveSection] = useState("sales");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "stock", label: "Stock", icon: Package },
    { id: "supply", label: "Supply", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "about", label: "About", icon: Info },
  ];

  // Fetch canteen data on mount
  useEffect(() => {
    if (canteenId) {
      fetchCanteenData();
    }
  }, [canteenId]);

  useEffect(() => {
    import("@/lib/units-cache").then(({ getUnits }) => {
      getUnits().catch(console.error);
    });
  }, []);

  const fetchCanteenData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await canteenApi.getCanteenById(canteenId);
      setCanteen(data);
    } catch (err: any) {
      console.error("Error fetching canteen:", err);
      setError(err.error || "Failed to load canteen data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCanteenData();
    setIsRefreshing(false);
  };

  const handleLockToggle = async () => {
    if (!canteen) return;

    try {
      if (canteen.is_locked) {
        await canteenApi.unlockCanteen(canteen._id);
      } else {
        const reason = prompt("Enter reason for locking canteen:");
        if (reason) {
          await canteenApi.lockCanteen(canteen._id, reason);
        } else {
          return;
        }
      }
      await fetchCanteenData();
    } catch (err: any) {
      console.error("Error toggling lock:", err);
      alert(err.error || "Failed to update canteen lock status");
    }
  };

  const renderContent = () => {
    if (!canteen) return null;

    switch (activeSection) {
      case "sales":
        return <SalesComponent canteenId={canteenId} />;

      case "stock":
        return <StockComponent canteenId={canteenId} />;

      case "supply":
        return <SupplyComponent canteenId={canteenId} />;

      case "users":
        return <UserComponent canteenId={canteenId} />;

      case "about":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Canteen Information
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-lg text-gray-900">{canteen.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Type
                  </label>
                  <p className="text-lg text-gray-900 capitalize">
                    {canteen.type}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <p className="text-lg text-gray-900">{canteen.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Contact Number
                  </label>
                  <p className="text-lg text-gray-900">
                    {canteen.contact_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <p className="text-lg">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        canteen.is_locked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {canteen.is_locked ? "Locked" : "Active"}
                    </span>
                  </p>
                </div>
                {canteen.is_locked && canteen.lock_reason && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Lock Reason
                    </label>
                    <p className="text-lg text-red-700">
                      {canteen.lock_reason}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created At
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(canteen.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading canteen data...</p>
        </div>
      </div>
    );
  }

  if (error || !canteen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Canteen
          </h3>
          <p className="text-gray-600 mb-6">{error || "Canteen not found"}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={fetchCanteenData}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <Store className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-900">Dashboard</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Main</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {canteen.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{canteen.location}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={handleLockToggle}
                  className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                    canteen.is_locked
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {canteen.is_locked ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Unlock</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Lock</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
