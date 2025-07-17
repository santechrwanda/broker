import DashboardHeader from "@/components/layouts/headers/dashboard-header";
import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f6f9fc]">
      <DashboardSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 