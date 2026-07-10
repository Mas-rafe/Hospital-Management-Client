import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const ReceptionistHome = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Appointment Requests",
      value: 0,
      icon: <FaCalendarCheck />,
      note: "Waiting for confirmation",
    },
    {
      title: "Today’s Appointments",
      value: 0,
      icon: <FaUsers />,
      note: "Scheduled for today",
    },
    {
      title: "Pending Payments",
      value: 0,
      icon: <FaMoneyBillWave />,
      note: "Need payment update",
    },
  ];

  const actions = [
    {
      title: "Register Patient",
      text: "Create a new patient profile quickly.",
      to: "/dashboard/receptionist/register-patient",
      icon: <FaUserPlus />,
    },
    {
      title: "Appointment Requests",
      text: "Confirm or reject appointment requests.",
      to: "/dashboard/receptionist/appointment-requests",
      icon: <FaCalendarCheck />,
    },
    {
      title: "Payment Update",
      text: "Update patient payment information.",
      to: "/dashboard/receptionist/payment-update",
      icon: <FaMoneyBillWave />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
            Receptionist Panel
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            Welcome, {user?.name || "Receptionist"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
            Manage patient registration, appointment requests, and payment
            updates from one clean control panel.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-100"></div>

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

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start your daily receptionist tasks from here.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Today’s Overview</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">
                Current Status
              </p>
              <h3 className="mt-1 text-lg font-black text-teal-700">
                Ready to manage patients
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Logged in as</p>
              <h3 className="mt-1 text-lg font-black capitalize text-slate-900">
                {user?.role}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Email</p>
              <h3 className="mt-1 break-words text-sm font-bold text-slate-700">
                {user?.email}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceptionistHome;