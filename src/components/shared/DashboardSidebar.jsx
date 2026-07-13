import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaFilePrescription,
  FaHome,
  FaHospital,
  FaListUl,
  FaMoneyBillWave,
  FaTimes,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
    });

    navigate("/");
  };

  const adminLinks = [
    { to: "/dashboard/admin", label: "Admin Home", icon: <MdDashboard /> },
    {
      to: "/dashboard/admin/manage-users",
      label: "Manage Users",
      icon: <FaUsers />,
    },
    {
      to: "/dashboard/admin/manage-doctors",
      label: "Manage Doctors",
      icon: <FaUserMd />,
    },
    {
      to: "/dashboard/admin/manage-departments",
      label: "Departments",
      icon: <FaHospital />,
    },
    {
      to: "/dashboard/admin/manage-appointments",
      label: "Appointments",
      icon: <FaCalendarCheck />,
    },
    // {
    //   to: "/dashboard/admin/manage-payments",
    //   label: "Payments",
    //   icon: <FaMoneyBillWave />,
    // },
  ];

  const doctorLinks = [
    { to: "/dashboard/doctor", label: "Doctor Home", icon: <MdDashboard /> },
    {
      to: "/dashboard/doctor/my-appointments",
      label: "My Appointments",
      icon: <FaCalendarCheck />,
    },
    {
      to: "/dashboard/doctor/patient-details",
      label: "Patient Details",
      icon: <FaUsers />,
    },
    {
      to: "/dashboard/doctor/write-prescription",
      label: "Write Prescription",
      icon: <FaFilePrescription />,
    },
  ];

  const patientLinks = [
    { to: "/dashboard/patient", label: "Patient Home", icon: <MdDashboard /> },
    {
      to: "/dashboard/patient/book-appointment",
      label: "Book Appointment",
      icon: <FaCalendarCheck />,
    },
    {
      to: "/dashboard/patient/my-appointments",
      label: "My Appointments",
      icon: <FaCalendarCheck />,
    },
    {
      to: "/dashboard/patient/my-prescriptions",
      label: "My Prescriptions",
      icon: <FaFilePrescription />,
    },
    // {
    //   to: "/dashboard/patient/payment-history",
    //   label: "Payment History",
    //   icon: <FaMoneyBillWave />,
    // },
  ];

  const receptionistLinks = [
    {
      to: "/dashboard/receptionist",
      label: "Receptionist Home",
      icon: <MdDashboard />,
    },
    {
      to: "/dashboard/receptionist/register-patient",
      label: "Register Patient",
      icon: <FaUsers />,
    },
    {
      to: "/dashboard/receptionist/appointment-requests",
      label: "Appointment Requests",
      icon: <FaCalendarCheck />,
    },
    {
      to: "/dashboard/receptionist/appointments",
      label: "Appointments",
      icon: <FaListUl />, // Remember to import FaListUl from "react-icons/fa" at the top if you haven't yet!
    },

    // {
    //   to: "/dashboard/receptionist/payment-update",
    //   label: "Payment Update",
    //   icon: <FaMoneyBillWave />,
    // },
  ];

  let dashboardLinks = patientLinks;

  if (user?.role === "admin") dashboardLinks = adminLinks;
  if (user?.role === "doctor") dashboardLinks = doctorLinks;
  if (user?.role === "receptionist") dashboardLinks = receptionistLinks;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${isActive
      ? "bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow-lg shadow-teal-900/20"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[290px] flex-col overflow-y-auto bg-slate-950 px-4 py-5 text-white transition-transform duration-300 lg:sticky lg:z-20 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 text-xl font-black text-white"
        >
          <FaHospital className="text-2xl text-teal-300" />
          <span>MediCare HMS</span>
        </Link>

        <button
          onClick={closeSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-teal-300/20 bg-gradient-to-br from-teal-500/20 to-slate-900 p-5 text-center shadow-xl">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="mx-auto mb-3 h-20 w-20 rounded-full border-4 border-teal-300/50 object-cover"
          />
        ) : (
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-teal-300/50 bg-gradient-to-br from-teal-700 to-teal-400 text-3xl font-black text-white">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <h3 className="text-base font-black text-white">{user?.name}</h3>
        <p className="mt-1 break-words text-xs text-slate-300">{user?.email}</p>
        <span className="mt-3 inline-block rounded-full bg-teal-400/10 px-3 py-1 text-xs font-extrabold capitalize text-teal-200">
          {user?.role}
        </span>
      </div>

      <p className="mb-3 px-3 text-xs font-black uppercase tracking-wider text-slate-500">
        Main Menu
      </p>

      <nav className="flex flex-1 flex-col gap-2">
        {dashboardLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeSidebar}
            className={linkClass}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <Link
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <FaHome className="text-lg" />
          <span>Back to Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-3 text-left text-sm font-extrabold text-red-200 transition hover:bg-red-600 hover:text-white"
        >
          <MdLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;