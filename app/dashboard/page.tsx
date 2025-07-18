import React from "react";
import { FaDollarSign, FaShoppingCart, FaUsers, FaWallet } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";

const DashboardHome = () => {
  return (
    <div className="p-6 bg-[#f8f9ff] min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004f64]">Good Morning, Emma!</h1>
          <p className="text-sm text-gray-500">Here’s what’s happening with your portfolio today.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow text-sm text-gray-600">
            <FiCalendar />
            <span>01 Jan, 2025 to 31 Jan, 2025</span>
          </div>
          <button className="bg-[#c9f6ee] text-[#004f64] font-medium px-4 py-2 rounded shadow hover:bg-[#b2eee2] transition text-sm">
            + Add Stock
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Total Earnings */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">TOTAL EARNINGS</h4>
              <p className="text-xl font-bold text-[#004f64]">$559.25k</p>
              <p className="text-green-600 text-sm mt-1">↑ +16.24%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e3f9f5] p-3 rounded">
              <FaDollarSign />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">View net earnings</a>
        </div>

        {/* Trades */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">TRADES</h4>
              <p className="text-xl font-bold text-[#004f64]">36,894</p>
              <p className="text-red-500 text-sm mt-1">↓ -3.57%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e6f2fb] p-3 rounded">
              <FaShoppingCart />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">View all trades</a>
        </div>

        {/* Clients */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">CLIENTS</h4>
              <p className="text-xl font-bold text-[#004f64]">183.35M</p>
              <p className="text-green-600 text-sm mt-1">↑ +29.08%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#f9f0e9] p-3 rounded">
              <FaUsers />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">See details</a>
        </div>

        {/* Balance */}
        <div className="bg-white p-5 rounded border border-gray-500/20 shadow hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500 font-semibold">MY BALANCE</h4>
              <p className="text-xl font-bold text-[#004f64]">$165.89k</p>
              <p className="text-gray-400 text-sm mt-1">+0.00%</p>
            </div>
            <div className="text-3xl text-[#004f64] bg-[#e8e9f9] p-3 rounded">
              <FaWallet />
            </div>
          </div>
          <a href="#" className="text-blue-600 text-sm mt-4 inline-block">Withdraw money</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
