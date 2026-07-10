import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="dashboard-loading">Loading dashboard...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user.role === "doctor") {
    return <Navigate to="/dashboard/doctor" replace />;
  }

  if (user.role === "receptionist") {
    return <Navigate to="/dashboard/receptionist" replace />;
  }

  return <Navigate to="/dashboard/patient" replace />;
};

export default DashboardHome;