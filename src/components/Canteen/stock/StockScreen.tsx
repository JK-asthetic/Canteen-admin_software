"use client";

import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Search,
  Plus,
  History,
  X,
  Edit2,
  Save,
  BarChart3,
  Minus,
} from "lucide-react";
import * as stockApi from "@/api/stock";
import { Stock, StockHistory } from "@/api/stock";

interface StockComponentProps {
  canteenId: string;
}

export default function StockComponent({ canteenId }: StockComponentProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyDays, setHistoryDays] = useState(7);

  useEffect(() => {
    fetchStocks();
  }, [canteenId]);

  useEffect(() => {
    filterStocks();
  }, [searchQuery, stocks]);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await stockApi.getStockByCanteen(canteenId);
      setStocks(data);
      setFilteredStocks(data);
    } catch (err: any) {
      console.error("Error fetching stocks:", err);
      setError(err.error || "Failed to load stock data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStocks();
    setIsRefreshing(false);
  };

  const filterStocks = () => {
    if (!searchQuery.trim()) {
      setFilteredStocks(stocks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = stocks.filter(
      (stock) =>
        stock.item_id.name.toLowerCase().includes(query) ||
        stock.item_id.category?.name?.toLowerCase().includes(query) ||
        stock.item_id.description.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
  };

  const openUpdateModal = (stock: Stock) => {
    setSelectedStock(stock);
    setUpdateQuantity(stock.quantity.toString());
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedStock(null);
    setUpdateQuantity("");
  };

  const handleUpdateStock = async () => {
    if (!selectedStock) return;

    const newQuantity = parseInt(updateQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      await stockApi.updateStock({
        canteen_id: canteenId,
        item_id: selectedStock.item_id._id,
        quantity: newQuantity,
      });
      await fetchStocks();
      closeUpdateModal();
    } catch (err: any) {
      console.error("Error updating stock:", err);
      alert(err.error || "Failed to update stock");
    }
  };

  const openHistoryModal = async (stock: Stock) => {
    setSelectedStock(stock);
    setShowHistoryModal(true);
    await fetchStockHistory(stock.item_id._id);
  };

  const fetchStockHistory = async (itemId: string) => {
    try {
      setHistoryLoading(true);
      const data = await stockApi.getStockHistory(canteenId, itemId, historyDays);
      setStockHistory(data);
    } catch (err: any) {
      console.error("Error fetching stock history:", err);
      alert(err.error || "Failed to load stock history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedStock(null);
    setStockHistory([]);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "red" };
    if (quantity < 50) return { label: "Low Stock", color: "yellow" };
    return { label: "In Stock", color: "green" };
  };

  const adjustQuantity = (delta: number) => {
    const currentQty = parseInt(updateQuantity) || 0;
    const newQty = Math.max(0, currentQty + delta);
    setUpdateQuantity(newQty.toString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Stock
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchStocks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Stock Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track inventory levels
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search items by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stock Grid */}
      {filteredStocks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? "No items found" : "No stock data available"}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search query"
              : "Stock items will appear here once added"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map((stock) => {
            const status = getStockStatus(stock.quantity);
            return (
              <div
                key={stock._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {stock.item_id.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {stock.item_id.description}
                    </p>
                    {stock.item_id.category && (
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {stock.item_id.category.name}
                      </span>
                    )}
                  </div>
                  <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Stock:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {stock.quantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unit:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stock.item_id.unit?.abbreviation || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status.color === "green"
                          ? "bg-green-100 text-green-800"
                          : status.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">MRP:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{stock.item_id.mrp}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Last updated:{" "}
                      {new Date(stock.updated_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* <button
                    onClick={() => openUpdateModal(stock)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Update</span>
                  </button> */}
                  <button
                    onClick={() => openHistoryModal(stock)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <History className="w-4 h-4" />
                    <span>History</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Update Stock
              </h3>
              <button
                onClick={closeUpdateModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Item
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedStock.item_id.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Current Stock
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedStock.quantity} {selectedStock.item_id.unit?.abbreviation || ""}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  New Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => adjustQuantity(-10)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <input
                    type="number"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl font-semibold"
                  />
                  <button
                    onClick={() => adjustQuantity(10)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {parseInt(updateQuantity) !== selectedStock.quantity && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    Change:
                  </span>
                  <span
                    className={`flex items-center text-sm font-semibold ${
                      parseInt(updateQuantity) > selectedStock.quantity
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {parseInt(updateQuantity) > selectedStock.quantity ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(parseInt(updateQuantity) - selectedStock.quantity)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeUpdateModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {showHistoryModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Stock History
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStock.item_id.name}
                </p>
              </div>
              <button
                onClick={closeHistoryModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Show last:
                </label>
                <select
                  value={historyDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value);
                    setHistoryDays(days);
                    fetchStockHistory(selectedStock.item_id._id);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value={7}>7 days</option>
                  <option value={15}>15 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : stockHistory.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No history data available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stockHistory.map((history) => (
                    <div
                      key={history._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(history.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Opening Stock
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {history.opening_stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Closing Stock
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {history.closing_stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Received</p>
                          <p className="text-lg font-semibold text-green-600">
                            +{history.received_stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Sold</p>
                          <p className="text-lg font-semibold text-red-600">
                            -{history.sold_stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}