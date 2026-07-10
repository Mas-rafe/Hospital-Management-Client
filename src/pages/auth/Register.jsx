import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();
  const [selectedRole, setSelectedRole] = useState("patient");

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;

    const userInfo = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      role: form.role.value,
      password: form.password.value,
    };

    try {
      const res = await axios.post("http://localhost:5000/register", userInfo);

      if (res.data.success) {
        if (res.data.token && res.data.user) {
          saveAuthData(res.data);
        }

        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text:
            userInfo.role === "doctor"
              ? "Your doctor account is pending admin approval."
              : "Your account has been created successfully.",
        });

        form.reset();
        setSelectedRole("patient");
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/google-login", {
        credential: credentialResponse.credential,
        role: selectedRole,
      });

      if (res.data.success) {
        saveAuthData(res.data);

        Swal.fire({
          icon: "success",
          title: "Google Sign-In Successful",
          text:
            selectedRole === "doctor"
              ? "Your doctor account is pending admin approval."
              : "You are logged in successfully.",
        });

        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong with Google sign-in.",
      });
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <p>Create your hospital account.</p>

        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            required
          />

          <label>Role</label>
          <select
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            required
          />

          <button className="btn-primary full" type="submit">
            Register
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="google-role-text">
          Google Sign-In will register you as:{" "}
          <strong>{selectedRole.toUpperCase()}</strong>
        </p>

        <div className="google-box">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              Swal.fire({
                icon: "error",
                title: "Google Sign-In Failed",
                text: "Please try again.",
              });
            }}
          />
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;