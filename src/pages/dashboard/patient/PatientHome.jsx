import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaFilePrescription,
  FaMoneyBillWave,
  FaUserClock,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const PatientHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "My Appointments",
      value: 0,
      icon: <FaCalendarCheck />,
      note: "Total booked appointments",
    },
    {
      title: "Pending Visits",
      value: 0,
      icon: <FaUserClock />,
      note: "Waiting for confirmation",
    },
    {
      title: "Prescriptions",
      value: 0,
      icon: <FaFilePrescription />,
      note: "Available prescriptions",
    },
    {
      title: "Payments",
      value: 0,
      icon: <FaMoneyBillWave />,
      note: "Payment records",
    },
  ];

  const actions = [
    {
      title: "Book Appointment",
      text: "Choose a doctor and request an appointment.",
      to: "/dashboard/patient/book-appointment",
      icon: <FaCalendarCheck />,
    },
    {
      title: "My Appointments",
      text: "View your appointment status and history.",
      to: "/dashboard/patient/my-appointments",
      icon: <FaUserClock />,
    },
    {
      title: "My Prescriptions",
      text: "Check prescriptions written by doctors.",
      to: "/dashboard/patient/my-prescriptions",
      icon: <FaFilePrescription />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-emerald-50">
          Patient Panel
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Welcome, {user?.name || "Patient"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
          Book appointments, track your visits, view prescriptions, and manage
          payment records from your patient dashboard.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100"></div>

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

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-teal-700">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Start managing your hospital services from here.
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

export default PatientHome;