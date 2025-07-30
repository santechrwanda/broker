"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HiOutlineX } from "react-icons/hi"
import { toast } from "react-toastify"
import { useCreateCommissionMutation, type CreateCommissionRequest } from "@/hooks/use-commissions"
import { useGetAllUsersQuery, type User } from "@/hooks/use-users"
import { useGetAllCompaniesQuery, type Company } from "@/hooks/use-company"
import LoadingSpinner from "@/components/common/loading-spinner"
import { UserShape } from "../users/users-list"

interface AddCommissionModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddCommissionModal = ({ isOpen, onClose }: AddCommissionModalProps) => {
  const [createCommission, { isLoading: isCreating }] = useCreateCommissionMutation()
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery()
  const { data: companies, isLoading: companiesLoading } = useGetAllCompaniesQuery()

  const [formData, setFormData] = useState<CreateCommissionRequest>({
    brokerId: "",
    customerId: "",
    companyId: "",
    numberOfShares: 0,
    pricePerShare: 0,
    commissionRate: 0.05, // Default to 5%
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        brokerId: "",
        customerId: "",
        companyId: "",
        numberOfShares: 0,
        pricePerShare: 0,
        commissionRate: 0.05,
        notes: "",
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.brokerId) newErrors.brokerId = "Broker is required."
    if (!formData.customerId) newErrors.customerId = "Customer is required."
    if (!formData.companyId) newErrors.companyId = "Company is required."
    if (formData.numberOfShares <= 0) newErrors.numberOfShares = "Number of shares must be greater than 0."
    if (formData.pricePerShare <= 0) newErrors.pricePerShare = "Price per share must be greater than 0."
    if (formData.commissionRate < 0 || formData.commissionRate > 1)
      newErrors.commissionRate = "Commission rate must be between 0 and 1."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "numberOfShares" || name === "pricePerShare" || name === "commissionRate" ? Number(value) : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.")
      return
    }

    try {
      await createCommission(formData).unwrap()
      toast.success("Commission added successfully!")
      onClose()
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to add commission."
      toast.error(`Error: ${errorMessage}`)
    }
  }

  if (!isOpen) return null

  const filteredBrokers = users?.filter((user) => user.role === "teller" || user.role === "admin") || []
  const filteredCustomers = users?.filter((user) => user.role === "client" || []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity z-40" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl z-50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl leading-6 font-semibold text-gray-900">Add New Commission</h3>
              <button
                onClick={onClose}
                disabled={isCreating}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            {(usersLoading || companiesLoading) && (
              <div className="flex justify-center items-center h-48">
                <LoadingSpinner />
              </div>
            )}

            {!usersLoading && !companiesLoading && (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="brokerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Broker
                  </label>
                  <select
                    id="brokerId"
                    name="brokerId"
                    value={formData.brokerId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.brokerId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                  >
                    <option value="">Select a broker</option>
                    {filteredBrokers.map((user: UserShape) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.brokerId && <p className="mt-1 text-sm text-red-600">{errors.brokerId}</p>}
                </div>

                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.customerId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                  >
                    <option value="">Select a customer</option>
                    {filteredCustomers?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
                </div>

                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.companyId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                  >
                    <option value="">Select a company</option>
                    {companies?.map((company: Company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>}
                </div>

                <div>
                  <label htmlFor="numberOfShares" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    id="numberOfShares"
                    name="numberOfShares"
                    value={formData.numberOfShares}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.numberOfShares ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                    min="1"
                  />
                  {errors.numberOfShares && <p className="mt-1 text-sm text-red-600">{errors.numberOfShares}</p>}
                </div>

                <div>
                  <label htmlFor="pricePerShare" className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Share ($)
                  </label>
                  <input
                    type="number"
                    id="pricePerShare"
                    name="pricePerShare"
                    value={formData.pricePerShare}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.pricePerShare ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                    step="0.01"
                    min="0.01"
                  />
                  {errors.pricePerShare && <p className="mt-1 text-sm text-red-600">{errors.pricePerShare}</p>}
                </div>

                <div>
                  <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (0-1)
                  </label>
                  <input
                    type="number"
                    id="commissionRate"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.commissionRate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isCreating}
                    step="0.01"
                    min="0"
                    max="1"
                  />
                  {errors.commissionRate && <p className="mt-1 text-sm text-red-600">{errors.commissionRate}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isCreating}
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isCreating}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      "Add Commission"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCommissionModal
