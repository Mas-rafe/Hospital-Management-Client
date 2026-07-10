import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaHospitalUser } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
    });

    navigate("/");
  };

  const links = (
    <>
      <NavLink onClick={() => setMenuOpen(false)} to="/">
        Home
      </NavLink>
      <NavLink onClick={() => setMenuOpen(false)} to="/about">
        About
      </NavLink>
      <NavLink onClick={() => setMenuOpen(false)} to="/doctors">
        Doctors
      </NavLink>
      <NavLink onClick={() => setMenuOpen(false)} to="/departments">
        Departments
      </NavLink>
      <NavLink onClick={() => setMenuOpen(false)} to="/contact">
        Contact
      </NavLink>
    </>
  );

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <FaHospitalUser />
          <span>MediCare HMS</span>
        </Link>

        <nav className="nav-links desktop-menu">{links}</nav>

        <div className="nav-actions desktop-actions">
          {user ? (
            <>
              <div className="user-mini">
                {user.image ? (
                  <img src={user.image} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                )}

                <div>
                  <p>{user.name}</p>
                  <small>{user.role}</small>
                </div>
              </div>

              <Link to="/dashboard" className="btn-outline">
                Dashboard
              </Link>

              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <nav>{links}</nav>

          <div className="mobile-actions">
            {user ? (
              <>
                <div className="user-mini mobile-user-mini">
                  {user.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                  )}

                  <div>
                    <p>{user.name}</p>
                    <small>{user.role}</small>
                  </div>
                </div>

                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/dashboard"
                  className="btn-outline full"
                >
                  Dashboard
                </Link>

                <button onClick={handleLogout} className="btn-primary full">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/login"
                  className="btn-outline full"
                >
                  Login
                </Link>

                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/register"
                  className="btn-primary full"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;