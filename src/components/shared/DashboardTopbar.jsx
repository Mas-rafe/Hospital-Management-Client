import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaBell, FaHome, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const DashboardTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/dashboard/admin": "Admin Dashboard",
    "/dashboard/admin/manage-users": "Manage Users",
    "/dashboard/admin/manage-doctors": "Manage Doctors",
    "/dashboard/admin/manage-departments": "Departments",
    "/dashboard/admin/manage-appointments": "Appointments",
    "/dashboard/admin/manage-payments": "Payments",

    "/dashboard/doctor": "Doctor Dashboard",
    "/dashboard/doctor/my-appointments": "My Appointments",
    "/dashboard/doctor/patient-details": "Patient Details",
    "/dashboard/doctor/write-prescription": "Write Prescription",

    "/dashboard/patient": "Patient Dashboard",
    "/dashboard/patient/book-appointment": "Book Appointment",
    "/dashboard/patient/my-appointments": "My Appointments",
    "/dashboard/patient/my-prescriptions": "My Prescriptions",
    "/dashboard/patient/payment-history": "Payment History",

    "/dashboard/receptionist": "Receptionist Dashboard",
    "/dashboard/receptionist/register-patient": "Register Patient",
    "/dashboard/receptionist/appointment-requests": "Appointment Requests",
    "/dashboard/receptionist/payment-update": "Payment Update",
  };

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    logout();

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
    });

    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 xl:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 items-center gap-2 rounded-xl bg-teal-50 px-3 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100 lg:hidden"
        >
          <HiMenuAlt2 className="text-xl" />
          <span>Menu</span>
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-black text-slate-900 sm:text-xl xl:text-2xl">
            {currentTitle}
          </h2>
          <p className="hidden text-sm text-slate-500 sm:block">
            MediCare HMS control panel
          </p>
        </div>
      </div>

      <div className="hidden flex-1 justify-center xl:flex">
        <div className="flex h-11 w-full max-w-md items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100"
        >
          <FaHome />
          <span className="hidden sm:inline">Website</span>
        </Link>

        <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-teal-700 transition hover:bg-slate-50 md:flex">
          <FaBell />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm sm:px-3 sm:py-1.5">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-sm font-black text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          )}

          <div className="hidden leading-tight sm:block">
            <h4 className="text-xs font-black text-slate-900">{user?.name}</h4>
            <p className="text-[11px] capitalize text-slate-500">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="hidden rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-teal-800 2xl:block"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;