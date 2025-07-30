"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { HiOutlineX } from "react-icons/hi"
import { toast } from "react-toastify"
import { useUpdateCommissionMutation, type Commission, type UpdateCommissionRequest } from "@/hooks/use-commissions"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import { useGetAllUsersQuery } from "@/hooks/use-users"

interface EditCommissionModalProps {
  commission: Commission | null
  isOpen: boolean
  onClose: () => void
}

const EditCommissionModal = ({ commission, isOpen, onClose }: EditCommissionModalProps) => {
  const [updateCommission, { isLoading: isUpdating }] = useUpdateCommissionMutation()
  const { data: companies, isLoading: companiesLoading } = useGetAllCompaniesQuery()
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery()

  const [formData, setFormData] = useState<UpdateCommissionRequest>({
    id: "",
    brokerId: "",
    customerId: "",
    companyId: "",
    numberOfShares: 0,
    pricePerShare: 0,
    commissionRate: 0,
    notes: "",
  })

  useEffect(() => {
    if (commission) {
      setFormData({
        id: commission.id,
        brokerId: commission.brokerId,
        customerId: commission.customerId,
        companyId: commission.companyId,
        numberOfShares: commission.numberOfShares,
        pricePerShare: commission.pricePerShare,
        commissionRate: commission.commissionRate,
        notes: commission.notes || "",
      })
    }
  }, [commission])

  if (!isOpen || !commission) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "numberOfShares" || name === "pricePerShare" || name === "commissionRate"
          ? Number.parseFloat(value) || 0
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateCommission({ id: commission.id, data: formData }).unwrap()
      toast.success("Commission updated successfully!")
      onClose()
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to update commission"
      toast.error(`Error: ${errorMessage}`)
      console.error("Failed to update commission:", error)
    }
  }

  const getBrokerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? `${user.name }` : "Unknown Broker"
  }

  const getCustomerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? `${user.name }` : "Unknown Customer"
  }

  const getCompanyName = (id: string) => {
    const company = companies?.find((c) => c.id === id)
    return company ? company.companyName : "Unknown Company"
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity z-40" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl z-50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl leading-6 font-semibold text-gray-900">Edit Commission</h3>
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="brokerId" className="block text-sm font-medium text-gray-700">
                      Broker
                    </label>
                    <select
                      id="brokerId"
                      name="brokerId"
                      value={formData.brokerId}
                      onChange={handleChange}
                      disabled={isUpdating || usersLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Broker</option>
                      {users
                        ?.filter((user) => (user.role === "teller") || (user.role === "agent"))
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name }
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                      Customer
                    </label>
                    <select
                      id="customerId"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      disabled={isUpdating || usersLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Customer</option>
                      {users
                        ?.filter((user) => user.role === "client")
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name }
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    disabled={isUpdating || companiesLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Company</option>
                    {companies?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="numberOfShares" className="block text-sm font-medium text-gray-700">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      id="numberOfShares"
                      name="numberOfShares"
                      value={formData.numberOfShares}
                      onChange={handleChange}
                      disabled={isUpdating}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="pricePerShare" className="block text-sm font-medium text-gray-700">
                      Price Per Share
                    </label>
                    <input
                      type="number"
                      id="pricePerShare"
                      name="pricePerShare"
                      value={formData.pricePerShare}
                      onChange={handleChange}
                      disabled={isUpdating}
                      step="0.01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      id="commissionRate"
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleChange}
                      disabled={isUpdating}
                      step="0.01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isUpdating}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#20acd3] text-base font-medium text-white hover:bg-[#1b7b95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20acd3] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
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
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUpdating}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCommissionModal