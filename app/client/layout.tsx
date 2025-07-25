"use client";
import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import React from "react";
import { FiHome, FiMessageSquare } from "react-icons/fi";
import { MdOutlineSell } from "react-icons/md";
import DashboardHeader from "@/components/layouts/headers/dashboard-header";
import { Provider } from "react-redux";
import { store } from "@/hooks/store";

const topNavLinks = [
  { name: "Dashboard", href: "/client", icon: <FiHome size={20} /> },
  {
    name: "Market",
    href: "/client/market",
    icon: <MdOutlineSell size={20} />,
  },
  {
    name: "Chats",
    href: "/client/chats",
    icon: <FiMessageSquare size={20} />,
  },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
        <div className="flex min-h-screen bg-[#f6f9fc]">
        <DashboardSidebar
            topNavLinks={ topNavLinks }
        />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
            <DashboardHeader />
            <main className="flex-1 p-6 relative overflow-y-auto">{children}</main>
        </div>
        </div>
    </Provider>
  );
};

export default DashboardLayout;
