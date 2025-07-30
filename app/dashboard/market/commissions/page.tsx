import CommisionTable from "@/components/pages/market/commission-table"
import ExportCommissions from "@/components/pages/market/export-commissions"
import type React from "react"

const CommissionsPage: React.FC = () => {
  return (
    <div>
      <CommisionTable />
      <ExportCommissions />
    </div>
  )
}

export default CommissionsPage
