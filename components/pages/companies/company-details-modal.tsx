"use client"

import type { Company } from "@/hooks/use-company"
import Image from "next/image"
import Link from "next/link"
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineX,
} from "react-icons/hi"

interface CompanyDetailsModalProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
}

const CompanyDetailsModal = ({ company, isOpen, onClose }: CompanyDetailsModalProps) => {
  if (!isOpen || !company) return null

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity z-40" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-50">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {company.companyLogo ? (
                    <Image
                      className="h-16 w-16 rounded-full object-cover"
                      src={company.companyLogo || "/placeholder.svg"}
                      alt={company.companyName}
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
                      company.companyLogo ? "hidden" : ""
                    }`}
                  >
                    {getCompanyInitials(company.companyName)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 truncate" title={company.companyName}>
                    {company.companyName}
                  </h3>
                  <div className="mt-1">{getStatusBadge(company.status)}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Company Information</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <HiOutlineLocationMarker className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-sm text-gray-900 break-words">{company.companyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiOutlinePhone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-sm text-gray-900">{company.companyTelephone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p className="text-sm text-gray-900">{formatCategory(company.companyCategory)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiOutlineIdentification className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Number of Shares</p>
                      <p className="text-sm text-gray-900 font-semibold">
                        {formatNumber(company.numberOfShares)} shares
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Owner Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <HiOutlineUser className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-sm text-gray-900">{company.ownerFullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiOutlineMail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <a
                        href={`mailto:${company.ownerEmail}`}
                        className="text-sm text-blue-600 hover:text-blue-800 truncate"
                      >
                        {company.ownerEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiOutlinePhone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-sm text-gray-900">{company.ownerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HiOutlineLocationMarker className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-sm text-gray-900 break-words">{company.ownerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Registration Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <HiOutlineCalendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(company.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <HiOutlineCalendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-900">{formatDate(company.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HiOutlineIdentification className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600">Company ID</p>
                    <p className="text-xs text-gray-600 break-all">{company.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <HiOutlinePhone className="h-4 w-4 mr-2" />
                  Call Owner
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <HiOutlineMail className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                <Link href={`/dashboard/companies/documents/${company?.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Documents
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsModal