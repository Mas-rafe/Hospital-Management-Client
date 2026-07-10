import useAuth from "../../../hooks/useAuth";

const DoctorHome = () => {
  const { user } = useAuth();

  return (
    <section className="dashboard-page">
      <h1>Welcome, Dr. {user?.name}</h1>
      <p>This is your doctor dashboard.</p>

      <div className="dashboard-card-grid">
        <div className="dashboard-stat-card">
          <h3>Today’s Appointments</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Pending Patients</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Completed Treatments</h3>
          <p>0</p>
        </div>
      </div>
    </section>
  );
};

export default DoctorHome;