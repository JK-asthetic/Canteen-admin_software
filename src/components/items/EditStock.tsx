// import { useState } from "react";
// import { Search, ArrowLeft } from "lucide-react";
// import { Item, UpdateItemDto } from "@/types/Item.types";

// interface EditStockProps {
//   items: Item[];
//   onEdit: (id: string, data: UpdateItemDto) => void;
// }

// export const EditStock = ({ items, onEdit }: EditStockProps) => {
//   const [selectedItem, setSelectedItem] = useState<Item | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredItems = items.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedItem) return;

//     const updateData: UpdateItemDto = {
//       name: selectedItem.name,
//       description: selectedItem.description,
//       category: selectedItem.category,
//       mrp: selectedItem.mrp,
//       unit: selectedItem.unit,
//       is_active: selectedItem.is_active,
//     };

//     onEdit(selectedItem._id, updateData);
//     setSelectedItem(null);
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {!selectedItem ? (
//         <>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search items to edit..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
//                 onClick={() => setSelectedItem({ ...item })}
//               >
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   {item.name}
//                 </h3>
//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p>Category: {item.category}</p>
//                   <p>MRP: ₹{item.mrp}</p>
//                   <p>Unit: {item.unit}</p>
//                   <p>Status: {item.is_active ? "Active" : "Inactive"}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-gray-900">
//               Edit: {selectedItem.name}
//             </h3>
//             <button
//               onClick={() => setSelectedItem(null)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Item Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={selectedItem.name}
//                   onChange={(e) =>
//                     setSelectedItem({ ...selectedItem, name: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={selectedItem.category}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       category: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   value={selectedItem.description}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       description: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Unit
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={selectedItem.unit}
//                   onChange={(e) =>
//                     setSelectedItem({ ...selectedItem, unit: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   MRP
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   step="0.01"
//                   value={selectedItem.mrp}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       mrp: Number(e.target.value),
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={selectedItem.is_active ? "active" : "inactive"}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       is_active: e.target.value === "active",
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
//             >
//               Update Item
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };
// import { useState, useEffect } from "react";
// import { Search, ArrowLeft } from "lucide-react";
// import { Item, UpdateItemDto } from "@/types/Item.types";
// import { Category } from "@/types/category.types";
// import { Unit } from "@/types/unit.types";
// import { getCategories } from "@/api/category";
// import { getUnits } from "@/api/unit";

// interface EditStockProps {
//   items: Item[];
//   onEdit: (id: string, data: UpdateItemDto) => void;
// }

// export const EditStock = ({ items, onEdit }: EditStockProps) => {
//   const [selectedItem, setSelectedItem] = useState<Item | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [categoriesData, unitsData] = await Promise.all([
//           getCategories({ is_active: true }),
//           getUnits({ is_active: true })
//         ]);
//         setCategories(categoriesData);
//         setUnits(unitsData);
//       } catch (error) {
//         console.error("Error fetching categories and units:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredItems = items.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedItem) return;

//     const updateData: UpdateItemDto = {
//       name: selectedItem.name,
//       description: selectedItem.description,
//       category: selectedItem.category,
//       mrp: selectedItem.mrp,
//       unit: selectedItem.unit,
//       is_active: selectedItem.is_active,
//     };

//     onEdit(selectedItem._id, updateData);
//     setSelectedItem(null);
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//           <div className="text-center text-gray-600">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {!selectedItem ? (
//         <>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search items to edit..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
//                 onClick={() => setSelectedItem({ ...item })}
//               >
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   {item.name}
//                 </h3>
//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p>Category: {item.category}</p>
//                   <p>MRP: ₹{item.mrp}</p>
//                   <p>Unit: {item.unit}</p>
//                   <p>Status: {item.is_active ? "Active" : "Inactive"}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-gray-900">
//               Edit: {selectedItem.name}
//             </h3>
//             <button
//               onClick={() => setSelectedItem(null)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Item Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={selectedItem.name}
//                   onChange={(e) =>
//                     setSelectedItem({ ...selectedItem, name: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <select
//                   required
//                   value={selectedItem.category}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       category: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((category) => (
//                     <option key={category._id} value={category.name}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   value={selectedItem.description}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       description: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Unit
//                 </label>
//                 <select
//                   required
//                   value={selectedItem.unit}
//                   onChange={(e) =>
//                     setSelectedItem({ ...selectedItem, unit: e.target.value })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="">Select a unit</option>
//                   {units.map((unit) => (
//                     <option key={unit._id} value={unit.abbreviation}>
//                       {unit.name} ({unit.abbreviation})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   MRP
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   step="0.01"
//                   value={selectedItem.mrp}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       mrp: Number(e.target.value),
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={selectedItem.is_active ? "active" : "inactive"}
//                   onChange={(e) =>
//                     setSelectedItem({
//                       ...selectedItem,
//                       is_active: e.target.value === "active",
//                     })
//                   }
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
//             >
//               Update Item
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Item, UpdateItemDto } from "@/types/Item.types";
import { Category } from "@/types/category.types";
import { Unit } from "@/types/unit.types";
import { getCategories } from "@/api/category";
import { getUnits } from "@/api/unit";

interface EditStockProps {
  items: Item[];
  onEdit: (id: string, data: UpdateItemDto) => void;
}

export const EditStock = ({ items, onEdit }: EditStockProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, unitsData] = await Promise.all([
          getCategories({ is_active: true }),
          getUnits({ is_active: true })
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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const updateData: UpdateItemDto = {
      name: selectedItem.name,
      description: selectedItem.description,
      category: selectedItem.category,
      mrp: selectedItem.mrp,
      unit: selectedItem.unit,
      is_active: selectedItem.is_active,
    };

    onEdit(selectedItem._id, updateData);
    setSelectedItem(null);
  };

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!selectedItem ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items to edit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                onClick={() => setSelectedItem({ ...item })}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Category: {getCategoryName(item.category)}</p>
                  <p>MRP: ₹{item.mrp}</p>
                  <p>Unit: {getUnitAbbreviation(item.unit)}</p>
                  <p>Status: {item.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Edit: {selectedItem.name}
            </h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  value={selectedItem.category}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={selectedItem.description}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  required
                  value={selectedItem.unit}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, unit: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a unit</option>
                  {units.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.name} ({unit.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  MRP
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={selectedItem.mrp}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      mrp: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedItem.is_active ? "active" : "inactive"}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      is_active: e.target.value === "active",
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              Update Item
            </button>
          </form>
        </div>
      )}
    </div>
  );
};