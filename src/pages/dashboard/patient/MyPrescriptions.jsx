import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCalendarCheck,
  FaClock,
  FaFilePrescription,
  FaNotesMedical,
  FaPills,
  FaPrint,
  FaStethoscope,
  FaUserMd,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const MyPrescriptions = () => {
  const { token } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  const fetchMyPrescriptions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/my-prescriptions`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setPrescriptions(res.data.prescriptions);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Prescriptions",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading prescriptions.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyPrescriptions();
    }
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading prescriptions...
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

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              My Prescriptions
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
              View prescriptions written by your assigned doctors after
              completed appointments.
            </p>
          </div>

          {prescriptions.length > 0 && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-teal-700 transition hover:bg-teal-50"
            >
              <FaPrint />
              Print Page
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Total Prescriptions
          </h3>
          <p className="mt-3 text-4xl font-black text-teal-700">
            {prescriptions.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            With Follow-up
          </h3>
          <p className="mt-3 text-4xl font-black text-blue-700">
            {prescriptions.filter((item) => item.followUpDate).length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500">
            Latest Prescription
          </h3>
          <p className="mt-3 text-lg font-black text-slate-800">
            {prescriptions[0]?.doctorName
              ? `Dr. ${prescriptions[0].doctorName}`
              : "No prescription"}
          </p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
            <FaFilePrescription />
          </div>

          <h3 className="text-xl font-black text-slate-800">
            No prescriptions yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Prescriptions will appear here after your doctor completes an
            appointment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                      <FaUserMd />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-teal-50">
                        Prescription By
                      </p>

                      <h3 className="mt-1 text-2xl font-black">
                        Dr. {prescription.doctorName}
                      </h3>

                      <p className="mt-1 text-sm text-teal-50">
                        {prescription.department || "No department"} —{" "}
                        {prescription.specialization || "Medical Specialist"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-teal-50">
                      Prescription Date
                    </p>

                    <p className="mt-1 font-black">
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                      <FaCalendarCheck className="text-teal-700" />
                      Appointment Date
                    </div>

                    <p className="text-sm font-bold text-slate-600">
                      {prescription.appointmentDate}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                      <FaClock className="text-teal-700" />
                      Appointment Time
                    </div>

                    <p className="text-sm font-bold text-slate-600">
                      {prescription.appointmentTime}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaStethoscope className="text-teal-700" />
                    Diagnosis
                  </div>

                  <p className="text-sm leading-6 text-slate-500">
                    {prescription.diagnosis}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaPills className="text-teal-700" />
                    Medicines
                  </div>

                  {prescription.medicines?.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
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
                            {prescription.medicines.map((medicine, index) => (
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-500">
                        No medicine added.
                      </p>
                    </div>
                  )}
                </div>

                {prescription.advice && (
                  <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                      <FaNotesMedical className="text-teal-700" />
                      Advice
                    </div>

                    <p className="text-sm leading-6 text-slate-500">
                      {prescription.advice}
                    </p>
                  </div>
                )}

                {prescription.followUpDate && (
                  <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                    <p className="text-sm font-bold text-blue-700">
                      Follow-up Date:{" "}
                      <span className="font-black">
                        {prescription.followUpDate}
                      </span>
                    </p>
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

export default MyPrescriptions;