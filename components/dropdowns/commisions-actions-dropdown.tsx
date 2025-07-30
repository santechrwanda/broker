"use client"
import { CustomDropdown, DropdownItem } from "../ui/dropdown"
import { HiDotsHorizontal } from "react-icons/hi"
import { LuPencil } from "react-icons/lu"
import { RiDeleteBin5Line } from "react-icons/ri"
import { FiEye, FiRefreshCw, FiMessageSquare } from "react-icons/fi"
import type { Commission } from "@/hooks/use-commissions"

interface CommisionsActionsDropdownProps {
  commission: Commission
  onEdit: (commission: Commission) => void
  onDelete: (commission: Commission) => void
  onChangeStatus: (commission: Commission) => void
  onViewDetails: (commission: Commission) => void
}

const CommisionsActionsDropdown = ({
  commission,
  onEdit,
  onDelete,
  onChangeStatus,
  onViewDetails,
}: CommisionsActionsDropdownProps) => {
  return (
    <CustomDropdown
      trigger={
        <button className="inline-flex items-center rounded cursor-pointer bg-[#3091ac]/30 px-4 py-2 text-sm text-gray-800">
          <HiDotsHorizontal className="size-4" />
        </button>
      }
      dropdownClassName="min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
      position="bottom-right"
    >
      <DropdownItem icon={<FiEye className="text-blue-600" />} onClick={() => onViewDetails(commission)}>
        View Details
      </DropdownItem>
      <DropdownItem icon={<LuPencil className="size-4" />} onClick={() => onEdit(commission)}>
        Edit
      </DropdownItem>
      <DropdownItem icon={<FiRefreshCw className="text-yellow-600" />} onClick={() => onChangeStatus(commission)}>
        Change Status
      </DropdownItem>
      <hr className="my-1 border-gray-200" />
      <DropdownItem
        icon={<FiMessageSquare className="text-[#1b7b95]" />}
        onClick={() => alert("Message broker clicked")}
      >
        Message Broker
      </DropdownItem>
      <DropdownItem
        icon={<FiMessageSquare className="text-[#20acd3]" />}
        onClick={() => alert("Message company clicked")}
      >
        Message Company
      </DropdownItem>
      <DropdownItem
        icon={<FiMessageSquare className="text-[#fbbf24]" />}
        onClick={() => alert("Message customer clicked")}
      >
        Message Customer
      </DropdownItem>
      <hr className="my-1 border-gray-200" />
      <DropdownItem icon={<RiDeleteBin5Line className="size-4" />} onClick={() => onDelete(commission)} destructive>
        Delete
      </DropdownItem>
    </CustomDropdown>
  )
}

export default CommisionsActionsDropdown