"use client"
import SecuritySummary from "@/components/pages/market/security-summar"
import { MarketTable } from "@/components/pages/market/market-table"
import { CURRENTCY } from "@/utility/constants"
import { FiTrendingUp } from "react-icons/fi"
import { IoCartOutline, IoWalletOutline } from "react-icons/io5"

const statisticsData = [
    {
      label: "Total Buy",
      value: `${CURRENTCY} 200k`,
      icon: <IoCartOutline className="text-red-500" />,
      bg: "bg-blue-100",
    },
    {
      label: "Total sell",
      value: `${CURRENTCY} 100k`,
      icon: <FiTrendingUp className="text-blue-500" />,
      bg: "bg-red-100",
    },
    {
      label: "My Wallet",
      value: `${CURRENTCY} 1500`,
      icon: <IoWalletOutline className="text-yellow-500" />,
      bg: "bg-yellow-100",
    },
  ]


const ClientMarketPage = () => {
  return (
    <div >
      {/* Market Statistics */}
      <div className="mb-8">
        <SecuritySummary stats={ statisticsData }/>
      </div>

      {/* Market Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <MarketTable />
      </div>
    </div>
  )
}

export default ClientMarketPage