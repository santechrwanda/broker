import QuickCreateDropdown from "@/components/dropdowns/quick-create-dropdown";
import CustomerChart from "@/components/pages/dashboard/customer-chart";
import Link from "next/link";
import React from "react";
import { GoOrganization } from "react-icons/go";
import { IoWalletOutline } from "react-icons/io5";
import { PiCurrencyDollarSimple } from "react-icons/pi";
import { TbUsersGroup } from "react-icons/tb";

const DashboardHome = () => {
  return (
    <div className="p-6 bg-[#f8f9ff] min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004f64]">
            Good Morning, Emma!
          </h1>
          <p className="text-sm text-gray-500">
            Here’s what’s happening with your portfolio today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuickCreateDropdown />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Total Earnings */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">
                TOTAL EARNINGS
              </h4>
              <p className="text-xl font-bold text-[#004f64] flex items-end gap-1">
                <span>$559.25k</span>|
                <span className="text-xs">This Month</span>
              </p>
              <p className="text-green-600 text-sm mt-1">↑ +16.24%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e3f9f5] p-3 rounded">
              <PiCurrencyDollarSimple />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">
            View commissions
          </a>
        </div>

        {/* Trades */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">PARTNERS</h4>
              <p className="text-xl font-bold text-[#004f64]">36,894</p>
              <p className="text-red-500 text-sm mt-1">↓ -3.57%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e6f2fb] p-3 rounded">
              <GoOrganization />
            </div>
          </div>
          <Link
            href="/dashboard/companies"
            className="text-blue-600 text-sm mt-4 inline-block"
          >
            View all partners
          </Link>
        </div>

        {/* Clients */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">CLIENTS</h4>
              <p className="text-xl font-bold text-[#004f64]">183.35M</p>
              <p className="text-green-600 text-sm mt-1">↑ +29.08%</p>
            </div>
            <div className="text-3xl text-[#004f64]/80 bg-[#f9f0e9] p-3 rounded">
              <TbUsersGroup />
            </div>
          </div>
          <Link
            href="/dashboard/users?tab=clients"
            className="text-blue-600 text-sm mt-4 inline-block"
          >
            View All
          </Link>
        </div>

        {/* Balance */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">
                MY SHARES
              </h4>
              <p className="text-xl font-bold text-[#004f64]">200</p>
              <p className="text-gray-400 text-sm mt-1">+30</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e8e9f9] p-3 rounded">
              <IoWalletOutline />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">
            Trade shares
          </a>
        </div>
      </div>

      <CustomerChart />
    </div>
  );
};

export default DashboardHome;
