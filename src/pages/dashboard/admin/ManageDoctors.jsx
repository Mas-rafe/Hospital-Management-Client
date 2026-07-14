import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaSearch, FaUserMd } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ManageDoctors = () => {
  const { token } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    department: "",
    specialization: "",
    fee: "",
    availableTime: "",
    status: "pending",
    availableDays: [],
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/doctors`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Doctors",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading doctors.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);

    setFormData({
      department: doctor.department || "",
      specialization: doctor.specialization || "",
      fee: doctor.fee || "",
      availableTime: doctor.availableTime || "",
      status: doctor.status || "pending",
      availableDays: doctor.availableDays || [],
    });
  };

  const closeEditModal = () => {
    setEditingDoctor(null);
  };

  const handleDayChange = (day) => {
    const exists = formData.availableDays.includes(day);

    if (exists) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter((item) => item !== day),
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day],
      });
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `${API_URL}/doctors/${editingDoctor._id}`,
        formData,
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
          timer: 1200,
          showConfirmButton: false,
        });

        closeEditModal();
        fetchDoctors();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating doctor.",
      });
    }
  };

  const quickUpdateStatus = async (doctor, status) => {
    try {
      const res = await axios.patch(
        `${API_URL}/doctors/${doctor._id}`,
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
          text:
            status === "active"
              ? "Doctor approved successfully."
              : "Doctor status updated successfully.",
          timer: 1200,
          showConfirmButton: false,
        });

        fetchDoctors();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating doctor.",
      });
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || doctor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, searchText, statusFilter]);

  const statusBadgeClass = (status) => {
    if (status === "active") return "bg-green-50 text-green-700";
    if (status === "blocked") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">Loading doctors...</p>
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
          Manage Doctors
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
          Approve doctors, update professional information, and manage doctor
          availability.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-500">
                Total Doctors
              </h3>
              <p className="mt-3 text-4xl font-black text-teal-700">
                {doctors.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
              <FaUserMd />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Approved Doctors
          </h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {doctors.filter((item) => item.status === "active").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Pending Doctors</h3>
          <p className="mt-3 text-4xl font-black text-yellow-600">
            {doctors.filter((item) => item.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, department, specialization..."
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
            <option value="active">Approved</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Doctor
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Department
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Specialization
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Fee
                </th>
                <th className="px-5 py-4 text-sm font-black text-slate-600">
                  Availability
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
              {filteredDoctors.map((doctor) => (
                <tr key={doctor._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div>
                      <h3 className="font-black text-slate-900">
                        Dr. {doctor.name}
                      </h3>
                      <p className="text-sm text-slate-500">{doctor.email}</p>
                      <p className="text-sm text-slate-500">
                        {doctor.phone || "No phone"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    {doctor.department || "Not set"}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    {doctor.specialization || "Not set"}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    ৳{doctor.fee || 0}
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-slate-600">
                    <p>
                      {doctor.availableDays?.length
                        ? doctor.availableDays.join(", ")
                        : "No days"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {doctor.availableTime || "No time"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                        doctor.status
                      )}`}
                    >
                      {doctor.status === "active" ? "approved" : doctor.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditModal(doctor)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      {doctor.status !== "active" && (
                        <button
                          onClick={() => quickUpdateStatus(doctor, "active")}
                          className="rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700 transition hover:bg-green-100"
                        >
                          Approve
                        </button>
                      )}

                      {doctor.status !== "blocked" && (
                        <button
                          onClick={() => quickUpdateStatus(doctor, "blocked")}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDoctors.length === 0 && (
            <div className="p-10 text-center">
              <h3 className="text-lg font-black text-slate-700">
                No doctors found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Register a doctor account first or change your filter options.
              </p>
            </div>
          )}
        </div>
      </div>

      {editingDoctor && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900">
                Edit Doctor
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update information for Dr. {editingDoctor.name}
              </p>
            </div>

            <form onSubmit={handleUpdateDoctor} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value,
                      })
                    }
                    placeholder="Cardiology"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    placeholder="Heart Specialist"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Consultation Fee
                  </label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fee: e.target.value,
                      })
                    }
                    placeholder="800"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Available Time
                  </label>
                  <input
                    type="text"
                    value={formData.availableTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableTime: e.target.value,
                      })
                    }
                    placeholder="10:00 AM - 2:00 PM"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
                  />
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
                    <option value="pending">Pending</option>
                    <option value="active">Approved</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-black text-slate-700">
                  Available Days
                </label>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {days.map((day) => (
                    <label
                      key={day}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="h-4 w-4 accent-teal-700"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={closeEditModal}
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

export default ManageDoctors;