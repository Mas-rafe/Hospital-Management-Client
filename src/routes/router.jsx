import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Doctors from "../pages/public/Doctors";
import Departments from "../pages/public/Departments";
import Contact from "../pages/public/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardHome from "../pages/dashboard/DashboardHome";

import AdminHome from "../pages/dashboard/admin/AdminHome";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageDoctors from "../pages/dashboard/admin/ManageDoctors";
import ManageDepartments from "../pages/dashboard/admin/ManageDepartments";
import ManageAppointments from "../pages/dashboard/admin/ManageAppointments";
import ManagePayments from "../pages/dashboard/admin/ManagePayments";

import DoctorHome from "../pages/dashboard/doctor/DoctorHome";
import DoctorAppointments from "../pages/dashboard/doctor/MyAppointments";
import PatientDetails from "../pages/dashboard/doctor/PatientDetails";
import WritePrescription from "../pages/dashboard/doctor/WritePrescription";

import PatientHome from "../pages/dashboard/patient/PatientHome";
import BookAppointment from "../pages/dashboard/patient/BookAppointment";
import PatientAppointments from "../pages/dashboard/patient/MyAppointments";
import MyPrescriptions from "../pages/dashboard/patient/MyPrescriptions";
import PaymentHistory from "../pages/dashboard/patient/PaymentHistory";

import ReceptionistHome from "../pages/dashboard/receptionist/ReceptionistHome";
import RegisterPatient from "../pages/dashboard/receptionist/RegisterPatient";
import AppointmentRequests from "../pages/dashboard/receptionist/AppointmentRequests";
import PaymentUpdate from "../pages/dashboard/receptionist/PaymentUpdate";
import Appointments from "../pages/dashboard/receptionist/Appointments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/departments",
        element: <Departments />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      // =========================
      // Admin Routes
      // =========================
      {
        path: "admin",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminHome />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-doctors",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageDoctors />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-departments",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageDepartments />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-appointments",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageAppointments />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-payments",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManagePayments />
          </RoleRoute>
        ),
      },

      // =========================
      // Doctor Routes
      // =========================
      {
        path: "doctor",
        element: (
          <RoleRoute allowedRoles={["doctor"]}>
            <DoctorHome />
          </RoleRoute>
        ),
      },
      {
        path: "doctor/my-appointments",
        element: (
          <RoleRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
          </RoleRoute>
        ),
      },
      {
        path: "doctor/patient-details",
        element: (
          <RoleRoute allowedRoles={["doctor"]}>
            <PatientDetails />
          </RoleRoute>
        ),
      },
      {
        path: "doctor/write-prescription",
        element: (
          <RoleRoute allowedRoles={["doctor"]}>
            <WritePrescription />
          </RoleRoute>
        ),
      },

      // =========================
      // Patient Routes
      // =========================
      {
        path: "patient",
        element: (
          <RoleRoute allowedRoles={["patient"]}>
            <PatientHome />
          </RoleRoute>
        ),
      },
      {
        path: "patient/book-appointment",
        element: (
          <RoleRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </RoleRoute>
        ),
      },
      {
        path: "patient/my-appointments",
        element: (
          <RoleRoute allowedRoles={["patient"]}>
            <PatientAppointments />
          </RoleRoute>
        ),
      },
      {
        path: "patient/my-prescriptions",
        element: (
          <RoleRoute allowedRoles={["patient"]}>
            <MyPrescriptions />
          </RoleRoute>
        ),
      },
      {
        path: "patient/payment-history",
        element: (
          <RoleRoute allowedRoles={["patient"]}>
            <PaymentHistory />
          </RoleRoute>
        ),
      },

      // =========================
      // Receptionist Routes
      // =========================
      {
        path: "receptionist",
        element: (
          <RoleRoute allowedRoles={["receptionist"]}>
            <ReceptionistHome />
          </RoleRoute>
        ),
      },
      {
        path: "receptionist/register-patient",
        element: (
          <RoleRoute allowedRoles={["receptionist"]}>
            <RegisterPatient />
          </RoleRoute>
        ),
      },
      {
        path: "receptionist/appointment-requests",
        element: (
          <RoleRoute allowedRoles={["receptionist"]}>
            <AppointmentRequests />
          </RoleRoute>
        ),

      },
      {
        path: "receptionist/appointments",
        element: (
          <RoleRoute allowedRoles={["receptionist"]}>
            <Appointments />
          </RoleRoute>
        ),
      },
      {
        path: "receptionist/payment-update",
        element: (
          <RoleRoute allowedRoles={["receptionist"]}>
            <PaymentUpdate />
          </RoleRoute>
        ),
      },
    ],
  },
]);

export default router;