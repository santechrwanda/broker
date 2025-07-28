"use client";
import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import DashboardHeader from "@/components/layouts/headers/dashboard-header";
import React from "react";
import { FiHome, FiMessageSquare, FiUser } from "react-icons/fi";
import { MdOutlineSell } from "react-icons/md";
import { RiOrganizationChart } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { Provider } from "react-redux";
import { store } from '../../hooks/store';

const topNavLinks = [
    { name: "Dashboard", href: "/manager", icon: <FiHome size={20} /> },
    {
        name: "Market",
        href: "/manager/market",
        icon: <MdOutlineSell size={20} />,
    },
    {
        name: "Chats",
        href: "/manager/chats",
        icon: <FiMessageSquare size={20} />,
    },
    { name: "Users", href: "/dashboard/users", icon: <FiUser size={20} /> },
    {
        name: "Companies",
        href: "/manager/companies",
        icon: <RiOrganizationChart size={20} />,
    },
    {
        name: "Reports",
        href: "/manager/reports",
        icon: <TbReportAnalytics size={20} />,
    },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <Provider store={ store }>
            <div className="flex min-h-screen bg-[#f6f9fc]">
                <DashboardSidebar topNavLinks={ topNavLinks }/>
                <div className="flex-1 ml-64 flex flex-col min-h-screen">
                    <DashboardHeader />
                    <main className="flex-1 p-6 relative overflow-y-auto">{children}</main>
                </div>
            </div>
        </Provider>
    );
};

export default DashboardLayout;
