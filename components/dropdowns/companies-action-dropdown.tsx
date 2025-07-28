"use client"

import { useState } from "react"
import { CustomDropdown, DropdownItem } from "../ui/dropdown"
import { HiDotsHorizontal, HiOutlineEye } from "react-icons/hi"
import { LuPencil } from "react-icons/lu"
import { FaRegCircleStop, FaRegCircleCheck } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri"
import { useUpdateCompanyStatusMutation, type Company } from "@/hooks/use-company"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import ConfirmDeleteCompanyModal from "../pages/companies/confirm-delete-company-modal"

interface CompanyDropdownProps {
  setSelectedCompany: (company: Company) => void
  company: Company
}

const CompaniesActionsDropdown = ({ setSelectedCompany, company }: CompanyDropdownProps) => {
  const router = useRouter()
  const [updateCompanyStatus, { isLoading: isUpdatingStatus }] = useUpdateCompanyStatusMutation()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleView = () => {
    setSelectedCompany(company)
  }

  const handleEdit = () => {
    router.push(`/dashboard/companies/edit-company/${company.id}`)
  }

  const handleStatusChange = async (newStatus: Company["status"]) => {
    try {
      const result = await updateCompanyStatus({
        id: company.id,
        status: newStatus,
      }).unwrap()

      if (result.success) {
        const statusText =
          newStatus === "approved" ? "approved" : newStatus === "rejected" ? "rejected" : "set to pending"
        toast.success(`Company "${company.companyName}" has been ${statusText}`)
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to update company status"
      toast.error(errorMessage)
      console.error("Error updating company status:", err)
    }
  }

  const handleApprove = () => {
    if (company.status !== "approved") {
      handleStatusChange("approved")
    }
  }

  const handleReject = () => {
    if (company.status !== "rejected") {
      handleStatusChange("rejected")
    }
  }

  const handleDeactivate = () => {
    if (company.status !== "pending") {
      handleStatusChange("pending")
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const getStatusAction = () => {
    switch (company.status) {
      case "pending":
        return (
          <>
            <DropdownItem
              icon={<FaRegCircleCheck className="size-4" />}
              onClick={handleApprove}
              disabled={isUpdatingStatus}
              className="text-green-600"
            >
              {isUpdatingStatus ? "Updating..." : "Approve"}
            </DropdownItem>
            <DropdownItem
              icon={<FaRegCircleStop className="size-4" />}
              onClick={handleReject}
              disabled={isUpdatingStatus}
              className="text-red-600"
            >
              {isUpdatingStatus ? "Updating..." : "Reject"}
            </DropdownItem>
          </>
        )
      case "approved":
        return (
          <>
            <DropdownItem
              icon={<FaRegCircleStop className="size-4" />}
              onClick={handleDeactivate}
              disabled={isUpdatingStatus}
              className="text-yellow-600"
            >
              {isUpdatingStatus ? "Updating..." : "Set to Pending"}
            </DropdownItem>
            <DropdownItem
              icon={<FaRegCircleStop className="size-4" />}
              onClick={handleReject}
              disabled={isUpdatingStatus}
              className="text-red-600"
            >
              {isUpdatingStatus ? "Updating..." : "Reject"}
            </DropdownItem>
          </>
        )
      case "rejected":
        return (
          <>
            <DropdownItem
              icon={<FaRegCircleCheck className="size-4" />}
              onClick={handleApprove}
              disabled={isUpdatingStatus}
              className="text-green-600"
            >
              {isUpdatingStatus ? "Updating..." : "Approve"}
            </DropdownItem>
            <DropdownItem
              icon={<FaRegCircleStop className="size-4" />}
              onClick={handleDeactivate}
              disabled={isUpdatingStatus}
              className="text-yellow-600"
            >
              {isUpdatingStatus ? "Updating..." : "Set to Pending"}
            </DropdownItem>
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <CustomDropdown
        trigger={
          <button className="inline-flex items-center rounded cursor-pointer bg-[#3091ac]/30 px-4 py-2 text-sm text-gray-800">
            <HiDotsHorizontal className="size-4" />
          </button>
        }
        dropdownClassName="min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
        position="bottom-right"
      >
        <DropdownItem icon={<HiOutlineEye className="size-4" />} onClick={handleView}>
          View
        </DropdownItem>
        <DropdownItem icon={<LuPencil className="size-4" />} onClick={handleEdit}>
          Edit
        </DropdownItem>

        <hr className="my-1 border-gray-200" />

        {/* Status Actions */}
        {getStatusAction()}

        <hr className="my-1 border-gray-200" />

        <DropdownItem icon={<RiDeleteBin5Line className="size-4" />} onClick={handleDelete} destructive>
          Delete
        </DropdownItem>
      </CustomDropdown>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteCompanyModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} company={company} />
    </>
  )
}

export default CompaniesActionsDropdown
