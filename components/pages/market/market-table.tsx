"use client"
import { useGetMarketDataQuery } from "@/hooks/use-market"
import { HiOutlineArrowUp, HiOutlineArrowDown } from "react-icons/hi"
import Link from "next/link"
import LoadingSpinner from "@/components/common/loading-spinner"
import { CURRENTCY } from "@/utility/constants"
import { usePathname } from "next/navigation"


export const MarketTable = () => {
  const { data: marketData, isLoading, isError, error } = useGetMarketDataQuery({})
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading market data: {error?.message || "Unknown error"}</p>
      </div>
    )
  }

  if (!marketData || marketData.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>No market data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Market Securities</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Security
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Closing
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Previous
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Change
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Volume
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value({CURRENTCY})
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.security}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(item.closing)?.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(item.previous)?.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div
                    className={`flex items-center ${
                      item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {item.change > 0 && <HiOutlineArrowUp className="h-4 w-4 mr-1" />}
                    {item.change < 0 && <HiOutlineArrowDown className="h-4 w-4 mr-1" />}
                    {Number(item.change)?.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`${pathname}/trade-now/${item.security}`}
                    className="text-blue-600 hover:text-blue-900 "
                  >
                    Buy Now
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}