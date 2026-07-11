import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p className="mt-16 text-center text-lg font-black text-teal-700">
        Loading...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;