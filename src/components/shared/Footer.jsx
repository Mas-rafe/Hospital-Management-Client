const Footer = () => {
  return (
    <footer className="footer">
      <h3>MediCare Hospital Management System</h3>
      <p>
        A complete MERN-based hospital management platform for patients,
        doctors, receptionists, and admins.
      </p>
      <p className="copyright">
        © {new Date().getFullYear()} MediCare HMS. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;