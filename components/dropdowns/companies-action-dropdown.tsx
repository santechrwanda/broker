"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiDotsHorizontal,
} from "react-icons/hi"
import { useUpdateCompanyStatusMutation, type Company } from "@/hooks/use-company"
import { toast } from "react-toastify"
import ConfirmDeleteCompanyModal from "@/components/pages/companies/confirm-delete-company-modal"
import CompanyDetailsModal from "../pages/companies/company-details-modal"

interface CompaniesActionsDropdownProps {
  company: Company
}

const CompaniesActionsDropdown = ({ company }: CompaniesActionsDropdownProps) => {
  const router = useRouter()
  const [updateCompanyStatus, { isLoading: isUpdatingStatus }] = useUpdateCompanyStatusMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  const handleStatusChange = async (newStatus: Company["status"]) => {
    try {
      await updateCompanyStatus({ id: company.id, status: newStatus }).unwrap()
      toast.success(`Company status updated to ${newStatus}`)
      setIsOpen(false)
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to update status"
      toast.error(`Failed to update status: ${errorMessage}`)
    }
  }

  const handleViewDetails = () => {
    // This will be handled by the parent component's onViewDetails
    setIsOpen(false)
    setIsViewDetailsOpen(true);
  }

  const handleCloseDails = ()=> {
    setIsViewDetailsOpen(false);
  }

  const handleViewDocuments = () => {
    router.push(`/dashboard/companies/documents/${company.id}`)
    setIsOpen(false)
  }

  const handleEdit = () => {
    router.push(`/dashboard/companies/edit-company/${company.id}`)
    setIsOpen(false)
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
    setIsOpen(false)
  }

  const getStatusActions = () => {
    const actions = []

    if (company.status !== "approved") {
      actions.push({
        label: "Approve",
        icon: HiOutlineCheck,
        onClick: () => handleStatusChange("approved"),
        className: "text-green-600 hover:text-green-800",
      })
    }

    if (company.status !== "rejected") {
      actions.push({
        label: "Reject",
        icon: HiOutlineX,
        onClick: () => handleStatusChange("rejected"),
        className: "text-red-600 hover:text-red-800",
      })
    }

    if (company.status !== "pending") {
      actions.push({
        label: "Set to Pending",
        icon: HiOutlineClock,
        onClick: () => handleStatusChange("pending"),
        className: "text-yellow-600 hover:text-yellow-800",
      })
    }

    return actions
  }

  return (
    <>
      <div className="relative">
          <button className="inline-flex items-center rounded cursor-pointer bg-[#3091ac]/30 px-4 py-2 text-sm text-gray-800" onClick={()=> setIsOpen(true)}>
            <HiDotsHorizontal className="size-4" />
          </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/10 z-20">
              <div className="py-1">
                {/* View Details */}
                <button
                  onClick={handleViewDetails}
                  className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineEye className="w-4 h-4 mr-3" />
                  View Details
                </button>

                {/* View Documents */}
                <button
                  onClick={handleViewDocuments}
                  className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineDocumentText className="w-4 h-4 mr-3" />
                  View Documents
                </button>

                {/* Edit */}
                <button
                  onClick={handleEdit}
                  className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlinePencil className="w-4 h-4 mr-3" />
                  Edit Company
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Status Actions */}
                {getStatusActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    disabled={isUpdatingStatus}
                    className={`flex items-center cursor-pointer w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
                  >
                    <action.icon className="w-4 h-4 mr-3" />
                    {isUpdatingStatus ? "Updating..." : action.label}
                  </button>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4 mr-3" />
                  Delete Company
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteCompanyModal
        company={company}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          // Refresh the page or update the list
          window.location.reload()
        }}
      />

      {/* Company Details Modal */}
      <CompanyDetailsModal company={company} isOpen={isViewDetailsOpen} onClose={ handleCloseDails } />
    </>
  )
}

export default CompaniesActionsDropdown