"use client"

import Breadcrumb from "@/components/ui/breadcrum"
import CompanyForm from "@/components/pages/companies/company-form"
import { useGetCompanyByIdQuery } from "@/hooks/use-company"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

const EditCompanyPage = () => {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const { data: company, isLoading, error } = useGetCompanyByIdQuery(companyId)

  const editCompanyBreadcrumb = [{ label: "Companies", href: "/dashboard/companies" }, { label: "Edit Company" }]

  useEffect(() => {
    if (error) {
      console.error("Error loading company:", error)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const errorMessage =
      "data" in error && error.data ? (error.data as any)?.message || "Company not found" : "An error occurred"

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
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Company</h3>
            <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push("/dashboard/companies")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Company Not Found</h3>
          <p className="text-gray-600 mb-4">The company you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/dashboard/companies")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Companies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#5392a3] border-b border-gray-200 absolute top-0 left-0 w-full">
        <div className="px-6 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full space-x-4 justify-between">
              <h1 className="text-base font-semibold text-white mb-2">EDIT COMPANY</h1>
              <Breadcrumb
                items={editCompanyBreadcrumb}
                linkClassName="text-gray-200 hover:text-gray-300"
                labelClassName="text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto">
          <CompanyForm
            mode="edit"
            initialData={company}
            onSuccess={() => router.push("/dashboard/companies")}
            onCancel={() => router.push("/dashboard/companies")}
          />
        </div>
      </div>
    </div>
  )
}

export default EditCompanyPage