"use client"
import Breadcrumb from "@/components/ui/breadcrum"
import CompanyForm from "@/components/pages/companies/company-form"
import { useRouter } from "next/navigation"

const AddNewCompanyPage = () => {
  const router = useRouter()

  const createProjectBreadcrumb = [
    { label: "Companies", href: "/dashboard/companies" },
    { label: "Register a Company" },
  ]

  return (
    <div>
      <div className="bg-[#5392a3] border-b border-gray-200 absolute top-0 left-0 w-full">
        <div className="px-6 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full space-x-4 justify-between">
              <h1 className="text-base font-semibold text-white mb-2">REGISTER A COMPANY</h1>
              <Breadcrumb
                items={createProjectBreadcrumb}
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
            mode="create"
            onSuccess={() => router.push("/dashboard/companies")}
            onCancel={() => router.push("/dashboard/companies")}
          />
        </div>
      </div>
    </div>
  )
}

export default AddNewCompanyPage
