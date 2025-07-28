"use client"
import Breadcrumb from "@/components/ui/breadcrum"
import { SelectDropdown } from "@/components/ui/select"
import { useCreateCompanyMutation, type CompanyFormData } from "@/hooks/use-company"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, type ChangeEvent, useEffect } from "react"

const AddNewCompanyPage = () => {
  const router = useRouter()
  const [createCompany, { isLoading: isCreating, error: createError }] = useCreateCompanyMutation()

  const createProjectBreadcrumb = [
    { label: "Companies", href: "/dashboard/companies" },
    { label: "Register a Company" },
  ]

  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    companyAddress: "",
    companyTelephone: "",
    companyLogo: undefined,
    ownerFullName: "",
    ownerEmail: "",
    ownerAddress: "",
    ownerPhone: "",
    numberOfShares: 0,
    companyCategory: "",
    description: "",
    email: "",
  })

  const [thumbnailName, setThumbnailName] = useState<string>("No file chosen")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfShares" ? Number.parseInt(value) || 0 : value,
    }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined
    setFormData((prev) => ({
      ...prev,
      companyLogo: file,
    }))
    setThumbnailName(file ? file.name : "No file chosen")
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyCategory: value,
    }))

    // Clear validation error
    if (validationErrors.companyCategory) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.companyCategory
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Required fields validation
    const requiredFields = [
      { key: "companyName", label: "Company Name" },
      { key: "companyAddress", label: "Company Address" },
      { key: "companyTelephone", label: "Company Telephone" },
      { key: "ownerFullName", label: "Owner Full Name" },
      { key: "ownerEmail", label: "Owner Email" },
      { key: "ownerPhone", label: "Owner Phone" },
      { key: "ownerAddress", label: "Owner Address" },
      { key: "companyCategory", label: "Company Category" },
      { key: "description", label: "Company Description" },
    ]

    for (const field of requiredFields) {
      const value = formData[field.key as keyof CompanyFormData]
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field.key] = `${field.label} is required`
      }
    }

    // Number of shares validation
    if (formData.numberOfShares <= 0) {
      errors.numberOfShares = "Number of shares must be greater than 0"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.ownerEmail && !emailRegex.test(formData.ownerEmail)) {
      errors.ownerEmail = "Please enter a valid owner email address"
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[1-9][\d\s\-()]{7,15}$/
    if (formData.ownerPhone && !phoneRegex.test(formData.ownerPhone.replace(/[\s\-()]/g, ""))) {
      errors.ownerPhone = "Please enter a valid phone number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const result = await createCompany(formData).unwrap()

      if (result.success) {
        setSuccessMessage("Company registered successfully!")

        // Reset form
        setFormData({
          companyName: "",
          companyAddress: "",
          companyTelephone: "",
          companyLogo: undefined,
          ownerFullName: "",
          ownerEmail: "",
          ownerAddress: "",
          ownerPhone: "",
          numberOfShares: 0,
          companyCategory: "",
          description: "",
          email: "",
        })
        setThumbnailName("No file chosen")
        setValidationErrors({})

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/companies")
        }, 2000)
      }
    } catch (err) {
      console.error("Error creating company:", err)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/companies")
  }

  const categoryOptions = [
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Services" },
    { value: "energy", label: "Energy" },
    { value: "real_estate", label: "Real Estate" },
    { value: "agriculture", label: "Agriculture" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ]

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Get error message from RTK Query error
  const getErrorMessage = () => {
    if (!createError) return null

    if ("data" in createError && createError.data) {
      return (createError.data as any)?.message || "An error occurred"
    }

    if ("message" in createError) {
      return createError.message
    }

    return createError.toString()
  }

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
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {createError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{getErrorMessage()}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Info Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Company Name *</h3>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.companyName ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.companyName}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Company Address *</h3>
                    <input
                      type="text"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      placeholder="48 KN 1 Rd"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.companyAddress ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.companyAddress && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.companyAddress}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Company Telephone *</h3>
                    <input
                      type="text"
                      name="companyTelephone"
                      value={formData.companyTelephone}
                      onChange={handleInputChange}
                      placeholder="(+250) 783 250 033"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.companyTelephone ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.companyTelephone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.companyTelephone}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Company Logo</h3>
                    <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                      <label className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-md border border-gray-300 cursor-pointer transition-colors">
                        <span className="text-sm text-gray-700">Choose File</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                      </label>
                      <span className="ml-3 text-sm text-gray-500">{thumbnailName}</span>
                    </div>
                  </div>
                </div>

                {/* Shares Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                    Company Shares info.
                  </h3>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Number of Shares *</h3>
                    <input
                      type="number"
                      name="numberOfShares"
                      value={formData.numberOfShares || ""}
                      onChange={handleInputChange}
                      placeholder="320"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.numberOfShares ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.numberOfShares && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.numberOfShares}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Company Category *</h4>
                    <div className="relative">
                      <SelectDropdown
                        options={categoryOptions}
                        value={formData.companyCategory}
                        onChange={handleCategoryChange}
                        placeholder="Select category"
                        className={`w-full ${validationErrors.companyCategory ? "border-red-300" : ""}`}
                      />
                      {validationErrors.companyCategory && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.companyCategory}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side*/}
              <div className="space-y-6">
                {/* Company Owners Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                    Company Owners info.
                  </h3>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Full Name *</h3>
                    <input
                      type="text"
                      name="ownerFullName"
                      value={formData.ownerFullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.ownerFullName ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.ownerFullName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.ownerFullName}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Owner Email *</h3>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.ownerEmail ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.ownerEmail && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.ownerEmail}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Owner Address *</h3>
                    <input
                      type="text"
                      name="ownerAddress"
                      value={formData.ownerAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main St, City, Country"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.ownerAddress ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.ownerAddress && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.ownerAddress}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Owner Phone *</h3>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      placeholder="+250 783 250 033"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                        validationErrors.ownerPhone ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.ownerPhone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.ownerPhone}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                    Company Description.
                  </h3>
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-600 mb-2">
                      Please enter short description of the company *
                    </h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      maxLength={350}
                      onChange={handleInputChange}
                      placeholder="Type here..."
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none ${
                        validationErrors.description ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-gray-500">{formData.description.length}/350 characters</div>
                      {validationErrors.description && (
                        <p className="text-xs text-red-600">{validationErrors.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCreating}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-[#1f7e98] text-white rounded-md hover:bg-[#004f64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  "Register Company"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddNewCompanyPage
