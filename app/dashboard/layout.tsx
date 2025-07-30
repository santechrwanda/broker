"use client"
import DashboardSidebar from "@/components/layouts/dashboard-sidebar"
import type React from "react"
import { TbReportAnalytics } from "react-icons/tb"
import { RiOrganizationChart } from "react-icons/ri"
import { FiHome, FiMessageSquare, FiUser } from "react-icons/fi"
import { MdOutlineSell } from "react-icons/md"
import DashboardHeader from "@/components/layouts/headers/dashboard-header"
import { Provider } from "react-redux"
import { store } from "../../hooks/store"
import { ToastContainer } from "react-toastify"
import { FaUsers, FaUserTie, FaUserFriends } from "react-icons/fa" // Icons for sub-tabs
import { GiTrade } from "react-icons/gi" // Icon for commissions

const topNavLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FiHome size={20} /> },
  {
    name: "Brokerage",
    href: "/dashboard/market", // Parent link, leads to Market overview
    icon: <MdOutlineSell size={20} />,
    subLinks: [
      { name: "Commissions", href: "/dashboard/market/commissions", icon: <GiTrade size={16} /> },
      { name: "Market", href: "/dashboard/market", icon: <MdOutlineSell size={16} /> },
    ],
  },
  {
    name: "Chats",
    href: "/dashboard/chats",
    icon: <FiMessageSquare size={20} />,
  },
  {
    name: "Users",
    href: "/dashboard/users", // Parent link, leads to Customers overview
    icon: <FiUser size={20} />,
    subLinks: [
      { name: "Employees", href: "/dashboard/users/employees", icon: <FaUserTie size={16} /> },
      { name: "Customers", href: "/dashboard/users", icon: <FaUserFriends size={16} /> },
      { name: "Agents", href: "/dashboard/users/agents", icon: <FaUsers size={16} /> },
    ],
  },
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
]

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <div className="flex min-h-screen bg-[#f6f9fc]">
        <DashboardSidebar topNavLinks={topNavLinks} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 p-6 relative overflow-y-auto">{children}</main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={60000} //1minutes
          theme="dark"
        />
      </div>
    </Provider>
  )
}

export default DashboardLayout