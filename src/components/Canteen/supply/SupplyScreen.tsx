// "use client";

// import { useState, useEffect } from "react";
// import {
//   Truck,
//   Package,
//   Calendar,
//   RefreshCw,
//   AlertCircle,
//   Search,
//   ChevronDown,
//   ChevronUp,
//   Building2,
//   User,
//   Clock,
//   Filter,
//   ArrowRight,
//   CheckCircle2,
//   PackageOpen,
//   X,
// } from "lucide-react";
// import { Supply, SupplyItem } from "@/types/supply.types";
// import { getSuppliesByCanteenId, getSupplyById } from "@/api/supply";

// interface SupplyComponentProps {
//   canteenId: string;
// }

// export default function SupplyComponent({ canteenId }: SupplyComponentProps) {
//   const [supplies, setSupplies] = useState<Supply[]>([]);
//   const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedSupplyId, setExpandedSupplyId] = useState<string | null>(null);
//   const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [filterPeriod, setFilterPeriod] = useState<
//     "all" | "today" | "week" | "month"
//   >("all");

//   useEffect(() => {
//     fetchSupplies();
//   }, [canteenId]);

//   useEffect(() => {
//     filterSupplies();
//   }, [searchQuery, supplies, filterPeriod]);

//   const fetchSupplies = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const data = await getSuppliesByCanteenId(canteenId);
//       // Sort by date descending (newest first)
//       const sortedData = data.sort(
//         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//       );
//       setSupplies(sortedData);
//       setFilteredSupplies(sortedData);
//     } catch (err: any) {
//       console.error("Error fetching supplies:", err);
//       setError(err.error || "Failed to load supply data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchSupplies();
//     setIsRefreshing(false);
//   };

//   const filterSupplies = () => {
//     let filtered = [...supplies];

