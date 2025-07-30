"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetCompanyByIdQuery } from "@/hooks/use-company"
import { useState } from "react"
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineFolder,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineSearch,
} from "react-icons/hi"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  category: string
  status: "approved" | "pending" | "rejected"
}

const CompanyDocumentsPage = () => {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const { data: company, isLoading, error } = useGetCompanyByIdQuery(companyId)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Mock documents data - replace with actual API call
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Certificate of Incorporation.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-01-15",
      category: "legal",
      status: "approved",
    },
    {
      id: "2",
      name: "Financial Statement 2023.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadedBy: "Jane Smith",
      uploadedAt: "2024-01-10",
      category: "financial",
      status: "pending",
    },
    {
      id: "3",
      name: "Tax Registration.pdf",
      type: "PDF",
      size: "856 KB",
      uploadedBy: "Admin",
      uploadedAt: "2024-01-08",
      category: "legal",
      status: "approved",
    },
    {
      id: "4",
      name: "Board Resolution.docx",
      type: "Word",
      size: "324 KB",
      uploadedBy: "Secretary",
      uploadedAt: "2024-01-05",
      category: "governance",
      status: "rejected",
    },
    {
      id: "5",
      name: "Audit Report 2023.pdf",
      type: "PDF",
      size: "3.2 MB",
      uploadedBy: "Auditor",
      uploadedAt: "2024-01-03",
      category: "financial",
      status: "approved",
    },
  ])

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "legal", label: "Legal Documents" },
    { value: "financial", label: "Financial Records" },
    { value: "governance", label: "Governance" },
    { value: "compliance", label: "Compliance" },
    { value: "other", label: "Other" },
  ]

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ]

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return (
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center text-xs font-bold">
            PDF
          </div>
        )
      case "excel":
        return (
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs font-bold">
            XLS
          </div>
        )
      case "word":
        return (
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs font-bold">
            DOC
          </div>
        )
      default:
        return <HiOutlineDocumentText className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    const statusConfig = {
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    }

    const config = statusConfig[status]

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company documents...</p>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Company Not Found</h3>
            <p className="text-sm text-red-600 mb-4">The requested company could not be found.</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Documents</h1>
              <p className="text-gray-600">{company.companyName}</p>
            </div>
          </div>

          {/* Company Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{company.companyName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{company.companyName}</h2>
                <p className="text-gray-600">
                  {company.ownerFullName} • {company.companyAddress}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : company.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <HiOutlineUpload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <HiOutlineSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-sm ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  } rounded-l-md transition-colors`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 text-sm ${
                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  } rounded-r-md transition-colors`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <HiOutlineFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                  ? "No documents match your current filters."
                  : "No documents have been uploaded for this company yet."}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Upload First Document
              </button>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(document.type)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{document.name}</div>
                            <div className="text-sm text-gray-500">{document.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{document.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(document.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HiOutlineUser className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{document.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HiOutlineCalendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(document.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <HiOutlineDownload className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(document.type)}
                      {getStatusBadge(document.status)}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <div className="text-xs text-gray-500 mb-3">
                      <div className="flex items-center mb-1">
                        <HiOutlineUser className="w-3 h-3 mr-1" />
                        {document.uploadedBy}
                      </div>
                      <div className="flex items-center mb-1">
                        <HiOutlineCalendar className="w-3 h-3 mr-1" />
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="capitalize">
                        {document.category} • {document.size}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <HiOutlineDownload className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDocumentsPage
