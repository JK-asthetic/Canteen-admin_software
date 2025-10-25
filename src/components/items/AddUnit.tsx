import { useState } from "react";
import { CreateUnitDto } from "@/types/unit.types";

interface AddUnitProps {
  onAdd: (unit: CreateUnitDto) => void;
}

export const AddUnit = ({ onAdd }: AddUnitProps) => {
  const [formData, setFormData] = useState<CreateUnitDto>({
    name: "",
    abbreviation: "",
    description: "",
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      abbreviation: "",
      description: "",
      is_active: true,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Kilogram"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Abbreviation *
              </label>
              <input
                type="text"
                required
                value={formData.abbreviation}
                onChange={(e) =>
                  setFormData({ ...formData, abbreviation: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., kg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Unit description"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
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
            Add Unit
          </button>
        </form>
      </div>
    </div>
  );
};
