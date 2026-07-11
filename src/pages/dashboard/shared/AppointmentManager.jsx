import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCalendarCheck,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaStethoscope,
  FaUserInjured,
  FaUserMd,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const AppointmentManager = ({
  title = "Manage Appointments",
  subtitle = "Review appointment requests, confirm bookings, reject requests, and update payment status.",
}) => {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/manage-appointments`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Appointments",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading appointments.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const updateAppointment = async (appointment, updateData, actionText) => {
    const confirm = await Swal.fire({
      title: `${actionText}?`,
      text: `Appointment of ${appointment.patientName} with Dr. ${appointment.doctorName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${API_URL}/appointments/${appointment._id}/status`,
        updateData,
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

        fetchAppointments();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating appointment.",
      });
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        appointment.patientName?.toLowerCase().includes(search) ||
        appointment.patientEmail?.toLowerCase().includes(search) ||
        appointment.doctorName?.toLowerCase().includes(search) ||
        appointment.doctorEmail?.toLowerCase().includes(search) ||
        appointment.department?.toLowerCase().includes(search) ||
        appointment.specialization?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        appointment.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [appointments, searchText, statusFilter, paymentFilter]);

  const statusBadgeClass = (status) => {
    if (status === "pending") return "bg-yellow-50 text-yellow-700";
    if (status === "confirmed") return "bg-green-50 text-green-700";
    if (status === "completed") return "bg-blue-50 text-blue-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    if (status === "cancelled") return "bg-red-50 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  const paymentBadgeClass = (status) => {
    if (status === "paid") return "bg-green-50 text-green-700";
    return "bg-red-50 text-red-700";
  };

  const statusText = (status) => {
    if (status === "pending") return "Pending Request";
    if (status === "confirmed") return "Confirmed / Booked";
    if (status === "completed") return "Completed";
    if (status === "rejected") return "Rejected";
    if (status === "cancelled") return "Cancelled";
    return status;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Appointment Control
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-teal-50 sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Total</h3>
          <p className="mt-3 text-4xl font-black text-teal-700">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Pending</h3>
          <p className="mt-3 text-4xl font-black text-yellow-600">
            {appointments.filter((item) => item.status === "pending").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Confirmed</h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {appointments.filter((item) => item.status === "confirmed").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Paid</h3>
          <p className="mt-3 text-4xl font-black text-blue-700">
            {
              appointments.filter((item) => item.paymentStatus === "paid")
                .length
            }
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_190px_190px]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search patient, doctor, department..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
          >
            <option value="all">All Payment</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
            <FaCalendarCheck />
          </div>

          <h3 className="text-xl font-black text-slate-800">
            No appointments found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            No appointment matches your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-lg"
            >
              <div className="grid gap-6 xl:grid-cols-[1fr_1fr_230px]">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-700">
                      <FaUserInjured />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Patient
                      </p>
                      <h3 className="text-lg font-black text-slate-900">
                        {appointment.patientName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-500">
                    <p>{appointment.patientEmail}</p>
                    <p>{appointment.patientPhone || "No phone"}</p>
                  </div>

                  {appointment.reason && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                        <FaStethoscope className="text-teal-700" />
                        Problem
                      </div>
                      <p className="text-sm leading-6 text-slate-500">
                        {appointment.reason}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
                      <FaUserMd />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Doctor
                      </p>
                      <h3 className="text-lg font-black text-slate-900">
                        Dr. {appointment.doctorName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-500">
                    <p>{appointment.doctorEmail}</p>
                    <p>{appointment.department || "No department"}</p>
                    <p>{appointment.specialization || "Medical Specialist"}</p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                        <FaCalendarCheck className="text-teal-700" />
                        Date
                      </div>
                      <p className="text-sm font-bold text-slate-600">
                        {appointment.appointmentDate}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                        <FaClock className="text-teal-700" />
                        Time
                      </div>
                      <p className="text-sm font-bold text-slate-600">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <div className="space-y-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                        appointment.status
                      )}`}
                    >
                      {statusText(appointment.status)}
                    </span>

                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
                        Payment
                      </p>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${paymentBadgeClass(
                          appointment.paymentStatus
                        )}`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        Doctor Fee
                      </p>
                      <p className="text-xl font-black text-slate-900">
                        ৳{appointment.doctorFee || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateAppointment(
                              appointment,
                              { status: "confirmed" },
                              "Confirm"
                            )
                          }
                          className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-700"
                        >
                          Confirm / Book
                        </button>

                        <button
                          onClick={() =>
                            updateAppointment(
                              appointment,
                              { status: "rejected" },
                              "Reject"
                            )
                          }
                          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {appointment.status === "confirmed" && (
                      <>
                        {appointment.paymentStatus === "paid" ? (
                          <button
                            onClick={() =>
                              updateAppointment(
                                appointment,
                                { paymentStatus: "unpaid" },
                                "Mark Unpaid"
                              )
                            }
                            className="rounded-xl bg-yellow-100 px-4 py-2.5 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
                          >
                            Mark Unpaid
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateAppointment(
                                appointment,
                                { paymentStatus: "paid" },
                                "Mark Paid"
                              )
                            }
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          onClick={() =>
                            updateAppointment(
                              appointment,
                              { status: "cancelled" },
                              "Cancel"
                            )
                          }
                          className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-300"
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}

                    {(appointment.status === "rejected" ||
                      appointment.status === "cancelled") && (
                      <button
                        onClick={() =>
                          updateAppointment(
                            appointment,
                            { status: "pending" },
                            "Move to Pending"
                          )
                        }
                        className="rounded-xl bg-yellow-100 px-4 py-2.5 text-sm font-black text-yellow-700 transition hover:bg-yellow-200"
                      >
                        Move to Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AppointmentManager;