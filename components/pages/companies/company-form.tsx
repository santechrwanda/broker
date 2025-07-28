"use client"

import { SelectDropdown } from "@/components/ui/select"
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  type CompanyFormData,
  type Company,
} from "@/hooks/use-company"
import type React from "react"
import { useState, type ChangeEvent, useEffect } from "react"
import { toast } from "react-toastify"

interface CompanyFormProps {
  mode: "create" | "edit"
  initialData?: Company
  onSuccess?: () => void
  onCancel?: () => void
}

const CompanyForm = ({ mode, initialData, onSuccess, onCancel }: CompanyFormProps) => {
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation()
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation()

  const isLoading = isCreating || isUpdating

  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: initialData?.companyName || "",
    companyAddress: initialData?.companyAddress || "",
    companyTelephone: initialData?.companyTelephone || "",
    companyLogo: undefined,
    ownerFullName: initialData?.ownerFullName || "",
    ownerEmail: initialData?.ownerEmail || "",
    ownerAddress: initialData?.ownerAddress || "",
    ownerPhone: initialData?.ownerPhone || "",
    numberOfShares: initialData?.numberOfShares || 0,
    companyCategory: initialData?.companyCategory || "",
    description: "", // UI only field
    email: initialData?.ownerEmail || "", // Maps to ownerEmail
  })

  const [thumbnailName, setThumbnailName] = useState<string>("No file chosen")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        companyName: initialData.companyName || "",
        companyAddress: initialData.companyAddress || "",
        companyTelephone: initialData.companyTelephone || "",
        companyLogo: undefined,
        ownerFullName: initialData.ownerFullName || "",
        ownerEmail: initialData.ownerEmail || "",
        ownerAddress: initialData.ownerAddress || "",
        ownerPhone: initialData.ownerPhone || "",
        numberOfShares: initialData.numberOfShares || 0,
        companyCategory: initialData.companyCategory || "",
        description: "",
        email: initialData.ownerEmail || "",
      })
    }
  }, [initialData, mode])

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
      toast.error("Please fix the validation errors before submitting")
      return
    }

    try {
      if (mode === "create") {
        const result = await createCompany(formData).unwrap()
        if (result.success) {
          toast.success("Company registered successfully!")
          onSuccess?.()
        }
      } else if (mode === "edit" && initialData) {
        const result = await updateCompany({
          id: initialData.id,
          formData,
        }).unwrap()
        if (result.success) {
          toast.success("Company updated successfully!")
          onSuccess?.()
        }
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || `Failed to ${mode} company`
      toast.error(errorMessage)
      console.error(`Error ${mode}ing company:`, err)
    }
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

  return (
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
              {mode === "edit" && initialData?.companyLogo && (
                <p className="mt-1 text-xs text-gray-500">
                  Current logo: <span className="text-blue-600">{initialData.companyLogo}</span>
                </p>
              )}
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

          {mode === "create" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
              <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                Company Description.
              </h3>
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-600 mb-2">
                  Please enter short description of the company
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  maxLength={350}
                  onChange={handleInputChange}
                  placeholder="Type here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{formData.description.length}/350 characters</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#1f7e98] text-white rounded-md hover:bg-[#004f64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === "create" ? "Registering..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Register Company"
          ) : (
            "Update Company"
          )}
        </button>
      </div>
    </form>
  )
}

export default CompanyForm
