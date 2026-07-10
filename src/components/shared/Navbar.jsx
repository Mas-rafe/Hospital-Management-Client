import { NavLink, Link } from "react-router-dom";
import { FaHospitalUser } from "react-icons/fa";

const Navbar = () => {
  const links = (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/doctors">Doctors</NavLink>
      <NavLink to="/departments">Departments</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </>
  );

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <FaHospitalUser />
          <span>MediCare HMS</span>
        </Link>

        <nav className="nav-links">{links}</nav>

        <div className="nav-actions">
          <Link to="/login" className="btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;