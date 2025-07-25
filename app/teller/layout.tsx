import DashboardSidebar from "@/components/layouts/dashboard-sidebar";
import React from "react";
import HeaderWrapper from "@/components/layouts/headers/header-wrapper";
import { TbReportAnalytics } from "react-icons/tb";
import { FiHome, FiMessageSquare, FiUser } from "react-icons/fi";
import { MdOutlineSell } from "react-icons/md";

const topNavLinks = [
    { name: "Dashboard", href: "/teller", icon: <FiHome size={20} /> },
    {
        name: "Brokerage",
        href: "/teller/market",
        icon: <MdOutlineSell size={20} />,
    },
    {
        name: "Chats",
        href: "/teller/chats",
        icon: <FiMessageSquare size={20} />,
    },
    { name: "Customers", href: "/teller/users", icon: <FiUser size={20} /> },
    {
        name: "Reports",
        href: "/teller/reports",
        icon: <TbReportAnalytics size={20} />,
    },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="flex min-h-screen bg-[#f6f9fc]">
            <DashboardSidebar topNavLinks={ topNavLinks }/>
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <HeaderWrapper />
                <main className="flex-1 p-6 relative overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
