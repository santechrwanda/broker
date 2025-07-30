"use client";

import React from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

const data = [
  { name: "Jan", active_users: 88, commision: 40, refunds: 10 },
  { name: "Feb", active_users: 100, commision: 60, refunds: 14 },
  { name: "Mar", active_users: 68, commision: 40, refunds: 5 },
  { name: "Apr", active_users: 110, commision: 65, refunds: 18 },
  { name: "May", active_users: 75, commision: 50, refunds: 15 },
  { name: "Jun", active_users: 85, commision: 58, refunds: 12 },
  { name: "Jul", active_users: 55, commision: 40, refunds: 5 },
  { name: "Aug", active_users: 30, commision: 43, refunds: 6 },
  { name: "Sep", active_users: 90, commision: 75, refunds: 11 },
  { name: "Oct", active_users: 45, commision: 55, refunds: 22 },
  { name: "Nov", active_users: 87, commision: 68, refunds: 10 },
  { name: "Dec", active_users: 60, commision: 62, refunds: 28 },
];

const CustomerChart: React.FC = () => {
  return (
    <div className="mt-8">
      {/* Revenue Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-[#004f64]">Commision Earning Monthly</h3>
        <div className="flex justify-end items-center gap-x-10 mb-6 text-sm text-gray-600">
          <div className="text-center">
            <p className="font-bold text-lg">7,585</p>
            <p>Active Users</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">$22.89k</p>
            <p>Commision Earning</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data}>
            <CartesianGrid stroke="#f1f1f1" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="active_users" name="Active Users" fill="#2393b1" />
            <Line type="monotone" dataKey="commision" name="Earning" stroke="#22c55e" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerChart;
