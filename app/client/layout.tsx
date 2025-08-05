"use client"
import DashboardSidebar from "@/components/layouts/dashboard-sidebar"
import type React from "react";
import { FiHome} from "react-icons/fi"
import { MdOutlineSell } from "react-icons/md"
import DashboardHeader from "@/components/layouts/headers/dashboard-header"
import { Provider } from "react-redux"
import { store } from "../../hooks/store"
import { ToastContainer } from "react-toastify";
import { GrTransaction } from "react-icons/gr";
import { IoWalletOutline } from "react-icons/io5";

const topNavLinks = [
  { name: "Dashboard", href: "/client", icon: <FiHome size={20} /> },
  {
    name: "Market",
    href: "/client/market", // Parent link, leads to Market overview
    icon: <MdOutlineSell size={20} />
  },
  {
    name: "My Wallet",
    href: "/client/wallet",
    icon: <IoWalletOutline size={20} />
  },
  {
    name: "Transactions",
    href: "/client/transactions",
    icon: <GrTransaction size={20} />,
  },
]

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export default ClientLayout
