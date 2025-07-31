"use client"
import SecuritySummary from "@/components/pages/market/security-summar"
import { MarketTable } from "@/components/pages/market/market-table"

const ClientMarketPage = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Market Overview</h1>
        <p className="text-gray-600 mt-2">Real-time market data and trading opportunities</p>
      </div>

      {/* Market Statistics */}
      <div className="mb-8">
        <SecuritySummary />
      </div>

      {/* Market Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <MarketTable />
      </div>
    </div>
  )
}

export default ClientMarketPage