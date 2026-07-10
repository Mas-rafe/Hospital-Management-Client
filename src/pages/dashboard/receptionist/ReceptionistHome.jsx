import useAuth from "../../../hooks/useAuth";

const ReceptionistHome = () => {
  const { user } = useAuth();

  return (
    <section className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      <p>This is your receptionist dashboard.</p>

      <div className="dashboard-card-grid">
        <div className="dashboard-stat-card">
          <h3>Appointment Requests</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Today’s Appointments</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Pending Payments</h3>
          <p>0</p>
        </div>
      </div>
    </section>
  );
};

export default ReceptionistHome;