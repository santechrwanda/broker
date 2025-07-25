"use client";
import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";

const data = [
  {
    symbol: "MTNR",
    closing: 180,
    previous: 175,
    change: "+2.86%",
    volume: "200,000",
    value: "$36,000",
  },
  {
    symbol: "BKGR",
    closing: 89,
    previous: 90,
    change: "-1.11%",
    volume: "320,000",
    value: "$28,480",
  },
  {
    symbol: "EQTY",
    closing: 45,
    previous: 44,
    change: "+2.27%",
    volume: "100,000",
    value: "$4,500",
  },
  {
    symbol: "KCB",
    closing: 150,
    previous: 150,
    change: "0.00%",
    volume: "50,000",
    value: "$7,500",
  },
];

export default function SecuritiesTable() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const filtered = data.filter((item) =>
    item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Market Snapshot
        </h2>
        <div className="flex items-center w-1/2 justify-end gap-x-5">
          <div className="relative w-full max-w-sm">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border placeholder:text-sm border-gray-300 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            href={`${pathname}/sell-shares`}
            className="bg-[#127894] cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#004f64]"
          >
            Sell Shares
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto mt-7">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Security
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {item.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  ${item.closing}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  ${item.previous}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap font-semibold ${
                    item.change.startsWith("-")
                      ? "text-red-500"
                      : item.change === "0.00%"
                      ? "text-gray-500"
                      : "text-green-500"
                  }`}
                >
                  {item.change}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {item.volume}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {item.value}
                </td>
                <td className="px-6 flex gap-x-3 py-4 whitespace-nowrap">
                  <Link
                    href={`${pathname}/trade-now`}
                    className="text-sm bg-blue-100 text-[#20acd3] px-3 py-1 rounded-md hover:bg-blue-200"
                  >
                    Buy Now
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No security found matching your criteria
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-end items-center gap-2 text-sm">
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
          Previous
        </button>
        <button className="px-3 py-1 bg-[#20acd3] border border-[#20acd3] text-white rounded">
          1
        </button>
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
          2
        </button>
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
          Next
        </button>
      </div>
    </div>
  );
}
