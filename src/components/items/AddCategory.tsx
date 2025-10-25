import { useState } from "react";
import { CreateCategoryDto } from "@/types/category.types";

interface AddCategoryProps {
  onAdd: (category: CreateCategoryDto) => void;
}

export const AddCategory = ({ onAdd }: AddCategoryProps) => {
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: "",
    description: "",
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      description: "",
      is_active: true,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Grains"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Category description"
                rows={3}
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
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};
