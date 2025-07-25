import Link from "next/link";
import React from "react";
import { CiFilter } from "react-icons/ci";
import { FiMoreHorizontal } from "react-icons/fi";

const AddCompaniesHeader = () => {
  return (
    <div className="flex items-center justify-between rounded p-6 border border-gray-200 bg-white">
      <Link href="/dashboard/companies/add-new" className="bg-[#127894] cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#004f64]">
        <span className="text-lg">+</span>
        Add Company
      </Link>

      <div className="flex items-center gap-3">
        <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-red-600">
          <CiFilter className="w-5 h-5" />
          Filters
        </button>
        <button className="bg-teal-500 cursor-pointer text-white px-4 py-2 rounded-sm hover:bg-teal-600">
          Import
        </button>
        <button className="p-2 cursor-pointer text-gray-500 hover:text-gray-700">
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AddCompaniesHeader;
