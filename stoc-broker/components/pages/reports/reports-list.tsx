"use client";
import React from "react";
import { FiEye, FiDownload } from "react-icons/fi";

const previousReports = [
  {
    id: 1,
    name: "Market Overview Q2",
    type: "Market",
    createdAt: "2025-07-20",
    format: "PDF",
  },
  {
    id: 2,
    name: "Transaction History (June)",
    type: "Transactions",
    createdAt: "2025-07-19",
    format: "CSV",
  },
];

const ReportList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <table className="w-full border rounded-md border-gray-300">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Type
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Created
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Format
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {previousReports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="p-4 font-medium text-sm text-gray-900">
                {report.name}
              </td>
              <td className="p-4 text-gray-600 text-sm">{report.type}</td>
              <td className="p-4 text-gray-600 text-sm">{report.createdAt}</td>
              <td className="p-4 text-gray-600 text-sm">{report.format}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="View"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Download"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportList;
