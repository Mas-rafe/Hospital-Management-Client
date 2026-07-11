import AppointmentManager from "../shared/AppointmentManager";

const AppointmentRequests = () => {
  return (
    <AppointmentManager
      title="Appointment Requests"
      subtitle="Confirm pending patient appointment requests, reject invalid requests, and update payment status after payment collection."
    />
  );
};

export default AppointmentRequests;