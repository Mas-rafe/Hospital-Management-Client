import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaFilePrescription,
  FaUserInjured,
  FaUsers,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const DoctorHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "My Appointments",
      value: 0,
      icon: <FaCalendarCheck />,
      note: "Assigned appointments",
    },
    {
      title: "Today’s Patients",
      value: 0,
      icon: <FaUserInjured />,
      note: "Patients scheduled today",
    },
    {
      title: "Prescriptions",
      value: 0,
      icon: <FaFilePrescription />,
      note: "Written prescriptions",
    },
  ];

  const actions = [
    {
      title: "My Appointments",
      text: "View and manage your assigned appointments.",
      to: "/dashboard/doctor/my-appointments",
      icon: <FaCalendarCheck />,
    },
    {
      title: "Patient Details",
      text: "Check patient information before consultation.",
      to: "/dashboard/doctor/patient-details",
      icon: <FaUsers />,
    },
    {
      title: "Write Prescription",
      text: "Create prescriptions for completed consultations.",
      to: "/dashboard/doctor/write-prescription",
      icon: <FaFilePrescription />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-800 via-teal-700 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-blue-50">
          Doctor Panel
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Welcome, Dr. {user?.name || "Doctor"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
          Manage appointments, review patient details, and write prescriptions
          from your professional doctor dashboard.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100"></div>

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-500">
                  {item.title}
                </h3>

                <p className="mt-4 text-4xl font-black text-teal-700">
                  {item.value}
                </p>

                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-teal-700">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Start your doctor activities from here.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-200 hover:bg-teal-50"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-lg text-white">
                {action.icon}
              </div>

              <h3 className="font-black text-slate-900">{action.title}</h3>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                {action.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorHome;