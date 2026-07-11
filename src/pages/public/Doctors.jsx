import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClock,
  FaLock,
  FaMoneyBillWave,
  FaSearch,
  FaUserMd,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Doctors = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const selectedDepartmentFromUrl = searchParams.get("department") || "all";

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState(
    selectedDepartmentFromUrl
  );

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    setDepartmentFilter(selectedDepartmentFromUrl);
  }, [selectedDepartmentFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, departmentsRes] = await Promise.all([
          axios.get(`${API_URL}/active-doctors`),
          axios.get(`${API_URL}/active-departments`),
        ]);

        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.doctors);
        }

        if (departmentsRes.data.success) {
          setDepartments(departmentsRes.data.departments);
        }
      } catch (error) {
        console.log("Failed to load doctors:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchText.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || doctor.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [doctors, searchText, departmentFilter]);

  const renderBookingButton = (doctor) => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
        >
          <FaLock />
          Login to Book
        </Link>
      );
    }

    if (user.role === "patient") {
      return (
        <Link
          to={`/dashboard/patient/book-appointment?doctorId=${doctor._id}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-800"
        >
          <FaCalendarCheck />
          Book Appointment
        </Link>
      );
    }

    return (
      <button
        disabled
        className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-400"
      >
        <FaLock />
        Patient Booking Only
      </button>
    );
  };

  if (loading) {
    return (
      <section className="mx-auto my-16 w-[min(1180px,92%)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-teal-700">
            Loading doctors...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto my-14 w-[min(1180px,92%)]">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-8 text-white shadow-xl shadow-slate-900/20 md:p-12">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Approved Doctors
        </p>

        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          Find the Right Doctor
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50 md:text-base">
          Browse approved doctors by department, specialization, fee, and
          available time before booking an appointment.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search doctors by name, department, specialization..."
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

      {departmentFilter !== "all" && (
        <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <p className="text-sm font-bold text-teal-800">
            Showing doctors from:{" "}
            <span className="font-black">{departmentFilter}</span>
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-teal-700 to-cyan-600 p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                  <FaUserMd />
                </div>

                <div>
                  <h3 className="text-xl font-black">Dr. {doctor.name}</h3>
                  <p className="mt-1 text-sm text-teal-50">
                    {doctor.specialization || "Medical Specialist"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Department
                  </p>
                  <h4 className="mt-1 font-black text-slate-900">
                    {doctor.department || "Not assigned"}
                  </h4>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <FaMoneyBillWave />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Fee</p>
                    <h4 className="mt-1 font-black text-slate-900">
                      ৳{doctor.fee || 0}
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <FaClock />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Time</p>
                    <h4 className="mt-1 text-sm font-black text-slate-900">
                      {doctor.availableTime || "Not set"}
                    </h4>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Available Days
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
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
                        No days added
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {renderBookingButton(doctor)}
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-800">
            No approved doctors found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Approve doctors from the admin dashboard first or change your
            search/filter.
          </p>
        </div>
      )}
    </section>
  );
};

export default Doctors;