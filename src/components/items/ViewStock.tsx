// import { useState } from "react";
// import { Search, Package, AlertCircle } from "lucide-react";
// import { Item } from "@/types/Item.types";

// interface ViewStockProps {
//   items: Item[];
// }

// export const ViewStock = ({ items }: ViewStockProps) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const categories = ["all", ...new Set(items.map((item) => item.category))];

//   const filteredItems = items.filter((item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = filterCategory === "all" || item.category === filterCategory;
//     const matchesStatus =
//       filterStatus === "all" || 
//       (filterStatus === "active" ? item.is_active : !item.is_active);
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Search and Filter */}
//       <div className="flex gap-4 flex-wrap">
//         <div className="flex-1 min-w-[250px] relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search items..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//           />
//         </div>
//         <select
//           value={filterCategory}
//           onChange={(e) => setFilterCategory(e.target.value)}
//           className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
//         >
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat === "all" ? "All Categories" : cat}
//             </option>
//           ))}
//         </select>
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
//         >
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       {/* Items Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredItems.map((item) => (
//           <div
//             key={item._id}
//             className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all hover:shadow-lg ${
//               !item.is_active ? "border-red-300" : "border-gray-200"
//             }`}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
//                 <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
//                   {item.category}
//                 </span>
//               </div>
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   item.is_active
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {item.is_active ? "Active" : "Inactive"}
//               </span>
//             </div>

//             <div className="space-y-3">
//               {item.description && (
//                 <div className="text-gray-600 text-sm">
//                   {item.description}
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-gray-600">MRP:</span>
//                 <span className="font-semibold text-gray-900">₹{item.mrp}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Unit:</span>
//                 <span className="font-semibold text-gray-900">{item.unit}</span>
//               </div>
//               <div className="pt-3 border-t border-gray-200 text-sm text-gray-500">
//                 Last updated: {new Date(item.updated_at).toLocaleDateString()}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredItems.length === 0 && (
//         <div className="text-center py-12 text-gray-500">
//           <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg">No items found</p>
//         </div>
//       )}
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { Search, Package } from "lucide-react";
import { Item } from "@/types/Item.types";
import { Category } from "@/types/category.types";
import { Unit } from "@/types/unit.types";
import { getCategories } from "@/api/category";
import { getUnits } from "@/api/unit";

interface ViewStockProps {
  items: Item[];
}

export const ViewStock = ({ items }: ViewStockProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, unitsData] = await Promise.all([
          getCategories(),
          getUnits()
        ]);
        setCategories(categoriesData);
        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching categories and units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get category name from ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : categoryId;
  };

  // Helper function to get unit abbreviation from ID
  const getUnitAbbreviation = (unitId: string) => {
    const unit = units.find(u => u._id === unitId);
    return unit ? unit.abbreviation : unitId;
  };

  // Get unique category names for filter dropdown
  const uniqueCategories = ["all", ...new Set(categories.map(cat => cat.name))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = getCategoryName(item.category);
    const matchesCategory = filterCategory === "all" || categoryName === filterCategory;
    const matchesStatus =
      filterStatus === "all" || 
      (filterStatus === "active" ? item.is_active : !item.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all hover:shadow-lg ${
              !item.is_active ? "border-red-300" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {getCategoryName(item.category)}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-3">
              {item.description && (
                <div className="text-gray-600 text-sm">
                  {item.description}
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">MRP:</span>
                <span className="font-semibold text-gray-900">₹{item.mrp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit:</span>
                <span className="font-semibold text-gray-900">{getUnitAbbreviation(item.unit)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 text-sm text-gray-500">
                Last updated: {new Date(item.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No items found</p>
        </div>
      )}
    </div>
  );
};