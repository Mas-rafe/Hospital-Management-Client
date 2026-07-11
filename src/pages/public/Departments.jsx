import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHospital, FaSearch } from "react-icons/fa";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/active-departments`);

        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (error) {
        console.log("Failed to load departments:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [API_URL]);

  const filteredDepartments = departments.filter((department) => {
    return (
      department.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  if (loading) {
    return (
      <section className="mx-auto my-16 w-[min(1180px,92%)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-black text-teal-700">
            Loading departments...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto my-14 w-[min(1180px,92%)]">
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-8 text-white shadow-xl shadow-teal-900/20 md:p-12">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Hospital Departments
        </p>

        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          Explore Our Medical Departments
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50 md:text-base">
          Choose a department and view approved doctors available for that
          department.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
          <FaSearch className="text-slate-400" />

          <input
            type="text"
            placeholder="Search departments..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
          <Link
            to={`/doctors?department=${encodeURIComponent(department.name)}`}
            key={department._id}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
              <FaHospital />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              {department.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {department.description || "Professional hospital department."}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                Active Department
              </span>

              <span className="inline-flex items-center gap-2 text-sm font-black text-teal-700">
                View Doctors <FaArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-800">
            No departments found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Try searching with another department name.
          </p>
        </div>
      )}
    </section>
  );
};

export default Departments;