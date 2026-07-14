import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaFilePrescription,
  FaStethoscope,
  FaUserInjured,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const MyAppointments = () => {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/doctor-appointments`, {
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
      fetchDoctorAppointments();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading doctor appointments...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Doctor Dashboard
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          My Confirmed Appointments
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
          These appointments are confirmed by receptionist. You can now start
          consultation and write prescriptions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Confirmed Appointments
          </h3>
          <p className="mt-3 text-4xl font-black text-teal-700">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Ready to Consult</h3>
          <p className="mt-3 text-4xl font-black text-green-700">
            {appointments.filter((item) => item.status === "confirmed").length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">Today</h3>
          <p className="mt-3 text-4xl font-black text-blue-700">
            {
              appointments.filter(
                (item) =>
                  item.appointmentDate ===
                  new Date().toISOString().split("T")[0]
              ).length
            }
          </p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
            <FaCalendarCheck />
          </div>

          <h3 className="text-xl font-black text-slate-800">
            No confirmed appointments yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Appointments will appear here only after receptionist confirms them.
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                    <FaUserInjured />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {appointment.patientName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.patientEmail}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.patientPhone || "No phone"}
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                  Confirmed / Booked
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

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  to={`/dashboard/doctor/patient-details?appointmentId=${appointment._id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                >
                  <FaUserInjured />
                  View Patient Details
                </Link>

                {appointment.status === "confirmed" && (
                  <Link
                    to={`/dashboard/doctor/write-prescription?appointmentId=${appointment._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                  >
                    <FaFilePrescription />
                    Write Prescription
                  </Link>
                )}

                {appointment.status === "completed" && (
                  <div className="flex w-full items-center justify-center rounded-2xl bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 sm:col-span-1">
                    Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyAppointments;