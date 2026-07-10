import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserDoctor,
  FaCalendarCheck,
  FaHospital,
  FaMoneyBillWave,
  FaFilePrescription,
} from "react-icons/fa6";
import { MdDashboard, MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
    });

    navigate("/");
  };

  const adminLinks = (
    <>
      <NavLink to="/dashboard/admin">
        <MdDashboard /> Admin Home
      </NavLink>
      <NavLink to="/dashboard/admin/manage-users">
        <FaUsers /> Manage Users
      </NavLink>
      <NavLink to="/dashboard/admin/manage-doctors">
        <FaUserDoctor /> Manage Doctors
      </NavLink>
      <NavLink to="/dashboard/admin/manage-departments">
        <FaHospital /> Manage Departments
      </NavLink>
      <NavLink to="/dashboard/admin/manage-appointments">
        <FaCalendarCheck /> Manage Appointments
      </NavLink>
      <NavLink to="/dashboard/admin/manage-payments">
        <FaMoneyBillWave /> Manage Payments
      </NavLink>
    </>
  );

  const patientLinks = (
    <>
      <NavLink to="/dashboard/patient">
        <MdDashboard /> Patient Home
      </NavLink>
      <NavLink to="/dashboard/patient/book-appointment">
        <FaCalendarCheck /> Book Appointment
      </NavLink>
      <NavLink to="/dashboard/patient/my-appointments">
        <FaCalendarCheck /> My Appointments
      </NavLink>
      <NavLink to="/dashboard/patient/my-prescriptions">
        <FaFilePrescription /> My Prescriptions
      </NavLink>
      <NavLink to="/dashboard/patient/payment-history">
        <FaMoneyBillWave /> Payment History
      </NavLink>
    </>
  );

  const doctorLinks = (
    <>
      <NavLink to="/dashboard/doctor">
        <MdDashboard /> Doctor Home
      </NavLink>
      <NavLink to="/dashboard/doctor/my-appointments">
        <FaCalendarCheck /> My Appointments
      </NavLink>
      <NavLink to="/dashboard/doctor/patient-details">
        <FaUsers /> Patient Details
      </NavLink>
      <NavLink to="/dashboard/doctor/write-prescription">
        <FaFilePrescription /> Write Prescription
      </NavLink>
    </>
  );

  const receptionistLinks = (
    <>
      <NavLink to="/dashboard/receptionist">
        <MdDashboard /> Receptionist Home
      </NavLink>
      <NavLink to="/dashboard/receptionist/register-patient">
        <FaUsers /> Register Patient
      </NavLink>
      <NavLink to="/dashboard/receptionist/appointment-requests">
        <FaCalendarCheck /> Appointment Requests
      </NavLink>
      <NavLink to="/dashboard/receptionist/payment-update">
        <FaMoneyBillWave /> Payment Update
      </NavLink>
    </>
  );

  return (
    <aside className="dashboard-sidebar">
      <Link to="/" className="dashboard-logo">
        <FaHospital />
        <span>MediCare HMS</span>
      </Link>

      <div className="dashboard-user">
        {user?.image ? (
          <img src={user.image} alt={user.name} />
        ) : (
          <div className="dashboard-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <h3>{user?.name}</h3>
        <p>{user?.role}</p>
      </div>

      <nav className="dashboard-nav">
        {user?.role === "admin" && adminLinks}
        {user?.role === "patient" && patientLinks}
        {user?.role === "doctor" && doctorLinks}
        {user?.role === "receptionist" && receptionistLinks}
      </nav>

      <div className="dashboard-bottom">
        <Link to="/" className="dashboard-back-home">
          <FaHome /> Back to Home
        </Link>

        <button onClick={handleLogout} className="dashboard-logout">
          <MdLogout /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;