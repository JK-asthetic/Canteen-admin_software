// import { useState } from "react";
// import { CreateItemDto } from "@/types/Item.types";

// interface AddStockProps {
//   onAdd: (item: CreateItemDto) => void;
// }

// export const AddStock = ({ onAdd }: AddStockProps) => {
//   const [formData, setFormData] = useState<CreateItemDto>({
//     name: "",
//     description: "",
//     category: "",
//     mrp: 0,
//     unit: "",
//     is_active: true,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAdd(formData);
//     setFormData({
//       name: "",
//       description: "",
//       category: "",
//       mrp: 0,
//       unit: "",
//       is_active: true,
//     });
//   };

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Item Name *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., Rice"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Category *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., Grains"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="Item description"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Unit *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.unit}
//                 onChange={(e) =>
//                   setFormData({ ...formData, unit: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., kg, liters, pieces"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 MRP *
//               </label>
//               <input
//                 type="number"
//                 required
//                 min="0"
//                 step="0.01"
//                 value={formData.mrp}
//                 onChange={(e) =>
//                   setFormData({ ...formData, mrp: Number(e.target.value) })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., 45"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 value={formData.is_active ? "active" : "inactive"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     is_active: e.target.value === "active",
//                   })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// import { useState, useEffect } from "react";
// import { CreateItemDto } from "@/types/Item.types";
// import { Category } from "@/types/category.types";
// import { Unit } from "@/types/unit.types";
// import { getCategories } from "@/api/category";
// import { getUnits } from "@/api/unit";

// interface AddStockProps {
//   onAdd: (item: CreateItemDto) => void;
// }

// export const AddStock = ({ onAdd }: AddStockProps) => {
//   const [formData, setFormData] = useState<CreateItemDto>({
//     name: "",
//     description: "",
//     category: "",
//     mrp: 0,
//     unit: "",
//     is_active: true,
//   });

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

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAdd(formData);
//     setFormData({
//       name: "",
//       description: "",
//       category: "",
//       mrp: 0,
//       unit: "",
//       is_active: true,
//     });
//   };

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//           <div className="text-center text-gray-600">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Item Name *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., Rice"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Category *
//               </label>
//               <select
//                 required
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category.name}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="Item description"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Unit *
//               </label>
//               <select
//                 required
//                 value={formData.unit}
//                 onChange={(e) =>
//                   setFormData({ ...formData, unit: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="">Select a unit</option>
//                 {units.map((unit) => (
//                   <option key={unit._id} value={unit.abbreviation}>
//                     {unit.name} ({unit.abbreviation})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 MRP *
//               </label>
//               <input
//                 type="number"
//                 required
//                 min="0"
//                 step="0.01"
//                 value={formData.mrp}
//                 onChange={(e) =>
//                   setFormData({ ...formData, mrp: Number(e.target.value) })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., 45"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Status
//               </label>
//               <select
//                 value={formData.is_active ? "active" : "inactive"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     is_active: e.target.value === "active",
//                   })
//                 }
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { CreateItemDto } from "@/types/Item.types";
import { Category } from "@/types/category.types";
import { Unit } from "@/types/unit.types";
import { getCategories } from "@/api/category";
import { getUnits } from "@/api/unit";

interface AddStockProps {
  onAdd: (item: CreateItemDto) => void;
}

export const AddStock = ({ onAdd }: AddStockProps) => {
  const [formData, setFormData] = useState<CreateItemDto>({
    name: "",
    description: "",
    category: "",
    mrp: 0,
    unit: "",
    is_active: true,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      description: "",
      category: "",
      mrp: 0,
      unit: "",
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Rice"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Item description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit *
              </label>
              <select
                required
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
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
                MRP *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.mrp}
                onChange={(e) =>
                  setFormData({ ...formData, mrp: Number(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., 45"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.is_active ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};