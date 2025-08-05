import type { Company } from "@/hooks/use-company"
import Image from "next/image"
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineIdentification,
} from "react-icons/hi"

interface CompanyDetailsProps {
  selectedCompany: Company | null
}

const CompanyDetails = ({ selectedCompany }: CompanyDetailsProps) => {
  if (!selectedCompany) {
    return (
      <div className="w-1/4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <HiOutlineOfficeBuilding className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
          <p className="text-sm">Select a company from the table to view details</p>
        </div>
      </div>
    )
  }

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  return (
    <div className="w-1/4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {selectedCompany.companyLogo ? (
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src={selectedCompany.companyLogo || "/placeholder.svg"}
                alt={selectedCompany.companyName}
                width={64}
                height={64}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}
            <div
              className={`h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium text-gray-700 ${
                selectedCompany.companyLogo ? "hidden" : ""
              }`}
            >
              {getCompanyInitials(selectedCompany.companyName)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={selectedCompany.companyName}>
              {selectedCompany.companyName}
            </h3>
            <div className="mt-1">{getStatusBadge(selectedCompany.status)}</div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Company Information</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <HiOutlineLocationMarker className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 break-words">{selectedCompany.companyAddress}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlinePhone className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">{selectedCompany.companyTelephone}</p>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">{formatCategory(selectedCompany.companyCategory)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlineIdentification className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">{formatNumber(selectedCompany.numberOfShares)} shares</p>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Owner Information</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <HiOutlineUser className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">{selectedCompany.ownerFullName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlineMail className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <a
                href={`mailto:${selectedCompany.ownerEmail}`}
                className="text-sm text-blue-600 hover:text-blue-800 truncate"
              >
                {selectedCompany.ownerEmail}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlinePhone className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">{selectedCompany.ownerPhone}</p>
            </div>
            <div className="flex items-start space-x-3">
              <HiOutlineLocationMarker className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 break-words">{selectedCompany.ownerAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Registration Details</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <HiOutlineCalendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-600">{formatDate(selectedCompany.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <HiOutlineCalendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-600">{formatDate(selectedCompany.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <HiOutlineIdentification className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Company ID</p>
                <p className="text-sm text-gray-600 break-all">{selectedCompany.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <HiOutlinePhone className="h-4 w-4 mr-1" />
            Call
          </button>
          <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <HiOutlineMail className="h-4 w-4 mr-1" />
            Email
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <button className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            View Documents
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetails
