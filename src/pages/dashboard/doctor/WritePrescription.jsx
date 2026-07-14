import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaClock,
  FaFilePrescription,
  FaPlus,
  FaStethoscope,
  FaTrash,
  FaUserInjured,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const WritePrescription = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const appointmentId = searchParams.get("appointmentId");

  const [appointment, setAppointment] = useState(null);
  const [prescriptionExists, setPrescriptionExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    diagnosis: "",
    advice: "",
    followUpDate: "",
  });

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      duration: "",
      instruction: "",
    },
  ]);

  const API_URL = import.meta.env.VITE_API_URL || "https://hospital-management-server-08o3.onrender.com";

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/doctor-appointment/${appointmentId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setAppointment(res.data.appointment);
          setPrescriptionExists(res.data.prescriptionExists);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Appointment",
          text:
            error.response?.data?.message ||
            "Something went wrong while loading appointment.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointment();
    }
  }, [appointmentId, token, API_URL]);

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        duration: "",
        instruction: "",
      },
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "At least one row needed",
        text: "You can keep the row empty if no medicine is needed.",
      });
      return;
    }

    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentId) {
      Swal.fire({
        icon: "error",
        title: "Appointment Missing",
        text: "Appointment ID was not found.",
      });
      return;
    }

    if (!formData.diagnosis.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Diagnosis Required",
        text: "Please write the diagnosis.",
      });
      return;
    }

    try {
      const prescriptionInfo = {
        appointmentId,
        diagnosis: formData.diagnosis,
        medicines,
        advice: formData.advice,
        followUpDate: formData.followUpDate,
      };

      const res = await axios.post(
        `${API_URL}/prescriptions`,
        prescriptionInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Prescription Submitted",
          text: "Appointment has been marked as completed.",
        });

        navigate("/dashboard/doctor/my-appointments");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while submitting prescription.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading prescription page...
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
          Please open this page from Doctor → My Appointments.
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
          Appointment Not Found
        </h1>
        <p className="mt-2 text-sm font-bold text-red-600">
          This appointment may not be confirmed or may not belong to you.
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

  if (prescriptionExists) {
    return (
      <section className="rounded-3xl border border-yellow-100 bg-yellow-50 p-8">
        <h1 className="text-2xl font-black text-yellow-700">
          Prescription Already Submitted
        </h1>
        <p className="mt-2 text-sm font-bold text-yellow-700">
          A prescription already exists for this appointment.
        </p>

        <Link
          to="/dashboard/doctor/my-appointments"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-yellow-600 px-5 py-3 text-sm font-black text-white"
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
          Doctor Consultation
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Write Prescription
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-teal-50 sm:text-base">
          Add diagnosis, medicines, advice, and follow-up date. After
          submission, this appointment will be marked as completed.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[370px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                <FaUserInjured />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Patient
                </p>
                <h3 className="text-xl font-black text-slate-900">
                  {appointment.patientName}
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-sm font-bold text-slate-500">
              <p>{appointment.patientEmail}</p>
              <p>{appointment.patientPhone || "No phone number"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Appointment Info
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

              {appointment.reason && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                    <FaStethoscope className="text-teal-700" />
                    Patient Problem
                  </div>
                  <p className="text-sm leading-6 text-slate-500">
                    {appointment.reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
              <FaFilePrescription />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Prescription Form
              </h2>
              <p className="text-sm text-slate-500">
                Fill carefully before submitting.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Diagnosis <span className="text-red-500">*</span>
              </label>

              <textarea
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    diagnosis: e.target.value,
                  })
                }
                placeholder="Example: Viral fever with mild cough..."
                className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600"
              ></textarea>
            </div>

            <div>
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-black text-slate-700">
                  Medicines
                </label>

                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-50 px-4 py-2 text-xs font-black text-teal-700 transition hover:bg-teal-100"
                >
                  <FaPlus />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-700">
                        Medicine {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                      >
                        <FaTrash />
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Medicine name"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
                      />

                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        placeholder="Dosage: 1+0+1"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
                      />

                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="Duration: 5 days"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
                      />

                      <input
                        type="text"
                        value={medicine.instruction}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "instruction",
                            e.target.value
                          )
                        }
                        placeholder="Instruction: After meal"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Advice
              </label>

              <textarea
                value={formData.advice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    advice: e.target.value,
                  })
                }
                placeholder="Example: Take rest, drink enough water..."
                className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600"
              ></textarea>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Follow-up Date
              </label>

              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followUpDate: e.target.value,
                  })
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
              >
                <FaFilePrescription />
                Submit Prescription
              </button>

              <Link
                to="/dashboard/doctor/my-appointments"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
              >
                <FaArrowLeft />
                Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default WritePrescription;