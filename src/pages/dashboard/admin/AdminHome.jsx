const AdminHome = () => {
  return (
    <section className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p>Monitor and manage the full hospital management system.</p>

      <div className="dashboard-card-grid">
        <div className="dashboard-stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Total Doctors</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Appointments</h3>
          <p>0</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Payments</h3>
          <p>0</p>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;