"use client";

import { CreateCanteenDto } from "@/types/canteen.types";
import { Building2, Check, MapPin, Plus, Phone, Tag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type AddCanteenProps = {
  onAdd: (canteen: CreateCanteenDto) => Promise<void>;
};

export function AddCanteen({ onAdd }: AddCanteenProps) {
  const [formData, setFormData] = useState<CreateCanteenDto>({
    name: "",
    location: "",
    type: "main",
    contact_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Focus on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (
      formData.name &&
      formData.location &&
      formData.type &&
      formData.contact_number &&
      !isSubmitting
    ) {
      try {
        setIsSubmitting(true);
        await onAdd(formData);

        // Reset form
        setFormData({
          name: "",
          location: "",
          type: "main",
          contact_number: "",
        });

        // Reset focus to name input
        requestAnimationFrame(() => {
          nameInputRef.current?.focus();
        });
      } catch (error) {
        console.error("Error adding canteen:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      location: "",
      type: "main",
      contact_number: "",
    });

    // Restore focus after clearing
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 rounded-lg p-2 mr-3">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Canteen</h2>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canteen Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter canteen name"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "main" | "sub",
                })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={isSubmitting}
            >
              <option value="main">Main Canteen</option>
              <option value="sub">Sub Canteen</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="tel"
              value={formData.contact_number}
              onChange={(e) =>
                setFormData({ ...formData, contact_number: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact number"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.location ||
              !formData.type ||
              !formData.contact_number ||
              isSubmitting
            }
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Add Canteen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
