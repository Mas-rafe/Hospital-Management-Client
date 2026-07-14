import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;

    const loginInfo = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const res = await axios.post("https://hospital-management-server-08o3.onrender.com/login", loginInfo);

      if (res.data.success) {
        saveAuthData(res.data);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back to MediCare HMS.",
        });

        form.reset();
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("https://hospital-management-server-08o3.onrender.com/google-login", {
        credential: credentialResponse.credential,
        mode: "login",
      });

      if (res.data.success) {
        saveAuthData(res.data);

        Swal.fire({
          icon: "success",
          title: "Google Login Successful",
          text: "You are logged in successfully.",
        });

        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong with Google login.",
      });
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Access your hospital dashboard.</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <button className="btn-primary full" type="submit">
            Login
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="google-box">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              Swal.fire({
                icon: "error",
                title: "Google Login Failed",
                text: "Please try again.",
              });
            }}
          />
        </div>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login; 