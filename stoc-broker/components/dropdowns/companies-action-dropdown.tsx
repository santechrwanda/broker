import React from "react";
import { CustomDropdown, DropdownItem } from "../ui/dropdown";
import { HiDotsHorizontal, HiOutlineEye } from "react-icons/hi";
import { LuPencil } from "react-icons/lu";
import { FaRegCircleStop } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Company } from "@/app/dashboard/companies/page";

interface CompanyDropdownProps {
  setSelectedCompany: (company: Company) => void;
  company: Company;
}
const CompaniesActionsDropdown = ({ setSelectedCompany, company }: CompanyDropdownProps) => {
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
      <DropdownItem
        icon={<LuPencil className="size-4" />}
        onClick={() => alert("Edit clicked")}
      >
        Edit
      </DropdownItem>
      <DropdownItem
        icon={<HiOutlineEye className="size-4" />}
        onClick={() => setSelectedCompany(company)}
      >
        View
      </DropdownItem>
      <hr className="my-1 border-gray-200" />
      <DropdownItem
        icon={<FaRegCircleStop className="size-4" />}
        onClick={() => alert("Delete clicked")}
        className="text-[#c39305]"
      >
        Deactivate
      </DropdownItem>
      <DropdownItem
        icon={<RiDeleteBin5Line className="size-4" />}
        onClick={() => alert("Delete clicked")}
        destructive
      >
        Delete
      </DropdownItem>
    </CustomDropdown>
  );
};

export default CompaniesActionsDropdown;
