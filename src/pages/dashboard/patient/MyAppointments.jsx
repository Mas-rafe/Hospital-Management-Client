import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaFilePrescription,
  FaMoneyBillWave,
  FaStethoscope,
  FaUserMd,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const MyAppointments = () => {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/my-appointments`, {
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
      fetchMyAppointments();
    }
  }, [token]);

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
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-emerald-50">
          Patient Dashboard
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          My Appointments
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
          Track your appointment requests, confirmation status, doctor details,
          payment status, and prescriptions after completed consultation.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Total Appointments
          </h3>
          <p className="mt-3 text-4xl font-black text-teal-700">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Pending Requests
          </h3>
          <p className="mt-3 text-4xl font-black text-yellow-600">
            {appointments.filter((item) => item.status === "pending").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Confirmed / Booked
          </h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {appointments.filter((item) => item.status === "confirmed").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Completed</h3>
          <p className="mt-3 text-4xl font-black text-blue-700">
            {appointments.filter((item) => item.status === "completed").length}
          </p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
            <FaCalendarCheck />
          </div>

          <h3 className="text-xl font-black text-slate-800">
            No appointments yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Book an appointment first. Your request will appear here as pending.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
                    <FaUserMd />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Dr. {appointment.doctorName}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-teal-700">
                      {appointment.department || "No department"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.specialization || "Medical Specialist"}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                    appointment.status
                  )}`}
                >
                  {statusText(appointment.status)}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaMoneyBillWave className="text-teal-700" />
                    Fee
                  </div>

                  <p className="text-sm font-bold text-slate-600">
                    ৳{appointment.doctorFee || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaMoneyBillWave className="text-teal-700" />
                    Payment
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black capitalize ${paymentBadgeClass(
                      appointment.paymentStatus
                    )}`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </div>
              </div>

              {appointment.reason && (
                <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaStethoscope className="text-teal-700" />
                    Patient Problem
                  </div>

                  <p className="text-sm leading-6 text-slate-500">
                    {appointment.reason}
                  </p>
                </div>
              )}

              {appointment.status === "pending" && (
                <div className="mt-5 rounded-2xl bg-yellow-50 p-4">
                  <p className="text-sm font-bold text-yellow-700">
                    Your appointment request is pending. Receptionist will
                    confirm it soon.
                  </p>
                </div>
              )}

              {appointment.status === "confirmed" && (
                <div className="mt-5 rounded-2xl bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-700">
                    Your appointment is confirmed/booked. Please visit on time.
                  </p>
                </div>
              )}

              {appointment.status === "completed" && (
                <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm font-bold text-blue-700">
                    Consultation completed. Your prescription is available now.
                  </p>

                  <Link
                    to={`/dashboard/patient/my-prescriptions?appointmentId=${appointment._id}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                  >
                    <FaFilePrescription />
                    View Prescription
                  </Link>
                </div>
              )}

              {appointment.status === "rejected" && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-700">
                    This appointment request was rejected. Please book another
                    appointment if needed.
                  </p>
                </div>
              )}

              {appointment.status === "cancelled" && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-700">
                    This appointment was cancelled.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyAppointments;