import React from "react";
import { CustomDropdown } from "../ui/dropdown";
import { IoIosAddCircle } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { FiUser, FiMessageSquare, FiBriefcase, FiFileText } from "react-icons/fi";
import Link from "next/link";

const QuickCreateDropdown = () => {
  return (
    <div className="space-y-4">
      <CustomDropdown
        trigger={
          <button className="bg-[#c9f6ee] cursor-pointer text-[#004f64] font-medium px-4 py-2 flex items-center gap-x-2 rounded shadow hover:bg-[#b2eee2] transition text-sm">
            <IoIosAddCircle /> Quick Create <FaAngleDown className="text-[#004f64]/80" />
          </button>
        }
        dropdownClassName="min-w-72 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-4"
        closeOnClick={false}
        position="bottom-right"
      >
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Quick Create</h4>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/dashboard/users" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-sm">
              <div className="size-6 rounded bg-blue-100 flex items-center justify-center">
                <FiUser className="text-blue-600" />
              </div>
              User
            </Link>
            <Link href="/dashboard/chats" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-sm">
              <div className="size-6 rounded bg-green-100 flex items-center justify-center">
                <FiMessageSquare className="text-green-600" />
              </div>
              Chat
            </Link>
            <Link href="/dashboard/companies" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-sm">
              <div className="size-6 rounded bg-yellow-100 flex items-center justify-center">
                <FiBriefcase className="text-yellow-600" />
              </div>
              Company
            </Link>
            <Link href="/dashboard/reports"  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 text-sm">
              <div className="size-6 rounded bg-purple-100 flex items-center justify-center">
                <FiFileText className="text-purple-600" />
              </div>
              Report
            </Link>
          </div>    
        </div>
      </CustomDropdown>
    </div>
  );
};

export default QuickCreateDropdown;
