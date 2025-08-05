"use client"
import { useGetMarketOfTheDayQuery } from "@/hooks/use-market";
import Link from "next/link"
import LoadingSpinner from "@/components/common/loading-spinner"
import { CURRENTCY } from "@/utility/constants"
import { usePathname } from "next/navigation"
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"


export const MarketTable = () => {
  const { data: marketData, isLoading, isError, error } = useGetMarketOfTheDayQuery();
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
        <p>Error loading market data: {(error as any)?.message || "Unknown error"}</p>
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-title mb-4">Market Securities</h3>
        <Link
        href="/dashboard/companies/add-new"
        className="bg-[#127894] cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#004f64] transition-colors"
      >
        Sell Shares
      </Link>
      </div>
      
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
                PRICE PER SHARE
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div
                    className={`flex items-center ${
                      item.change > 0 ? "text-green-600" : item.change < 0 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {item.change > 0 && <FaArrowTrendUp className="h-4 w-4 mr-1" />}
                    {item.change < 0 && <FaArrowTrendDown  className="h-4 w-4 mr-1" />}
                    {Number(item.change)?.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`${pathname}/trade-now/${encodeURIComponent(item.security)}`}
                    className="bg-primary/20 px-3 py-1.5 text-info hover:text-white hover:bg-primary text-xs rounded"
                    // className="text-[#127894] hover:text-[#004f64]"
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