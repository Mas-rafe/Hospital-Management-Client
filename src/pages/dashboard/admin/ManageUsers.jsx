import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSearch, FaUsers } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageUsers = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/users`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Users",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleUpdateUser = async (id, updateData) => {
    try {
      const res = await axios.patch(`${API_URL}/users/${id}`, updateData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        fetchUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating user.",
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchText.toLowerCase());

      const matchesRole = roleFilter === "all" || item.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchText, roleFilter, statusFilter]);

  const roleBadgeClass = (role) => {
    if (role === "admin") return "bg-purple-50 text-purple-700";
    if (role === "doctor") return "bg-blue-50 text-blue-700";
    if (role === "receptionist") return "bg-amber-50 text-amber-700";
    return "bg-teal-50 text-teal-700";
  };

  const statusBadgeClass = (status) => {
    if (status === "active") return "bg-green-50 text-green-700";
    if (status === "blocked") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">Loading users...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Admin Management
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Manage Users
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
          View all registered users, update their roles, and control account
          status from one place.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500">Total Users</h3>
              <p className="mt-3 text-4xl font-black text-teal-700">
                {users.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Active Users</h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {users.filter((item) => item.status === "active").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Pending Users</h3>
          <p className="mt-3 text-4xl font-black text-yellow-600">
            {users.filter((item) => item.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  User
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Phone
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Current Role
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Status
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Change Role
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Change Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((item) => (
                <tr key={item._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 font-black text-white">
                          {item.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3 className="font-black text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500">{item.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    {item.phone || "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${roleBadgeClass(
                        item.role
                      )}`}
                    >
                      {item.role}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={item.role}
                      disabled={item.email === currentUser?.email}
                      onChange={(e) =>
                        handleUpdateUser(item._id, { role: e.target.value })
                      }
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="receptionist">Receptionist</option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={item.status}
                      disabled={item.email === currentUser?.email}
                      onChange={(e) =>
                        handleUpdateUser(item._id, { status: e.target.value })
                      }
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-lg font-black text-slate-700">
                No users found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filter options.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;