import useAuth from "../../../hooks/useAuth";

const PatientHome = () => {
  const { user } = useAuth();

  return (
    <section className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      <p>This is your patient dashboard.</p>

      <div className="dashboard-card-grid">
        <div className="dashboard-stat-card">
          <h3>My Appointments</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Prescriptions</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Payment History</h3>
          <p>0</p>
        </div>
      </div>
    </section>
  );
};

export default PatientHome;