//     // Apply date filter
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     switch (filterPeriod) {
//       case "today":
//         filtered = filtered.filter((supply) => {
//           const supplyDate = new Date(supply.date);
//           const supplyDay = new Date(
//             supplyDate.getFullYear(),
//             supplyDate.getMonth(),
//             supplyDate.getDate()
//           );
//           return supplyDay.getTime() === today.getTime();
//         });
//         break;
//       case "week":
//         const weekAgo = new Date(today);
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         filtered = filtered.filter(
//           (supply) => new Date(supply.date) >= weekAgo
//         );
//         break;
//       case "month":
//         const monthAgo = new Date(today);
//         monthAgo.setMonth(monthAgo.getMonth() - 1);
//         filtered = filtered.filter(
//           (supply) => new Date(supply.date) >= monthAgo
//         );
//         break;
//     }

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter((supply) => {
//         const fromCanteen =
//           typeof supply.from_canteen_id === "object"
//             ? supply.from_canteen_id.name.toLowerCase()
//             : "";
//         const dateStr = new Date(supply.date).toLocaleDateString();
//         return fromCanteen.includes(query) || dateStr.includes(query);
//       });
//     }

//     setFilteredSupplies(filtered);
//   };

//   const toggleExpand = (supplyId: string) => {
//     setExpandedSupplyId(expandedSupplyId === supplyId ? null : supplyId);
//   };

//   const openDetailsModal = async (supply: Supply) => {
//     try {
//       // Fetch full supply details with items
//       const fullSupply = await getSupplyById(supply._id);
//       setSelectedSupply(fullSupply);
//       setShowDetailsModal(true);
//     } catch (err: any) {
//       console.error("Error fetching supply details:", err);
//       alert(err.error || "Failed to load supply details");
//     }
//   };

//   const closeDetailsModal = () => {
//     setShowDetailsModal(false);
//     setSelectedSupply(null);
//   };

//   const calculateTotalAmount = (items?: SupplyItem[]) => {
//     if (!items || items.length === 0) return 0;
//     return items.reduce(
//       (sum, item) => sum + item.quantity * item.unit_price,
//       0
//     );
//   };

//   const calculateTotalItems = (items?: SupplyItem[]) => {
//     if (!items || items.length === 0) return 0;
//     return items.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
//           <p className="text-gray-600">Loading supply data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//         <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//           Failed to Load Supplies
//         </h3>
//         <p className="text-gray-600 mb-4">{error}</p>
//         <button
//           onClick={fetchSupplies}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-xl font-semibold text-gray-900">
//             Supply Management
//           </h3>
//           <p className="text-sm text-gray-500 mt-1">
//             Track incoming supplies and inventory
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           disabled={isRefreshing}
//           className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//         >
//           <RefreshCw
//             className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
//           />
//           <span>Refresh</span>
//         </button>
//       </div>

//       {/* Stats Cards */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Truck className="w-8 h-8 opacity-80" />
//             <span className="text-2xl font-bold">{supplies.length}</span>
//           </div>
//           <p className="text-sm opacity-90">Total Supplies</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Calendar className="w-8 h-8 opacity-80" />
//             <span className="text-2xl font-bold">
//               {supplies.filter(s => {
//                 const today = new Date();
//                 const supplyDate = new Date(s.date);
//                 return supplyDate.toDateString() === today.toDateString();
//               }).length}
//             </span>
//           </div>
//           <p className="text-sm opacity-90">Today's Supplies</p>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Package className="w-8 h-8 opacity-80" />
//             <span className="text-2xl font-bold">
//               {supplies.reduce((sum, supply) => sum + (supply.items?.length || 0), 0)}
//             </span>
//           </div>
//           <p className="text-sm opacity-90">Total Items</p>
//         </div>
//       </div> */}

//       {/* Filters and Search */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by supplier or date..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <Filter className="w-5 h-5 text-gray-500" />
//           <select
//             value={filterPeriod}
//             onChange={(e) => setFilterPeriod(e.target.value as any)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//           >
//             <option value="all">All Time</option>
//             <option value="today">Today</option>
//             <option value="week">Last 7 Days</option>
//             <option value="month">Last 30 Days</option>
//           </select>
//         </div>
//       </div>

//       {/* Supply List */}
//       {filteredSupplies.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//           <PackageOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             {searchQuery || filterPeriod !== "all"
//               ? "No supplies found"
//               : "No supply data available"}
//           </h3>
//           <p className="text-gray-600">
//             {searchQuery || filterPeriod !== "all"
//               ? "Try adjusting your filters or search query"
//               : "Supply records will appear here once received"}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredSupplies.map((supply) => {
//             const isExpanded = expandedSupplyId === supply._id;
//             const fromCanteen =
//               typeof supply.from_canteen_id === "object"
//                 ? supply.from_canteen_id
//                 : null;
//             const createdBy =
//               typeof supply.created_by === "object" ? supply.created_by : null;

//             return (
//               <div
//                 key={supply._id}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <div className="bg-blue-100 rounded-lg p-2">
//                           <Truck className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900 text-lg">
//                             {fromCanteen
//                               ? fromCanteen.name
//                               : "Unknown Supplier"}
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             {fromCanteen?.location || "Location not available"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         <CheckCircle2 className="w-3 h-3 mr-1" />
//                         Received
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     <div className="flex items-center space-x-2">
//                       <Calendar className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Supply Date</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {new Date(supply.date).toLocaleDateString("en-IN", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Package className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Items</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {supply.items?.length || 0} types
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <User className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Created By</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {createdBy ? createdBy.name : "Unknown"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Clock className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Created At</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {new Date(supply.created_at).toLocaleTimeString(
//                             "en-IN",
//                             {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             }
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {supply.items && supply.items.length > 0 && (
//                     <div className="pt-4 border-t border-gray-200">
//                       <button
//                         onClick={() => toggleExpand(supply._id)}
//                         className="flex items-center justify-between w-full text-left"
//                       >
//                         <span className="text-sm font-medium text-gray-700">
//                           View {supply.items.length} items
//                         </span>
//                         {isExpanded ? (
//                           <ChevronUp className="w-5 h-5 text-gray-500" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5 text-gray-500" />
//                         )}
//                       </button>

//                       {isExpanded && (
//                         <div className="mt-4 space-y-2">
//                           {supply.items.map((item) => {
//                             const itemData = item.item_id;
//                             const unit =
//                               typeof itemData.unit === "object"
//                                 ? itemData.unit
//                                 : null;

//                             return (
//                               <div
//                                 key={item._id}
//                                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                               >
//                                 <div className="flex-1">
//                                   <p className="font-medium text-gray-900">
//                                     {itemData.name}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {itemData.description}
//                                   </p>
//                                 </div>
//                                 <div className="text-right ml-4">
//                                   <p className="text-sm font-semibold text-gray-900">
//                                     {item.quantity}{" "}
//                                     {unit?.abbreviation || "units"}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     @ ₹{item.unit_price} each
//                                   </p>
//                                 </div>
//                               </div>
//                             );
//                           })}

//                           <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg font-semibold">
//                             <span className="text-gray-900">Total Amount</span>
//                             <span className="text-blue-600 text-lg">
//                               ₹
//                               {calculateTotalAmount(
//                                 supply.items
//                               ).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="mt-4 flex gap-3">
//                     <button
//                       onClick={() => openDetailsModal(supply)}
//                       className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
//                     >
//                       <span>View Full Details</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Details Modal */}
//       {showDetailsModal && selectedSupply && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
//               <div className="text-white">
//                 <h3 className="text-xl font-semibold">Supply Details</h3>
//                 <p className="text-sm opacity-90 mt-1">
//                   {new Date(selectedSupply.date).toLocaleDateString("en-IN", {
//                     weekday: "long",
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//               <button
//                 onClick={closeDetailsModal}
//                 className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex items-center space-x-3 mb-3">
//                     <Building2 className="w-5 h-5 text-gray-600" />
//                     <h4 className="font-semibold text-gray-900">From</h4>
//                   </div>
//                   {typeof selectedSupply.from_canteen_id === "object" && (
//                     <div>
//                       <p className="text-lg font-medium text-gray-900">
//                         {selectedSupply.from_canteen_id.name}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {selectedSupply.from_canteen_id.location}
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {selectedSupply.from_canteen_id.contact_number}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex items-center space-x-3 mb-3">
//                     <Building2 className="w-5 h-5 text-gray-600" />
//                     <h4 className="font-semibold text-gray-900">To</h4>
//                   </div>
//                   {typeof selectedSupply.to_canteen_id === "object" && (
//                     <div>
//                       <p className="text-lg font-medium text-gray-900">
//                         {selectedSupply.to_canteen_id.name}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {selectedSupply.to_canteen_id.location}
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {selectedSupply.to_canteen_id.contact_number}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h4 className="font-semibold text-gray-900 mb-4">
//                   Supply Items
//                 </h4>
//                 <div className="space-y-3">
//                   {selectedSupply.items?.map((item, index) => {
//                     const itemData = item.item_id;
//                     const unit =
//                       typeof itemData.unit === "object" ? itemData.unit : null;
//                     const category =
//                       typeof itemData.category === "object"
//                         ? itemData.category
//                         : null;

//                     return (
//                       <div
//                         key={item._id}
//                         className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
//                       >
//                         <div className="flex items-center space-x-4">
//                           <div className="bg-blue-100 rounded-lg w-10 h-10 flex items-center justify-center">
//                             <span className="font-semibold text-blue-600">
//                               {index + 1}
//                             </span>
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {itemData.name}
//                             </p>
//                             <div className="flex items-center space-x-2 mt-1">
//                               <p className="text-sm text-gray-600">
//                                 {itemData.description}
//                               </p>
//                               {category && (
//                                 <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
//                                   {category.name}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-lg font-semibold text-gray-900">
//                             {item.quantity} {unit?.abbreviation || "units"}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             ₹{item.unit_price} × {item.quantity} = ₹
//                             {(item.quantity * item.unit_price).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Total Items</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {calculateTotalItems(selectedSupply.items)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Total Amount</p>
//                     <p className="text-2xl font-bold text-blue-600">
//                       ₹
//                       {calculateTotalAmount(
//                         selectedSupply.items
//                       ).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Package,
  Calendar,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Clock,
  Filter,
  CheckCircle2,
  PackageOpen,
  MapPin,
  Tag,
} from "lucide-react";
import { Supply, SupplyItem } from "@/types/supply.types";
import { getSuppliesByCanteenId, getSupplyById } from "@/api/supply";

interface SupplyComponentProps {
  canteenId: string;
}

export default function SupplyComponent({ canteenId }: SupplyComponentProps) {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSupplyId, setExpandedSupplyId] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  // -----------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchSupplies();
  }, [canteenId]);

  useEffect(() => {
    filterSupplies();
  }, [searchQuery, supplies, filterPeriod]);

  const fetchSupplies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSuppliesByCanteenId(canteenId);
      const sorted = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSupplies(sorted);
      setFilteredSupplies(sorted);
    } catch (err: any) {
      console.error(err);
      setError(err.error || "Failed to load supply data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSupplies();
    setIsRefreshing(false);
  };

  // -----------------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------------
  const filterSupplies = () => {
    let filtered = [...supplies];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterPeriod) {
      case "today":
        filtered = filtered.filter((s) => {
          const d = new Date(s.date);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        });
        break;
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter((s) => new Date(s.date) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter((s) => new Date(s.date) >= monthAgo);
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => {
        const from =
          typeof s.from_canteen_id === "object"
            ? s.from_canteen_id.name.toLowerCase()
            : "";
        const dateStr = new Date(s.date).toLocaleDateString();
        return from.includes(q) || dateStr.includes(q);
      });
    }

    setFilteredSupplies(filtered);
  };

  // -----------------------------------------------------------------
  // Expand / Collapse
  // -----------------------------------------------------------------
  const toggleExpand = async (id: string) => {
    if (expandedSupplyId === id) {
      setExpandedSupplyId(null);
    } else {
      // fetch full details (items with populated fields) only when opening
      try {
        const full = await getSupplyById(id);
        // replace the cached entry with the full one
        setSupplies((prev) => prev.map((s) => (s._id === id ? full : s)));
        setFilteredSupplies((prev) =>
          prev.map((s) => (s._id === id ? full : s))
        );
      } catch (e) {
        console.error(e);
      }
      setExpandedSupplyId(id);
    }
  };

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  const totalAmount = (items?: SupplyItem[]) =>
    items?.reduce((s, i) => s + i.quantity * i.unit_price, 0) ?? 0;

  const totalQty = (items?: SupplyItem[]) =>
    items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading supply data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md mx-auto">
        <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">
          Failed to Load Supplies
        </h3>
        <p className="text-red-700 mb-6">{error}</p>
        <button
          onClick={fetchSupplies}
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
          <h1 className="text-3xl font-bold text-gray-900">
            Supply Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor incoming supplies and track inventory efficiently
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
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Supplies</p>
              <p className="text-3xl font-bold mt-1">{supplies.length}</p>
            </div>
            <Truck className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Today's Supplies</p>
              <p className="text-3xl font-bold mt-1">
                {supplies.filter((s) => {
                  const d = new Date(s.date);
                  const today = new Date();
                  return d.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Item Types</p>
              <p className="text-3xl font-bold mt-1">
                {supplies.reduce((s, sp) => s + (sp.items?.length ?? 0), 0)}
              </p>
            </div>
            <Package className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div> */}

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by supplier, location, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-800 placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as any)}
              className="px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-gray-800"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Supply Cards */}
      {filteredSupplies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
          <PackageOpen className="w-20 h-20 text-gray-300 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery || filterPeriod !== "all"
              ? "No supplies found"
              : "No supply records yet"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || filterPeriod !== "all"
              ? "Try adjusting your search or filter settings"
              : "Incoming supplies will appear here once recorded"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSupplies.map((supply) => {
            const isExpanded = expandedSupplyId === supply._id;
            const from =
              typeof supply.from_canteen_id === "object"
                ? supply.from_canteen_id
                : null;
            const createdBy =
              typeof supply.created_by === "object" ? supply.created_by : null;

            return (
              <div
                key={supply._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-xl p-3">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {from?.name ?? "Unknown Supplier"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{from?.location ?? "—"}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      Received
                    </span>
                  </div>

                  {/* Summary Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(supply.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </p>
                        <p className="font-semibold text-gray-900">
                          {supply.items?.length ?? 0} types
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          By
                        </p>
                        <p className="font-semibold text-gray-900">
                          {createdBy?.name ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(supply.created_at).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => toggleExpand(supply._id)}
                    className="flex items-center justify-between w-full py-3 border-t border-gray-200 text-left group"
                  >
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600">
                      {isExpanded ? "Hide details" : "View full details"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && supply.items && (
                    <div className="mt-6 space-y-6">
                      {/* Items Table */}
                      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                            <tr>
                              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-5 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-5 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Unit Price
                              </th>
                              <th className="px-5 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {supply.items.map((it, idx) => {
                              const item = it.item_id;
                              const unit =
                                typeof item.unit === "object"
                                  ? item.unit
                                  : null;
                              const cat =
                                typeof item.category === "object"
                                  ? item.category
                                  : null;
                              const lineTotal = it.quantity * it.unit_price;

                              return (
                                <tr key={it._id} className="hover:bg-blue-50">
                                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {idx + 1}
                                  </td>
                                  <td className="px-5 py-4">
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        {item.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {item.description}
                                      </p>
                                      {cat && (
                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                          <Tag className="w-3 h-3" />
                                          {cat.name}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                    <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                      {it.quantity}{" "}
                                      {unit?.abbreviation ?? "units"}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-right font-medium text-gray-900">
                                    ₹{it.unit_price.toLocaleString()}
                                  </td>
                                  <td className="px-5 py-4 text-right font-bold text-blue-700">
                                    ₹{lineTotal.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Totals */}
                      {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-blue-100 text-sm font-medium">Total Items</p>
                            <p className="text-3xl font-bold mt-1">{totalQty(supply.items)}</p>
                          </div>
                          <div>
                            <p className="text-blue-100 text-sm font-medium">Grand Total</p>
                            <p className="text-3xl font-bold mt-1">
                              ₹{totalAmount(supply.items).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
