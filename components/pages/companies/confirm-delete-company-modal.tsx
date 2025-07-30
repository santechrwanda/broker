"use client"

import { useState } from "react"
import { HiOutlineX } from "react-icons/hi"
import { useDeleteCompanyMutation, type Company } from "@/hooks/use-company"
import { toast } from "react-toastify"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"

interface ConfirmDeleteCompanyModalProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

const ConfirmDeleteCompanyModal = ({ company, isOpen, onClose, onConfirm }: ConfirmDeleteCompanyModalProps) => {
  const [deleteCompany, { isLoading }] = useDeleteCompanyMutation()
  const [confirmationText, setConfirmationText] = useState("")
  const [error, setError] = useState("")

  if (!isOpen || !company) return null

  const handleDelete = async () => {
    if (confirmationText !== company.companyName) {
      setError("Company name doesn't match. Please type the exact company name.")
      return
    }

    try {
      await deleteCompany(company.id).unwrap()
      toast.success(`Company "${company.companyName}" has been successfully deleted.`)
      onConfirm?.()
      onClose()
      setConfirmationText("")
      setError("")
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to delete company"
      toast.error(`Failed to delete company: ${errorMessage}`)
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setConfirmationText("")
      setError("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity z-40" onClick={handleClose}></div>

        {/* Modal panel - Increased width for larger screens */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl z-50 mx-auto">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 md:px-8 lg:px-10">
            <div className="sm:flex sm:items-start sm:gap-4">
              {/* Warning Icon */}
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>

              {/* Content Container - Fixed width issues */}
              <div className="mt-3 text-center sm:mt-0 sm:text-left flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 pr-4">Delete Company</h3>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-white rounded-md text-gray-400 absolute -right-8 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 p-1"
                  >
                    <HiOutlineX className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-normal pr-2">
                    This action cannot be undone. This will permanently delete the company{" "}
                    <span className="font-semibold text-gray-900 break-words">"{company.companyName}"</span> and remove
                    all associated data from our servers.
                  </p>

                  {/* Warning Box */}
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HiOutlineExclamationTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-red-800">Warning</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>All company information will be permanently deleted</li>
                            <li>All associated documents and records will be removed</li>
                            <li>This action cannot be reversed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Input */}
                  <div className="space-y-2">
                    <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
                      Please type{" "}
                      <span className="font-semibold text-red-600 break-words">"{company.companyName}"</span> to
                      confirm:
                    </label>
                    <input
                      id="confirmation"
                      type="text"
                      value={confirmationText}
                      onChange={(e) => {
                        setConfirmationText(e.target.value)
                        setError("")
                      }}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 md:px-8 lg:px-10 sm:flex sm:flex-row-reverse sm:gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading || confirmationText !== company.companyName}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  Deleting...
                </>
              ) : (
                "Delete Company"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteCompanyModal