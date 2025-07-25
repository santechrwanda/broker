import { Company } from "@/app/dashboard/companies/page";
import React from "react";
import { FiEdit, FiFileText, FiPhone } from "react-icons/fi";

interface CompanyDetailsProps {
    selectedCompany: Company;
}
const CompanyDetails = ({ selectedCompany }: CompanyDetailsProps) => {
  return (
    <div className="w-1/4 border-l border-gray-200 bg-white">
      <div className="p-6">
        {/* Company Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">{selectedCompany.logo}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedCompany.name}
              </h3>
              <p className="text-sm text-gray-500">{selectedCompany.owner}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <button className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200">
            <FiPhone className="w-4 h-4" />
          </button>
          <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
            <FiFileText className="w-4 h-4" />
          </button>
          <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200">
            <FiEdit className="w-4 h-4" />
          </button>
        </div>

        {/* Information Section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 uppercase tracking-wide text-sm">
            Information
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {selectedCompany.description ||
              "A company incurs fixed and variable costs such as the purchase of raw materials, salaries and overhead, as explained by AccountingTools, Inc. Business owners have the discretion to determine the actions."}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              Industry Type
            </span>
            <span className="text-sm text-gray-900">
              {selectedCompany.industry}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Location</span>
            <span className="text-sm text-gray-900">
              {selectedCompany.location}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Employee</span>
            <span className="text-sm text-gray-900">
              {selectedCompany.employee || "10-50"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Rating</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-900">
                {selectedCompany.rating}
              </span>
              <span className="text-yellow-400">⭐</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Website</span>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              {selectedCompany.website || "www.syntycesolution.com"}
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              Contact Email
            </span>
            <span className="text-sm text-gray-900">
              {selectedCompany.email || "info@syntycesolution.com"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Since</span>
            <span className="text-sm text-gray-900">
              {selectedCompany.since || "1995"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
