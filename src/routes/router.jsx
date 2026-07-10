import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

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

      {
        path: "admin",
        element: <AdminHome />,
      },
      {
        path: "admin/manage-users",
        element: <ManageUsers />,
      },
      {
        path: "admin/manage-doctors",
        element: <ManageDoctors />,
      },
      {
        path: "admin/manage-departments",
        element: <ManageDepartments />,
      },
      {
        path: "admin/manage-appointments",
        element: <ManageAppointments />,
      },
      {
        path: "admin/manage-payments",
        element: <ManagePayments />,
      },

      {
        path: "doctor",
        element: <DoctorHome />,
      },
      {
        path: "doctor/my-appointments",
        element: <DoctorAppointments />,
      },
      {
        path: "doctor/patient-details",
        element: <PatientDetails />,
      },
      {
        path: "doctor/write-prescription",
        element: <WritePrescription />,
      },

      {
        path: "patient",
        element: <PatientHome />,
      },
      {
        path: "patient/book-appointment",
        element: <BookAppointment />,
      },
      {
        path: "patient/my-appointments",
        element: <PatientAppointments />,
      },
      {
        path: "patient/my-prescriptions",
        element: <MyPrescriptions />,
      },
      {
        path: "patient/payment-history",
        element: <PaymentHistory />,
      },

      {
        path: "receptionist",
        element: <ReceptionistHome />,
      },
      {
        path: "receptionist/register-patient",
        element: <RegisterPatient />,
      },
      {
        path: "receptionist/appointment-requests",
        element: <AppointmentRequests />,
      },
      {
        path: "receptionist/payment-update",
        element: <PaymentUpdate />,
      },
    ],
  },
]);

export default router;