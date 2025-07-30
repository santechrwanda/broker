"use client"
import { BsFiletypeCsv } from "react-icons/bs"
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { pdf } from "@react-pdf/renderer"
import CommissionPDFDocument from "./export-commissions-pdf"
import { Commission, useGetAllCommissionsQuery } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import { toast } from "react-toastify"
import LoadingSpinner from "@/components/common/loading-spinner"

const ExportCommissions = () => {
  const { data: commissions, isLoading: commissionsLoading, isError: commissionsError } = useGetAllCommissionsQuery()
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery()
  const { data: companies, isLoading: companiesLoading } = useGetAllCompaniesQuery()

  const getBrokerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? user?.name : "N/A"
  }

  const getCustomerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? user?.name : "N/A"
  }

  const getCompanyName = (id: string) => {
    const company = companies?.find((c) => c.id === id)
    return company ? company.companyName : "N/A"
  }

  const getCommissionDataForExport = () => {
    if (!commissions || !users || !companies) return []
    return commissions.map((c) => ({
      id: c.id,
      brokerName: getBrokerName(c.brokerId),
      customerName: getCustomerName(c.customerId),
      companyName: getCompanyName(c.companyId),
      numberOfShares: c.numberOfShares,
      pricePerShare: c.pricePerShare,
      commissionRate: c.commissionRate,
      totalAmount: c.totalAmount,
      commissionAmount: c.commissionAmount,
      status: c.status,
      notes: c.notes || "",
      createdAt: new Date(c.createdAt).toLocaleDateString(),
    }))
  }

  // Excel Export
  const exportToExcel = async () => {
    if (!commissions || !users || !companies) {
      toast.error("Data not loaded yet. Please try again.")
      return
    }
    const data = getCommissionDataForExport()
    if (data.length === 0) {
      toast.info("No commissions to export.")
      return
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Commissions")

    // Add header mimicking PDF
    worksheet.addRow(["STOCK BROKER"])
    worksheet.getCell("A1").font = { bold: true, size: 16 }
    worksheet.getCell("A1").alignment = { horizontal: "center" }
    worksheet.mergeCells("A1:L1") // Merge across all columns

    worksheet.addRow(["Your trusted partner in stock brokerage."])
    worksheet.getCell("A2").font = { size: 10, italic: true }
    worksheet.getCell("A2").alignment = { horizontal: "center" }
    worksheet.mergeCells("A2:L2")

    worksheet.addRow(["Contact: info@stocbroker.com | Phone: +123 456 7890 | Website: www.stocbroker.com"])
    worksheet.getCell("A3").font = { size: 9 }
    worksheet.getCell("A3").alignment = { horizontal: "center" }
    worksheet.mergeCells("A3:L3")

    worksheet.addRow([]) // Empty row for spacing

    // Define columns for the actual data table
    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "BROKER NAME", key: "brokerName", width: 20 },
      { header: "CUSTOMER NAME", key: "customerName", width: 20 },
      { header: "COMPANY", key: "companyName", width: 15 },
      { header: "SHARES", key: "numberOfShares", width: 10 },
      { header: "PRICE/SHARE", key: "pricePerShare", width: 15 },
      { header: "COMMISSION RATE", key: "commissionRate", width: 18 },
      { header: "TOTAL AMOUNT", key: "totalAmount", width: 15 },
      { header: "COMMISSION AMOUNT", key: "commissionAmount", width: 18 },
      { header: "STATUS", key: "status", width: 12 },
      { header: "NOTES", key: "notes", width: 30 },
      { header: "CREATED AT", key: "createdAt", width: 15 },
      
    ]

    // Add the column headers row
    const lastRowNumber = worksheet.lastRow?.number ?? 0
    const headers = worksheet.columns.map((col) => (typeof col.header === 'string' ? col.header : ''))
    worksheet.getRow((worksheet?.lastRow?.number || 0) + 1).values = headers
    worksheet.getRow(lastRowNumber).font = { bold: true } // Make header row bold

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        brokerName: item.brokerName,
        customerName: item.customerName,
        companyName: item.companyName,
        numberOfShares: item.numberOfShares,
        pricePerShare: item.pricePerShare,
        commissionRate: item.commissionRate,
        totalAmount: item.totalAmount,
        commissionAmount: item.commissionAmount,
        status: item.status,
        notes: item.notes,
        createdAt: item.createdAt
      })
    })

    worksheet.getCell("L1").value = "STOCK BROKER";
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(blob, "commissions.xlsx")
    toast.success("Commissions exported to Excel!")
  }

  // CSV Export
  const exportToCSV = () => {
    if (!commissions || !users || !companies) {
      toast.error("Data not loaded yet. Please try again.")
      return
    }
    const data = getCommissionDataForExport()
    if (data.length === 0) {
      toast.info("No commissions to export.")
      return
    }

    const headers = [
      "ID",
      "BROKER NAME",
      "CUSTOMER NAME",
      "COMPANY",
      "SHARES",
      "PRICE/SHARE",
      "COMMISSION RATE",
      "TOTAL AMOUNT",
      "COMMISSION AMOUNT",
      "STATUS",
      "NOTES",
      "CREATED AT",
    ]
    const rows = data.map((c) => [
      c.id,
      c.brokerName,
      c.customerName,
      c.companyName,
      c.numberOfShares,
      c.pricePerShare,
      c.commissionRate,
      c.totalAmount,
      c.commissionAmount,
      c.status,
      c.notes,
      c.createdAt,
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "commissions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Commissions exported to CSV!")
  }

  // PDF Export
  const exportToPDF = async () => {
    if (!commissions || !users || !companies) {
      toast.error("Data not loaded yet. Please try again.")
      return
    }
    const data = getCommissionDataForExport()
    if (data.length === 0) {
      toast.info("No commissions to export.")
      return
    }

    try {
      const blob = await pdf(<CommissionPDFDocument commissions={ data as any } users={users} companies={companies} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "commissions.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Commissions exported to PDF!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF.")
    }
  }

  if (commissionsLoading || usersLoading || companiesLoading) {
    return (
      <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between my-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (commissionsError) {
    return (
      <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between my-8 text-red-500">
        Error loading data for export.
      </div>
    )
  }

  return (
    <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between my-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">EXPORT COMMISSIONS INTO</h1>
      </div>

      <div className="flex gap-3 mt-4 md:mt-0">
        <div className="flex items-center gap-x-4">
          <button
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-red-700 hover:bg-gray-50 w-full md:w-auto justify-center"
            onClick={exportToPDF}
          >
            <FaRegFilePdf />
            PDF
          </button>
          <button
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-blue-700 hover:bg-gray-50 w-full md:w-auto justify-center"
            onClick={exportToCSV}
          >
            <BsFiletypeCsv />
            CSV
          </button>
          <button
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center"
            onClick={exportToExcel}
          >
            <FaRegFileExcel />
            EXCEL
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportCommissions