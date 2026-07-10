const Doctors = () => {
  const doctors = [
    {
      name: "Dr. Ahmed Rahman",
      department: "Cardiology",
      time: "10:00 AM - 2:00 PM",
    },
    {
      name: "Dr. Nusrat Jahan",
      department: "Gynecology",
      time: "4:00 PM - 8:00 PM",
    },
    {
      name: "Dr. Imran Hossain",
      department: "Neurology",
      time: "11:00 AM - 3:00 PM",
    },
  ];

  return (
    <section className="page-section">
      <h1>Our Doctors</h1>
      <p>Meet our experienced specialist doctors.</p>

      <div className="card-grid">
        {doctors.map((doctor, index) => (
          <div className="basic-card" key={index}>
            <h3>{doctor.name}</h3>
            <p>
              <strong>Department:</strong> {doctor.department}
            </p>
            <p>
              <strong>Available:</strong> {doctor.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Doctors;