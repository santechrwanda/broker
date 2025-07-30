"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { HiOutlineX } from "react-icons/hi"
import { toast } from "react-toastify"
import { useUpdateCommissionStatusMutation, type Commission } from "@/hooks/use-commissions"

interface ChangeCommissionStatusModalProps {
  commission: Commission | null
  isOpen: boolean
  onClose: () => void
}

const statusOptions = ["pending", "inprogress", "completed", "cancelled", "rejected"]

const ChangeCommissionStatusModal = ({ commission, isOpen, onClose }: ChangeCommissionStatusModalProps) => {
  const [updateStatus, { isLoading }] = useUpdateCommissionStatusMutation()
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  useEffect(() => {
    if (commission) {
      setSelectedStatus(commission.status)
    }
  }, [commission])

  if (!isOpen || !commission) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStatus) {
      toast.error("Please select a status.")
      return
    }

    try {
      await updateStatus({
        id: commission.id,
        status: selectedStatus as any, // Cast to valid status type
      }).unwrap()
      toast.success(`Commission status updated to "${selectedStatus}"!`)
      onClose()
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to update commission status"
      toast.error(`Error: ${errorMessage}`)
      console.error("Failed to update commission status:", error)
    }
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
              <h3 className="text-2xl leading-6 font-semibold text-gray-900">Change Commission Status</h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Current Status:{" "}
                    <span className="font-semibold">
                      {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                    </span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select New Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    disabled={isLoading || selectedStatus === commission.status}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#20acd3] text-base font-medium text-white hover:bg-[#1b7b95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20acd3] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
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
                      "Update Status"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
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

export default ChangeCommissionStatusModal
