"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Store,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ChefHat,
  TrendingUp,
} from "lucide-react";
import { EditCanteen } from "@/components/Canteen/Edit";
import { AddCanteen } from "@/components/Canteen/add";
import { useRouter } from "next/navigation";
import { getCanteens, createCanteen, updateCanteen } from "@/api/canteen";
import {
  Canteen,
  CreateCanteenDto,
  UpdateCanteenDto,
} from "@/types/canteen.types";

export default function ManageCanteen() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [activeTab, setActiveTab] = useState<"add" | "edit">("add");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCanteens();
  }, []);

  const loadCanteens = async () => {
    try {
      setLoading(true);
      const data = await getCanteens();
      setCanteens(data);
      setError(null);
    } catch (err) {
      setError("Failed to load canteens");
      console.error("Error loading canteens:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCanteen = useCallback(async (newCanteen: CreateCanteenDto) => {
    try {
      const created = await createCanteen(newCanteen);
      setCanteens(prevCanteens => [...prevCanteens, created]);
      alert("Canteen added successfully!");
    } catch (err) {
      console.error("Error adding canteen:", err);
      alert("Failed to add canteen!");
    }
  }, []);

  const handleEditCanteen = useCallback(async (
    id: string,
    updatedData: UpdateCanteenDto
  ) => {
    try {
      const updated = await updateCanteen(id, updatedData);
      setCanteens(prevCanteens => prevCanteens.map((c) => (c._id === id ? updated : c)));
      alert("Canteen updated successfully!");
    } catch (err) {
      console.error("Error updating canteen:", err);
      alert("Failed to update canteen!");
    }
  }, []);

  const menuItems = [
    {
      id: "add",
      label: "Add Canteen",
      icon: Plus,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: "edit",
      label: "Edit Canteen",
      icon: Edit,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
    },
  ] as const;

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col border-r border-gray-200/50">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-all hover:translate-x-1 duration-300 group"
          >
            <div className="bg-gray-100 rounded-lg p-1.5 mr-2 group-hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 ring-2 ring-white/30">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Canteen</h1>
                  <p className="text-sm text-blue-100 font-medium">
                    Management Hub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as "add" | "edit")}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    isActive
                      ? "shadow-lg scale-105"
                      : "hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      item.gradient
                    } transition-opacity duration-300 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-10"
                    }`}
                  ></div>
                  <div
                    className={`relative flex items-center px-5 py-4 ${
                      isActive
                        ? "text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 mr-4 transition-colors ${
                        isActive
                          ? "bg-white/20 backdrop-blur-sm"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Stats Footer */}
        <div className="p-6 border-t border-gray-200/50">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-lg border border-blue-200/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Total Canteens
                </p>
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <ChefHat className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {canteens.length}
              </p>
              <div className="flex items-center text-xs text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span className="font-semibold">Active Operations</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 p-8">
          <div className="max-w-full">
            <div className="flex items-center mb-3">
              <div
                className={`bg-gradient-to-r ${
                  activeTab === "add"
                    ? "from-emerald-500 to-teal-600"
                    : activeTab === "edit"
                    ? "from-blue-500 to-indigo-600"
                    : "from-rose-500 to-pink-600"
                } rounded-xl p-3 mr-4 shadow-lg`}
              >
                {activeTab === "add" && <Plus className="w-7 h-7 text-white" />}
                {activeTab === "edit" && (
                  <Edit className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {activeTab === "add" && "Add New Canteen"}
                  {activeTab === "edit" && "Edit Canteen Details"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === "add" &&
                    "Register a new canteen in the system"}
                  {activeTab === "edit" &&
                    "Update existing canteen information"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="w-full h-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading canteens...
                </p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 rounded-full p-3 mr-4">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900">Error</h3>
                  </div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 h-full overflow-auto">
                {activeTab === "add" && <AddCanteen onAdd={handleAddCanteen} />}
                {activeTab === "edit" && (
                  <EditCanteen canteens={canteens} onEdit={handleEditCanteen} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}