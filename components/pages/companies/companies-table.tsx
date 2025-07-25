import { Company } from "@/app/dashboard/companies/page";
import CompaniesActionsDropdown from "@/components/dropdowns/companies-action-dropdown";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown";
import React from "react";
import { FaRegCircleStop } from "react-icons/fa6";
import { HiDotsHorizontal, HiOutlineEye } from "react-icons/hi";
import { LuPencil } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";

interface CompaniesProps {
  companies: Company[];
  selectedCompany: Company;
  setSelectedCompany: (company: Company) => void;
}
const CompaniesTable = ({
  companies,
  selectedCompany,
  setSelectedCompany,
}: CompaniesProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Company Name
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Owner
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Industry Type
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Location
            </th>
            <th className="text-left p-4 text-sm font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {companies.map((company) => (
            <tr
              key={company.id}
              className={`${
                selectedCompany?.id === company.id ? "bg-blue-100" : ""
              }`}
            >
              <td className="p-4">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{company.logo}</span>
                  <span className="font-medium text-sm text-gray-900">
                    {company.name}
                  </span>
                </div>
              </td>
              <td className="p-4 text-gray-900 text-sm">{company.owner}</td>
              <td className="p-4 text-gray-600 text-sm">{company.industry}</td>
              <td className="p-4 text-gray-600 text-sm">{company.location}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <CompaniesActionsDropdown 
                    setSelectedCompany={setSelectedCompany}
                    company={company}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompaniesTable;
