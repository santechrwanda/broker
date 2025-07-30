"use client"

import { useState } from "react"
import { HiOutlineX } from "react-icons/hi"
import { useDeleteCommissionMutation, type Commission } from "@/hooks/use-commissions"
import { toast } from "react-toastify"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"

interface ConfirmDeleteCommissionModalProps {
  commission: Commission | null
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

const ConfirmDeleteCommissionModal = ({
  commission,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteCommissionModalProps) => {
  const [deleteCommission, { isLoading }] = useDeleteCommissionMutation()
  const [confirmationText, setConfirmationText] = useState("")
  const [error, setError] = useState("")

  if (!isOpen || !commission) return null

  const handleDelete = async () => {
    // Using a unique identifier for confirmation, e.g., commission ID or a combination
    // For simplicity, let's use the commission ID for confirmation
    if (confirmationText !== commission.id) {
      setError("Commission ID doesn't match. Please type the exact commission ID.")
      return
    }

    try {
      await deleteCommission({ id: commission.id }).unwrap()
      toast.success(`Commission "${commission.id}" has been successfully deleted.`)
      onConfirm?.()
      onClose()
      setConfirmationText("")
      setError("")
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to delete commission"
      toast.error(`Failed to delete commission: ${errorMessage}`)
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

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl z-50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-1 flex-col min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Commission</h3>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <HiOutlineX className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed break-words">
                    This action cannot be undone. This will permanently delete the commission with ID{" "}
                    <span className="font-semibold text-gray-900">"{commission.id}"</span> and remove all associated
                    data from our servers.
                  </p>
                  <div className="bg-red-50 border w-full border-red-200 rounded-md p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HiOutlineExclamationTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Warning</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>All commission information will be permanently deleted</li>
                            <li>All associated records will be removed</li>
                            <li>This action cannot be reversed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                      Please type <span className="font-semibold text-red-600">"{commission.id}"</span> to confirm:
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter commission ID"
                    />
                  </div>
                  {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading || confirmationText !== commission.id}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                "Delete Commission"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteCommissionModal