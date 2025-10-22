'use client';

import { Canteen, UpdateCanteenDto } from "@/types/canteen.types";
import { Building2, Check, Edit, MapPin, Search, Phone, Tag } from "lucide-react";
import { useState } from "react";

type EditCanteenProps = {
  canteens: Canteen[];
  onEdit: (id: string, data: UpdateCanteenDto) => Promise<void>;
};

export function EditCanteen({ canteens, onEdit }: EditCanteenProps) {
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [formData, setFormData] = useState<UpdateCanteenDto>({
    name: "",
    type: "main",
    location: "",
    contact_number: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    setFormData({
      name: canteen.name,
      type: canteen.type,
      location: canteen.location,
      contact_number: canteen.contact_number,
    });
  };

  const handleSubmit = async () => {
    if (
      selectedCanteen &&
      formData.name &&
      formData.type &&
      formData.location &&
      formData.contact_number
    ) {
      try {
        await onEdit(selectedCanteen._id, formData);
        setSelectedCanteen(null);
        setFormData({ 
          name: "", 
          type: "main", 
          location: "", 
          contact_number: "" 
        });
      } catch (error) {
        console.error('Error updating canteen:', error);
        alert('Failed to update canteen');
      }
    }
  };

  const filteredCanteens = canteens.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 rounded-lg p-2 mr-3">
          <Edit className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Canteen</h2>
      </div>
      {!selectedCanteen ? (
        <div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search canteens..."
              />
            </div>
          </div>
          <div className="space-y-3">
            {filteredCanteens.map((canteen) => (
              <div
                key={canteen._id}
                onClick={() => handleSelectCanteen(canteen)}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {canteen.name}
                    </h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {canteen.location}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {canteen.contact_number}
                      </div>
                    </div>
                  </div>
                  <Edit className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Editing:{" "}
              <span className="font-semibold">{selectedCanteen.name}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canteen Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter canteen name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as 'main' | 'sub' })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter location"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter contact number"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedCanteen(null);
                setFormData({ 
                  name: "", 
                  type: "main", 
                  location: "", 
                  contact_number: "" 
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.type || !formData.location || !formData.contact_number}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
