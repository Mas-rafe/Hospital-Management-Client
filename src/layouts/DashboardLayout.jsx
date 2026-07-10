import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/shared/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;