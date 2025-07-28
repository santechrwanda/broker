"use client"

import { useDeleteCompanyMutation, type Company } from "@/hooks/use-company"
import { useState } from "react"
import { toast } from "react-toastify"

interface ConfirmDeleteCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  company: Company | null
}

const ConfirmDeleteCompanyModal = ({ isOpen, onClose, company }: ConfirmDeleteCompanyModalProps) => {
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation()
  const [confirmationText, setConfirmationText] = useState("")
  const [error, setError] = useState("")

  if (!isOpen || !company) return null

  const handleDelete = async () => {
    if (confirmationText !== company.companyName) {
      setError("Company name does not match. Please type the exact company name.")
      return
    }

    try {
      const result = await deleteCompany(company.id).unwrap()

      if (result.success) {
        toast.success(`Company "${company.companyName}" has been deleted successfully`)
        onClose()
        setConfirmationText("")
        setError("")
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to delete company"
      toast.error(errorMessage)
      setError(errorMessage)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
      setConfirmationText("")
      setError("")
    }
  }

  const isConfirmationValid = confirmationText === company.companyName

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Company</h3>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Are you absolutely sure?</h4>
          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone. This will permanently delete the company<br />
            <span className="font-semibold text-gray-900">&quot;{company.companyName}&quot;</span> and remove all associated data.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Deleting this company will also remove:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
              <li>All company shares and trading history</li>
              <li>Associated transactions and records</li>
              <li>Owner and registration information</li>
            </ul>
          </div>

          <div className="text-left">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Please type <span className="font-semibold text-red-600">{company.companyName}</span> to confirm:
            </label>
            <input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value)
                setError("")
              }}
              placeholder="Enter company name"
              disabled={isDeleting}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                error ? "border-red-300" : "border-gray-300"
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmationValid}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Company"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteCompanyModal
