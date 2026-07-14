import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaClock,
  FaEnvelope,
  FaFilePrescription,
  FaNotesMedical,
  FaPhone,
  FaPills,
  FaStethoscope,
  FaUserInjured,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const PatientDetails = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

  const appointmentId = searchParams.get("appointmentId");

  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [relatedAppointments, setRelatedAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!appointmentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/doctor-patient-details/${appointmentId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setPatient(res.data.patient);
          setAppointment(res.data.appointment);
          setRelatedAppointments(res.data.relatedAppointments || []);
          setPrescriptions(res.data.prescriptions || []);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Patient Details",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading patient details.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPatientDetails();
    }
  }, [appointmentId, token, API_URL]);

  const statusBadgeClass = (status) => {
    if (status === "confirmed") return "bg-green-50 text-green-700";
    if (status === "completed") return "bg-blue-50 text-blue-700";
    return "bg-slate-100 text-slate-600";
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading patient details...
        </p>
      </div>
    );
  }

  if (!appointmentId) {
    return (
      <section className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-700">
          Appointment ID Missing
        </h1>
        <p className="mt-2 text-sm font-bold text-red-600">
          Please open patient details from Doctor → My Appointments.
        </p>

        <Link
          to="/dashboard/doctor/my-appointments"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
        >
          <FaArrowLeft />
          Back to Appointments
        </Link>
      </section>
    );
  }

  if (!appointment) {
    return (
      <section className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-700">
          Patient Details Not Found
        </h1>
        <p className="mt-2 text-sm font-bold text-red-600">
          You can only view patient details for your own confirmed or completed
          appointments.
        </p>

        <Link
          to="/dashboard/doctor/my-appointments"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
        >
          <FaArrowLeft />
          Back to Appointments
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Doctor Dashboard
        </p>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              Patient Details
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-teal-50 sm:text-base">
              View patient information, appointment problem, previous
              consultation history, and prescriptions written by you.
            </p>
          </div>

          <Link
            to="/dashboard/doctor/my-appointments"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-teal-700 transition hover:bg-teal-50"
          >
            <FaArrowLeft />
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-700">
                <FaUserInjured />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Patient
                </p>
                <h3 className="text-2xl font-black text-slate-900">
                  {patient?.name || appointment.patientName}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <FaEnvelope className="text-teal-700" />
                <p className="break-all text-sm font-bold text-slate-600">
                  {patient?.email || appointment.patientEmail}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <FaPhone className="text-teal-700" />
                <p className="text-sm font-bold text-slate-600">
                  {patient?.phone || appointment.patientPhone || "No phone"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Current Appointment
            </h3>

            <div className="space-y-4">
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

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>

              {appointment.status === "confirmed" && (
                <Link
                  to={`/dashboard/doctor/write-prescription?appointmentId=${appointment._id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                >
                  <FaFilePrescription />
                  Write Prescription
                </Link>
              )}
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
                <FaStethoscope />
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                Patient Problem
              </h2>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              {appointment.reason || "No problem/reason was added."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-black text-slate-900">
              Appointment History With You
            </h2>

            {relatedAppointments.length === 0 ? (
              <p className="text-sm font-bold text-slate-500">
                No previous appointment history found.
              </p>
            ) : (
              <div className="space-y-4">
                {relatedAppointments.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {item.appointmentDate} at {item.appointmentTime}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.reason || "No problem added."}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-black capitalize ${statusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-black text-slate-900">
              Prescriptions Written By You
            </h2>

            {prescriptions.length === 0 ? (
              <p className="text-sm font-bold text-slate-500">
                No prescription history found for this patient.
              </p>
            ) : (
              <div className="space-y-5">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          Diagnosis
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Prescription Date: {formatDate(prescription.createdAt)}
                        </p>
                      </div>

                      {prescription.followUpDate && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          Follow-up: {prescription.followUpDate}
                        </span>
                      )}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                        <FaNotesMedical className="text-teal-700" />
                        Diagnosis
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        {prescription.diagnosis}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
                        <FaPills className="text-teal-700" />
                        Medicines
                      </div>

                      {prescription.medicines?.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                                    Medicine
                                  </th>
                                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                                    Dosage
                                  </th>
                                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                                    Duration
                                  </th>
                                  <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                                    Instruction
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-slate-100">
                                {prescription.medicines.map(
                                  (medicine, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-3 text-sm font-bold text-slate-700">
                                        {medicine.name || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-slate-500">
                                        {medicine.dosage || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-slate-500">
                                        {medicine.duration || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-slate-500">
                                        {medicine.instruction || "N/A"}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                          No medicines added.
                        </p>
                      )}
                    </div>

                    {prescription.advice && (
                      <div className="mt-4 rounded-2xl bg-teal-50 p-4">
                        <p className="text-sm font-black text-teal-700">
                          Advice
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {prescription.advice}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default PatientDetails;