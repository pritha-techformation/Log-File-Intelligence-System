import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAdmin, updateAdmin } from "../../api/admin.api";
import { getUsers } from "../../api/user.api";
import { approveUser } from "../../api/user.api";
import toast from "react-hot-toast";
import StatCard from "./StatCard";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [admin, setAdmin] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    approved: 0,
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getUsers();
      const users = res.data.users || res.data;

      const total = users.length;
      const active = users.filter((u) => u.activity === "active").length;
      const pending = users.filter((u) => u.status === "pending").length;
      const inactive = users.filter((u) => u.activity === "inactive").length;
      const approved = users.filter((u) => u.status === "approved").length;

      const latestPending = users
        .filter((u) => u.status === "pending")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setPendingUsers(latestPending);

      setStats({ total, active, pending, inactive, approved });
    } catch (err) {
      toast.error("Failed to load statistics");
    }
  };

  const fetchAdmin = async () => {
    try {
      const response = await getAdmin();
      setAdmin(response.data);
    } catch (error) {
      toast.error("Failed to fetch admin details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = async () => {
    try {
      const response = await updateAdmin(admin);
      setAdmin(response.data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      toast.success("User approved");
      fetchStats(); // refresh
    } catch (err) {
      toast.error("Approval failed");
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {admin.name || "Admin"}
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor system activity and manage users
        </p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.total} color="bg-blue-500" />

        <StatCard
          title="Active Users"
          value={stats.active}
          color="bg-green-500"
        />

        <StatCard
          title="Pending Approval"
          value={stats.pending}
          color="bg-yellow-500"
        />

        <StatCard
          title="Inactive Users"
          value={stats.inactive}
          color="bg-red-500"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-8">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Profile Information
              </h2>
              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium">
                {admin.role || "Admin"}
              </span>
            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdateClick}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            )}
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={admin.name || ""}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode
                    ? "focus:ring-blue-500 border-gray-300"
                    : "bg-gray-100 border-gray-200 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={admin.email || ""}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode
                    ? "focus:ring-blue-500 border-gray-300"
                    : "bg-gray-100 border-gray-200 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={admin.role || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Account Status
              </label>
              <input
                type="text"
                value="Active"
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Pending Users */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-500 mb-6">
            Latest Pending Requests
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending approvals 🎉</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user._id}
                  className="border border-gray-200 bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
