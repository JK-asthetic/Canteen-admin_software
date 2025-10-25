import { useState, useEffect } from "react";
import { Mail, User, Lock, Building2, UserCog } from "lucide-react";
import { CreateUserDto } from "@/types/user.types";
import { getCanteens } from "@/api/canteen";
import { Canteen } from "@/types/canteen.types";

interface AddUserProps {
  onAdd: (user: CreateUserDto) => Promise<void>;
}

export function AddUser({ onAdd }: AddUserProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "manager",
    canteen_id: undefined,
  });

  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loadingCanteens, setLoadingCanteens] = useState(false);

  useEffect(() => {
    const fetchCanteens = async () => {
      setLoadingCanteens(true);
      try {
        const fetchedCanteens = await getCanteens({ include_locked: false });
        setCanteens(fetchedCanteens);
      } catch (error) {
        console.error("Error fetching canteens:", error);
      }
      setLoadingCanteens(false);
    };
    fetchCanteens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    setFormData({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "manager",
      canteen_id: undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCog className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCog className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "manager",
                  })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Canteen <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                required
                value={formData.canteen_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    canteen_id: e.target.value || undefined,
                  })
                }
                disabled={loadingCanteens}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
              >
                <option value="">Select a canteen</option>
                {canteens.map((canteen) => (
                  <option key={canteen._id} value={canteen._id}>
                    {canteen.name} - {canteen.location}
                  </option>
                ))}
              </select>
              {loadingCanteens && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <User className="w-5 h-5 mr-2" />
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
