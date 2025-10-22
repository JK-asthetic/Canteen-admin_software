"use client";

import { useEffect, useState } from "react";
import { Package, Eye, Plus, Edit, ArrowLeft } from "lucide-react";
import { getItems, createItem, updateItem, deleteItem } from "@/api/item";
import { Item, CreateItemDto, UpdateItemDto } from "@/types/Item.types";
import { ViewStock } from "@/components/items/ViewStock";
import { AddStock } from "@/components/items/AddStock";
import { EditStock } from "@/components/items/EditStock";
import { useRouter } from "next/navigation";

export default function ManageStock() {
  const [stockItems, setStockItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState("view");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const items = await getItems();
        setStockItems(items);
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to fetch items");
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const handleAddItem = async (newItem: CreateItemDto) => {
    try {
      setLoading(true);
      const createdItem = await createItem(newItem);
      setStockItems([...stockItems, createdItem]);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
    }
    setLoading(false);
  };

  const handleEditItem = async (id: string, updatedData: UpdateItemDto) => {
    try {
      setLoading(true);
      const updatedItem = await updateItem(id, updatedData);
      setStockItems(
        stockItems.map((item) => (item._id === id ? updatedItem : item))
      );
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    }
    setLoading(false);
  };

  const menuItems = [
    { id: "view", label: "View Items", icon: Eye, color: "purple" },
    { id: "add", label: "Add Item", icon: Plus, color: "blue" },
    { id: "edit", label: "Edit Item", icon: Edit, color: "green" },
  ];

  const getActiveItemCount = () =>
    stockItems.filter((item) => item.is_active).length;

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-75 bg-white shadow-xl flex flex-col border-r-2 border-purple-200">
        <div className="p-8 border-b-2 border-gray-100 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center">
            <div className="bg-white rounded-xl p-3 mr-4 shadow-lg">
              <Package className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage</h1>
              <p className="text-sm text-purple-100">Items</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? `bg-${item.color}-100 text-${item.color}-700`
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t-2 border-gray-100 bg-gray-50 space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-md border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Active Items
            </p>
            <p className="text-4xl font-bold text-purple-600">
              {getActiveItemCount()}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col bg-gradient-to-br from-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-2 border-purple-200 p-5">
          <div className="max-w-full flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {activeTab === "view" && "View and manage your item inventory"}
                {activeTab === "add" && "Add a new item to your inventory"}
                {activeTab === "edit" &&
                  "Modify existing items in your inventory"}
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="w-full h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "view" && <ViewStock items={stockItems} />}
                {activeTab === "add" && <AddStock onAdd={handleAddItem} />}
                {activeTab === "edit" && (
                  <EditStock items={stockItems} onEdit={handleEditItem} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
