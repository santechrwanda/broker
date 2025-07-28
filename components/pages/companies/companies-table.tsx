"use client"

import type React from "react"
import type { Company } from "@/hooks/use-company"
import CompaniesActionsDropdown from "@/components/dropdowns/companies-action-dropdown"
import Image from "next/image"

interface CompaniesTableProps {
  companies?: Company[]
  selectedCompany: Company | null
  setSelectedCompany: (company: Company) => void
}

const CompaniesTable = ({ companies = [], selectedCompany, setSelectedCompany }: CompaniesTableProps) => {
  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getStatusBadge = (status: Company["status"]) => {
    const statusConfig = {
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleRowClick = (company: Company, event: React.MouseEvent) => {
    // Prevent row selection when clicking on action buttons
    if ((event.target as HTMLElement).closest(".dropdown-trigger")) {
      return
    }
    setSelectedCompany(company)
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No companies found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr
              key={company.id}
              onClick={(e) => handleRowClick(company, e)}
              className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCompany?.id === company.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
              }`}
            >
              {/* Company */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {company.companyLogo ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={company.companyLogo || "/placeholder.svg"}
                        alt={company.companyName}
                        width={40}
                        height={40}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 ${
                        company.companyLogo ? "hidden" : ""
                      }`}
                    >
                      {getCompanyInitials(company.companyName)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{company.companyName}</div>
                    <div className="text-sm text-gray-500">{company.companyTelephone}</div>
                  </div>
                </div>
              </td>

              {/* Owner */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{company.ownerFullName}</div>
                <div className="text-sm text-gray-500">{company.ownerEmail}</div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatCategory(company.companyCategory)}</div>
              </td>

              {/* Shares */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{formatNumber(company.numberOfShares)}</div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(company.status)}</td>

              {/* Location */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 max-w-xs truncate" title={company.companyAddress}>
                  {company.companyAddress}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="dropdown-trigger">
                  <CompaniesActionsDropdown setSelectedCompany={setSelectedCompany} company={company} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompaniesTable
