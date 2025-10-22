"use client";

import { useEffect, useState } from "react";
import { Users, Eye, UserPlus, Edit, ArrowLeft } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "@/api/user";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user.types";
import { ViewUsers } from "@/components/users/ViewUsers";
import { AddUser } from "@/components/users/AddUser";
import { EditUser } from "@/components/users/EditUser";

import { useRouter } from "next/navigation";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("view");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: CreateUserDto) => {
    try {
      setLoading(true);
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
    setLoading(false);
  };

  const handleEditUser = async (id: string, updatedData: UpdateUserDto) => {
    try {
      setLoading(true);
      const updatedUser = await updateUser(id, updatedData);
      setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
      }
      setLoading(true);
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
    setLoading(false);
  };

  const menuItems = [
    { id: "view", label: "View Users", icon: Eye, color: "purple" },
    { id: "add", label: "Add User", icon: UserPlus, color: "blue" },
    { id: "edit", label: "Edit User", icon: Edit, color: "green" },
  ];

  const getUserCountByRole = () => ({
    admin: users.filter((user) => user.role === "admin").length,
    manager: users.filter((user) => user.role === "manager").length,
  });

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-75 bg-white shadow-xl flex flex-col border-r-2 border-blue-200">
        <div className="p-8 border-b-2 border-gray-100 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center">
            <div className="bg-white rounded-xl p-3 mr-4 shadow-lg">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage</h1>
              <p className="text-sm text-blue-100">Users</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? `bg-${item.color}-100 text-${item.color}-700`
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t-2 border-gray-100 bg-gray-50 space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Admin Users
            </p>
            <p className="text-4xl font-bold text-blue-600">
              {getUserCountByRole().admin}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Manager Users
            </p>
            <p className="text-4xl font-bold text-green-600">
              {getUserCountByRole().manager}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col bg-gradient-to-br from-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-2 border-purple-200 p-5">
          <div className="max-w-full flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                {activeTab === "view" && "View and manage your item inventory"}
                {activeTab === "add" && "Add a new item to your inventory"}
                {activeTab === "edit" &&
                  "Modify existing items in your inventory"}
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="w-full h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "view" && (
                  <ViewUsers users={users} onDelete={handleDeleteUser} />
                )}
                {activeTab === "add" && <AddUser onAdd={handleAddUser} />}
                {activeTab === "edit" && (
                  <EditUser users={users} onEdit={handleEditUser} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
