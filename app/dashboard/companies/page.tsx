"use client"

import GeneralPagination from "@/components/common/pagination"
import AddCompaniesHeader from "@/components/pages/companies/add-companies"
import CompaniesTable from "@/components/pages/companies/companies-table"
import CompanyDetails from "@/components/pages/companies/company-details"
import { SelectDropdown } from "@/components/ui/select"
import { useGetAllCompaniesQuery, type Company } from "@/hooks/use-company"
import { useState, useEffect } from "react"
import { FiSearch, FiChevronDown } from "react-icons/fi"

const CompanyTable = () => {
  const { data: companies = [], isLoading, error, refetch } = useGetAllCompaniesQuery()

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedValue, setSelectedValue] = useState("")
  const [paginatedCompanies, setPaginatedCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])

  // Update filtered companies when companies or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies)
    } else {
      const filtered = companies.filter(
        (company) =>
          company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.ownerFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.companyCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.companyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.status?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCompanies(filtered)
    }
  }, [companies, searchTerm])

  // Set initial selected company
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0])
    }
  }, [companies, selectedCompany])

  // Sort companies based on selected value
  useEffect(() => {
    if (selectedValue && filteredCompanies.length > 0) {
      const sorted = [...filteredCompanies].sort((a, b) => {
        switch (selectedValue) {
          case "Location":
            return (a.companyAddress || "").localeCompare(b.companyAddress || "")
          case "Company":
            return (a.companyName || "").localeCompare(b.companyName || "")
          case "Owner":
            return (a.ownerFullName || "").localeCompare(b.ownerFullName || "")
          case "Category":
            return (a.companyCategory || "").localeCompare(b.companyCategory || "")
          case "Status":
            return (a.status || "").localeCompare(b.status || "")
          case "Shares":
            return (b.numberOfShares || 0) - (a.numberOfShares || 0)
          default:
            return 0
        }
      })
      setFilteredCompanies(sorted)
    }
  }, [selectedValue, filteredCompanies])

  const options = [
    { value: "Location", label: "Location" },
    { value: "Company", label: "Company" },
    { value: "Owner", label: "Owner" },
    { value: "Category", label: "Category" },
    { value: "Status", label: "Status" },
    { value: "Shares", label: "Shares" },
  ]

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company)
  }

  const handleRefresh = () => {
    refetch()
  }

  // Get error message from RTK Query error
  const getErrorMessage = () => {
    if (!error) return null

    if ("data" in error && error.data) {
      return (error.data as any)?.message || "An error occurred"
    }

    if ("message" in error) {
      return error.message
    }

    return error.toString()
  }

  // Loading state
  if (isLoading && companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
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
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Companies</h3>
            <p className="text-sm text-red-600 mb-4">{getErrorMessage()}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <AddCompaniesHeader companies={filteredCompanies} setCompanies={setFilteredCompanies} />

      <div className="min-h-screen bg-gray-50 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-x-6">
            {/* Main Table */}
            <div className="w-3/4 rounded shadow-sm transition-all duration-300 bg-white">
              {/* Search and Sort */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <FiSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <div className="relative">
                      <SelectDropdown
                        label=""
                        options={options}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        placeholder="Sort by"
                        className="w-40"
                      />
                      <FiChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State for Table */}
              {isLoading && (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Updating companies...</p>
                </div>
              )}

              {/* No Companies State */}
              {!isLoading && filteredCompanies.length === 0 && (
                <div className="p-12 text-center">
                  <svg
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "No companies match your search criteria." : "No companies have been registered yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Table */}
              {filteredCompanies.length > 0 && (
                <CompaniesTable
                  companies={paginatedCompanies}
                  selectedCompany={selectedCompany}
                  setSelectedCompany={handleCompanySelect}
                />
              )}

              {/* Pagination */}
              {filteredCompanies.length > 0 && (
                <GeneralPagination datas={filteredCompanies} setPaginatedData={setPaginatedCompanies} />
              )}
            </div>

            {/* Company Details Sidebar */}
            <CompanyDetails selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyTable
