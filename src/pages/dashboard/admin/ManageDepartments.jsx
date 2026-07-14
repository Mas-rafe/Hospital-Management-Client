import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaHospital, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageDepartments = () => {
  const { token } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/departments`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setDepartments(res.data.departments);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Departments",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading departments.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  const openAddModal = () => {
    setEditingDepartment(null);
    setFormData({
      name: "",
      description: "",
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || "",
      description: department.description || "",
      status: department.status || "active",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Department Name Required",
        text: "Please enter a department name.",
      });
      return;
    }

    try {
      let res;

      if (editingDepartment) {
        res = await axios.patch(
          `${API_URL}/departments/${editingDepartment._id}`,
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await axios.post(`${API_URL}/departments`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      }

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: editingDepartment ? "Updated" : "Added",
          text: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        closeModal();
        fetchDepartments();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: editingDepartment ? "Update Failed" : "Add Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteDepartment = async (department) => {
    const confirm = await Swal.fire({
      title: "Delete Department?",
      text: `Are you sure you want to delete ${department.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#0f766e",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(`${API_URL}/departments/${department._id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: res.data.message,
          timer: 1200,
          showConfirmButton: false,
        });

        fetchDepartments();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while deleting department.",
      });
    }
  };

  const quickUpdateStatus = async (department, status) => {
    try {
      const res = await axios.patch(
        `${API_URL}/departments/${department._id}`,
        { status },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: res.data.message,
          timer: 1000,
          showConfirmButton: false,
        });

        fetchDepartments();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating department.",
      });
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const matchesSearch =
        department.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        department.description
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, searchText, statusFilter]);

  const statusBadgeClass = (status) => {
    if (status === "active") return "bg-green-50 text-green-700";
    return "bg-red-50 text-red-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading departments...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Admin Management
        </p>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              Manage Departments
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
              Add, edit, activate, deactivate, or delete hospital departments.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-teal-700 transition hover:bg-teal-50"
          >
            <FaPlus />
            Add Department
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500">
                Total Departments
              </h3>
              <p className="mt-3 text-4xl font-black text-teal-700">
                {departments.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
              <FaHospital />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Active Departments
          </h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {departments.filter((item) => item.status === "active").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Inactive Departments
          </h3>
          <p className="mt-3 text-4xl font-black text-red-600">
            {departments.filter((item) => item.status === "inactive").length}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by department name or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Department
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Description
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Status
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDepartments.map((department) => (
                <tr
                  key={department._id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <FaHospital />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {department.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          ID: {department._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    {department.description || "No description added"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                        department.status
                      )}`}
                    >
                      {department.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditModal(department)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      {department.status === "active" ? (
                        <button
                          onClick={() =>
                            quickUpdateStatus(department, "inactive")
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                        >
                          Inactive
                        </button>
                      ) : (
                        <button
                          onClick={() => quickUpdateStatus(department, "active")}
                          className="rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100"
                        >
                          Active
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteDepartment(department)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-700"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDepartments.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-lg font-black text-slate-700">
                No departments found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a department or change your filter options.
              </p>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingDepartment
                  ? "Update department information."
                  : "Create a new hospital department."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Department Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Cardiology"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Write a short department description..."
                  className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-teal-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                >
                  {editingDepartment ? "Save Changes" : "Add Department"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageDepartments;