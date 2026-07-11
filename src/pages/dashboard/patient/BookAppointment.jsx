import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaUserMd,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const BookAppointment = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const doctorIdFromUrl = searchParams.get("doctorId");

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    doctorIdFromUrl || ""
  );

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, doctorsRes] = await Promise.all([
          axios.get(`${API_URL}/active-departments`),
          axios.get(`${API_URL}/active-doctors`),
        ]);

        if (departmentsRes.data.success) {
          setDepartments(departmentsRes.data.departments);
        }

        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.doctors);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Data",
          text: "Could not load doctors or departments.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  useEffect(() => {
    if (doctorIdFromUrl && doctors.length > 0) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor._id === doctorIdFromUrl
      );

      if (selectedDoctor?.department) {
        setDepartmentFilter(selectedDoctor.department);
      }

      setSelectedDoctorId(doctorIdFromUrl);
    }
  }, [doctorIdFromUrl, doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.specialization
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || doctor.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [doctors, searchText, departmentFilter]);

  const selectedDoctor = doctors.find(
    (doctor) => doctor._id === selectedDoctorId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      Swal.fire({
        icon: "warning",
        title: "Select Doctor",
        text: "Please select a doctor first.",
      });
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      Swal.fire({
        icon: "warning",
        title: "Date and Time Required",
        text: "Please select appointment date and time.",
      });
      return;
    }

    try {
      const appointmentInfo = {
        doctorId: selectedDoctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      };

      const res = await axios.post(`${API_URL}/appointments`, appointmentInfo, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Appointment Request Submitted",
          text: "Your appointment is pending. Receptionist will confirm it.",
        });

        navigate("/dashboard/patient/my-appointments");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while booking appointment.",
      });
    }
  };

  if (user?.role !== "patient") {
    return (
      <section className="rounded-3xl border border-red-100 bg-red-50 p-8">
        <h1 className="text-2xl font-black text-red-700">Access Denied</h1>
        <p className="mt-2 text-sm font-bold text-red-600">
          Only patients can book appointments.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-black text-teal-700">
          Loading appointment form...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-emerald-50">
          Patient Service
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Book Appointment
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
          Select an approved doctor, choose your appointment date and time, then
          submit your request for receptionist confirmation.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <FaSearch className="text-slate-400" />

                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="all">All Departments</option>

                {departments.map((department) => (
                  <option key={department._id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <button
                type="button"
                key={doctor._id}
                onClick={() => setSelectedDoctorId(doctor._id)}
                className={`rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  selectedDoctorId === doctor._id
                    ? "border-teal-500 ring-4 ring-teal-100"
                    : "border-slate-200 hover:border-teal-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
                    <FaUserMd />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Dr. {doctor.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {doctor.specialization || "Medical Specialist"}
                    </p>

                    <p className="mt-1 text-sm text-teal-700">
                      {doctor.department || "No department"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-500">Fee</p>
                    <p className="mt-1 font-black text-slate-900">
                      ৳{doctor.fee || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-500">Time</p>
                    <p className="mt-1 text-sm font-black text-slate-900">
                      {doctor.availableTime || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.availableDays?.length ? (
                    doctor.availableDays.map((day) => (
                      <span
                        key={day}
                        className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      No available days
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-black text-slate-800">
                No doctors found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another department or search term.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24 xl:h-fit">
          <h2 className="text-2xl font-black text-slate-900">
            Appointment Request
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your request will be pending until receptionist confirms it.
          </p>

          {selectedDoctor ? (
            <div className="mt-5 rounded-2xl bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-700">
                Selected Doctor
              </p>

              <h3 className="mt-1 font-black text-slate-900">
                Dr. {selectedDoctor.name}
              </h3>

              <p className="text-sm text-slate-600">
                {selectedDoctor.department || "No department"} —{" "}
                {selectedDoctor.specialization || "Medical Specialist"}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">
                No doctor selected yet.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Appointment Date
              </label>

              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointmentDate: e.target.value,
                  })
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Appointment Time
              </label>

              <input
                type="text"
                value={formData.appointmentTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointmentTime: e.target.value,
                  })
                }
                placeholder="Example: 10:30 AM"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Reason / Problem
              </label>

              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reason: e.target.value,
                  })
                }
                placeholder="Write your problem shortly..."
                className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600"
              ></textarea>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
            >
              <FaCalendarCheck />
              Submit Appointment Request
            </button>
          </form>

          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <FaClock className="text-teal-700" />
              Confirmation handled by receptionist.
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <FaMoneyBillWave className="text-teal-700" />
              Payment status will be updated later.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookAppointment;