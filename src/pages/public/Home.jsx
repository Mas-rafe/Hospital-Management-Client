import { Link } from "react-router-dom";
import { FaUserDoctor, FaCalendarCheck, FaFilePrescription } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <p className="badge">Smart Healthcare Solution</p>
          <h1>Modern Hospital Management System</h1>
          <p>
            Manage doctors, patients, appointments, prescriptions, departments,
            payments, and hospital users from one secure platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/doctors" className="btn-outline">
              View Doctors
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>System Modules</h3>
          <ul>
            <li>Patient Appointment Booking</li>
            <li>Doctor Prescription Management</li>
            <li>Receptionist Appointment Handling</li>
            <li>Admin Control Dashboard</li>
          </ul>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <h2>Core Features</h2>
          <p>Everything needed for a complete hospital management project.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <FaCalendarCheck />
            <h3>Appointment System</h3>
            <p>Patients can book appointments and track appointment status.</p>
          </div>

          <div className="feature-card">
            <FaUserDoctor />
            <h3>Doctor Dashboard</h3>
            <p>Doctors can view appointments and write prescriptions.</p>
          </div>

          <div className="feature-card">
            <FaFilePrescription />
            <h3>Prescription Records</h3>
            <p>Prescriptions are stored digitally for future patient access.</p>
          </div>

          <div className="feature-card">
            <MdAdminPanelSettings />
            <h3>Admin Management</h3>
            <p>Admin can manage users, doctors, departments, and payments.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;