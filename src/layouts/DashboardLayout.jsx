import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/shared/DashboardSidebar";
import DashboardTopbar from "../components/shared/DashboardTopbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <section className="min-w-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;