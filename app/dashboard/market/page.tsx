"use client"

import Breadcrumb from "@/components/ui/breadcrum"
import { MarketTable } from "@/components/pages/market/market-table"
import SecuritySummary from "@/components/pages/market/security-summar"

const MarketPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Market", href: "/dashboard/market" },
        ]}
      />
      <h2 className="text-2xl font-bold text-gray-800">Market Overview</h2>
      <SecuritySummary /> {/* Statistics cards for market */}
      <MarketTable />
    </div>
  )
}

export default MarketPage
