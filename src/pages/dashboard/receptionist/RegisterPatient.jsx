import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaAddressCard,
  FaEnvelope,
  FaKey,
  FaPhone,
  FaTint,
  FaUserInjured,
  FaUserPlus,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const RegisterPatient = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
    temporaryPassword: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      address: "",
      emergencyContact: "",
      temporaryPassword: "",
    });
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Information Missing",
        text: "Patient name, email, and phone are required.",
      });
      return;
    }

    if (
      formData.temporaryPassword &&
      formData.temporaryPassword.trim().length < 6
    ) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Temporary password must be at least 6 characters.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/receptionist/register-patient`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const patientLoginInfo = {
          name: formData.name,
          email: formData.email,
          temporaryPassword: res.data.temporaryPassword,
        };

        setRegisteredPatient(patientLoginInfo);

        await Swal.fire({
          icon: "success",
          title: "Patient Registered",
          html: `
            <p>${res.data.message}</p>
            <br/>
            <b>Login Email:</b> ${formData.email}<br/>
            <b>Temporary Password:</b> ${res.data.temporaryPassword}
          `,
        });

        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while registering patient.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
        <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-teal-50">
          Receptionist Dashboard
        </p>

        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Register Patient
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-teal-50 sm:text-base">
          Register walk-in or offline patients. After registration, the patient
          can login using email and temporary password.
        </p>
      </div>

      {registeredPatient && (
        <div className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-sm">
          <h2 className="text-xl font-black text-green-700">
            Latest Registered Patient Login
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Name
              </p>
              <p className="mt-1 font-black text-slate-900">
                {registeredPatient.name}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all font-black text-slate-900">
                {registeredPatient.email}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Temporary Password
              </p>
              <p className="mt-1 font-black text-green-700">
                {registeredPatient.temporaryPassword}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleRegisterPatient}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700">
            <FaUserPlus />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Patient Information
            </h2>
            <p className="text-sm text-slate-500">
              Fill the patient details carefully.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Patient Name <span className="text-red-500">*</span>
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaUserInjured className="text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Patient full name"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaEnvelope className="text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@email.com"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Phone <span className="text-red-500">*</span>
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaPhone className="text-slate-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Temporary Password
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaKey className="text-slate-400" />
              <input
                type="text"
                name="temporaryPassword"
                value={formData.temporaryPassword}
                onChange={handleChange}
                placeholder="Leave empty to auto-generate"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-teal-600"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Blood Group
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaTint className="text-slate-400" />
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border-0 bg-transparent p-0 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Emergency Contact
            </label>

            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaPhone className="text-slate-400" />
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-black text-slate-700">
              Address
            </label>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FaAddressCard className="mt-1 text-slate-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Patient address"
                className="min-h-24 w-full resize-none border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3 text-sm font-black text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <FaUserPlus />
            {loading ? "Registering..." : "Register Patient"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-2xl bg-slate-100 px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            Clear Form
          </button>
        </div>
      </form>
    </section>
  );
};

export default RegisterPatient;