const Departments = () => {
  const departments = [
    "Cardiology",
    "Neurology",
    "Gynecology",
    "Orthopedics",
    "Medicine",
    "Dental Care",
  ];

  return (
    <section className="page-section">
      <h1>Departments</h1>
      <p>Our hospital provides multiple medical departments.</p>

      <div className="card-grid">
        {departments.map((department, index) => (
          <div className="basic-card" key={index}>
            <h3>{department}</h3>
            <p>
              Professional medical support and appointment facilities are
              available in this department.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Departments;