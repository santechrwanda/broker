"use client";
import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import React from "react";
import { TbReportAnalytics } from "react-icons/tb";
import { RiOrganizationChart } from "react-icons/ri";
import { FiHome, FiMessageSquare, FiUser } from "react-icons/fi";
import { MdOutlineSell } from "react-icons/md";
import DashboardHeader from "@/components/layouts/headers/dashboard-header";
import { Provider } from "react-redux";
import { store } from "../../hooks/store";
import { ToastContainer } from "react-toastify";

const topNavLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FiHome size={20} /> },
  {
    name: "Brokerage",
    href: "/dashboard/market",
    icon: <MdOutlineSell size={20} />,
  },
  {
    name: "Chats",
    href: "/dashboard/chats",
    icon: <FiMessageSquare size={20} />,
  },
  { name: "Users", href: "/dashboard/users", icon: <FiUser size={20} /> },
  {
    name: "Companies",
    href: "/dashboard/companies",
    icon: <RiOrganizationChart size={20} />,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: <TbReportAnalytics size={20} />,
  },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <div className="flex min-h-screen bg-[#f6f9fc]">
        <DashboardSidebar topNavLinks={topNavLinks} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 p-6 relative overflow-y-auto">
            {children}
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={100000}
          theme="dark"
        />
      </div>
    </Provider>
  );
};

export default DashboardLayout;
