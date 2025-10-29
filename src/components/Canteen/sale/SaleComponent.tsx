"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package,
  TrendingUp,
  X,
  AlertCircle,
  RefreshCw,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import * as salesApi from "@/api/sale";
import type { Sale, SalesSummaryByDate } from "@/api/sale";

interface SalesComponentProps {
  canteenId: string;
}

interface SalesSummary {
  totalSales: number;
  totalCash: number;
  totalOnline: number;
  totalItems: number;
  salesCount: number;
}

interface ItemSummary {
  itemId: string;
  itemName: string;
  unit: string;
  totalQuantity: number;
  totalRevenue: number;
  unitPrice: number;
}

const SalesComponent: React.FC<SalesComponentProps> = ({ canteenId }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<"date" | "items">("date");

  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default: last 7 days
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Summary calculations
  const summary: SalesSummary = {
    totalSales: sales.reduce((sum, sale) => sum + sale.total_amount, 0),
    totalCash: sales.reduce((sum, sale) => sum + sale.cash_amount, 0),
    totalOnline: sales.reduce((sum, sale) => sum + sale.online_amount, 0),
    totalItems: sales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    ),
    salesCount: sales.length,
  };

  // Item summary calculations
  // In SalesComponent
  const itemsSummary: ItemSummary[] = (() => {
    const itemsMap = new Map<string, ItemSummary>();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const key = item.item_id._id;
        const unitObj = item.item_id.unit;

        if (itemsMap.has(key)) {
          const existing = itemsMap.get(key)!;
          existing.totalQuantity += item.quantity;
          existing.totalRevenue += item.total_price;
        } else {
          itemsMap.set(key, {
            itemId: key,
            itemName: item.item_id.name,
            unit: unitObj?.abbreviation || unitObj?.name || "—",
            totalQuantity: item.quantity,
            totalRevenue: item.total_price,
            unitPrice: item.unit_price,
          });
        }
      });
    });

    return Array.from(itemsMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );
  })();

  useEffect(() => {
    if (canteenId) {
      fetchSales();
    }
  }, [startDate, endDate, canteenId]);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      // Convert UI dates to full-day UTC ranges for created_at
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Fetch ALL sales in the created_at range
      const rawSales: Sale[] = await salesApi.getSalesInCreatedAtRange(
        start.toISOString(),
        end.toISOString(),
        canteenId
      );

      if (!rawSales || rawSales.length === 0) {
        setSales([]);
        setError("No sales found for the selected date range");
        return;
      }

      // Group sales by created_at date (YYYY-MM-DD)
      const salesByDate: Record<string, Sale> = {};

      rawSales.forEach((sale) => {
        const createdDate = new Date(sale.created_at!);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const istDate = new Date(createdDate.getTime() + istOffset);

        const dateKey = istDate.toISOString().split("T")[0]; // e.g., 2025-10-07 in IST
        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = {
            _id: dateKey,
            canteen_id: canteenId,
            date: dateKey, // This is now the created_at date
            total_amount: 0,
            cash_amount: 0,
            online_amount: 0,
            items: [],
          };
        }

        const daySale = salesByDate[dateKey];
        daySale.total_amount += sale.total_amount;
        daySale.cash_amount += sale.cash_amount;
        daySale.online_amount += sale.online_amount;
        daySale.items.push(...sale.items);
      });

      // Generate full date range (to show empty days)
      const startRange = new Date(startDate);
      const endRange = new Date(endDate);
      const fullRange: Sale[] = [];

      for (
        let d = new Date(startRange);
        d <= endRange;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        if (salesByDate[dateStr]) {
          fullRange.push(salesByDate[dateStr]);
        } else {
          fullRange.push({
            _id: dateStr,
            canteen_id: canteenId,
            date: dateStr,
            total_amount: 0,
            cash_amount: 0,
            online_amount: 0,
            items: [],
          });
        }
      }

      // Sort descending
      const sortedSales = fullRange.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setSales(sortedSales);
    } catch (err: any) {
      console.error("Error fetching sales:", err);
      setError(err.error || err.message || "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaleExpansion = (saleId: string) => {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedSales(newExpanded);
  };

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  const filteredSales = sales.filter((sale) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return sale.items.some((item) =>
      item.item_id.name.toLowerCase().includes(searchLower)
    );
  });

  const filteredItems = itemsSummary.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return item.itemName.toLowerCase().includes(searchLower);
  });

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Item",
      "Quantity",
      "Unit",
      "Unit Price",
      "Total",
      "Cash Amount",
      "Online Amount",
    ];
    const rows: string[][] = [];

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        rows.push([
          sale.date,
          `"${item.item_id.name}"`,
          item.quantity.toString(),
          item.item_id.unit,
          item.unit_price.toString(),
          item.total_price.toString(),
          sale.cash_amount.toString(),
          sale.online_amount.toString(),
        ]);
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and analyze sales data for your canteen
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("date")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "date"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-medium">By Date</span>
            </button>
            <button
              onClick={() => setViewMode("items")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "items"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">By Items</span>
            </button>
          </div>
          <button
            onClick={fetchSales}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={sales.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range & Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Date Range Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {new Date(startDate).toLocaleDateString()} -{" "}
                    {new Date(endDate).toLocaleDateString()}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    {/* Quick Select Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickDateRange(7)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Last 7 days
                      </button>
                      <button
                        onClick={() => handleQuickDateRange(30)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Last 30 days
                      </button>
                      <button
                        onClick={() => handleQuickDateRange(90)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Last 90 days
                      </button>
                    </div>

                    {/* Custom Date Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={endDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Items
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchSales}
            className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹
                {summary.totalSales.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-green-600 font-medium">
              Cash: ₹{summary.totalCash.toLocaleString("en-IN")}
            </span>
            <span className="mx-2">•</span>
            <span className="text-purple-600 font-medium">
              Online: ₹{summary.totalOnline.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items Sold</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary.totalItems.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sales Days</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary.salesCount}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Daily Sales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹
                {summary.salesCount > 0
                  ? Math.round(
                      summary.totalSales / summary.salesCount
                    ).toLocaleString("en-IN")
                  : 0}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Sales List */}
      {!loading && (
        <div className="space-y-4">
          {viewMode === "date" ? (
            // Date View
            <>
              {filteredSales.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Sales Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search term or date range"
                      : "No sales recorded for the selected date range"}
                  </p>
                </div>
              ) : (
                filteredSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Sale Header */}
                    <div
                      onClick={() => toggleSaleExpansion(sale._id)}
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {new Date(sale.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {sale.items.length} items •{" "}
                              {sale.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}{" "}
                              units sold
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ₹
                              {sale.total_amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">
                                Cash:{" "}
                                <span className="font-medium text-green-600">
                                  ₹{sale.cash_amount.toLocaleString("en-IN")}
                                </span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Online:{" "}
                                <span className="font-medium text-purple-600">
                                  ₹{sale.online_amount.toLocaleString("en-IN")}
                                </span>
                              </span>
                            </div>
                          </div>
                          {expandedSales.has(sale._id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Sale Items */}
                    {expandedSales.has(sale._id) && sale.items.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Item Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                  Unit
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                  Quantity
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                  Unit Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {sale.items.map((item, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-white transition-colors"
                                >
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {item.item_id.name}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.item_id.unit?.abbreviation ||
                                      item.item_id.unit?.name ||
                                      "—"}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                    ₹{item.unit_price.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                                    ₹{item.total_price.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          ) : (
            // Items View
            <>
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Items Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search term"
                      : "No items sold in the selected date range"}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                            Item Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                            Unit
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                            Total Quantity
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                            Avg Unit Price
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                            Total Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredItems.map((item, index) => (
                          <tr
                            key={item.itemId}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 rounded-lg p-2">
                                  <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {item.itemName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.unit}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                              {item.totalQuantity.toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-right">
                              ₹{item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                              ₹
                              {item.totalRevenue.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                        <tr>
                          <td
                            colSpan={2}
                            className="px-6 py-4 text-sm font-bold text-gray-900"
                          >
                            TOTAL
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                            {filteredItems
                              .reduce(
                                (sum, item) => sum + item.totalQuantity,
                                0
                              )
                              .toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                            ₹
                            {filteredItems
                              .reduce((sum, item) => sum + item.totalRevenue, 0)
                              .toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesComponent;
