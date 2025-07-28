"use client";

import GeneralPagination from "@/components/common/pagination";
import AddCompaniesHeader from "@/components/pages/companies/add-companies";
import CompaniesTable from "@/components/pages/companies/companies-table";
import CompanyDetails from "@/components/pages/companies/company-details";
import { SelectDropdown } from "@/components/ui/select";
import { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

// Type for a company
export interface Company {
  id: number;
  name: string;
  owner: string;
  industry: string;
  rating: number;
  location: string;
  logo: string;
  employee?: string;
  website?: string;
  email?: string;
  since?: string;
  description?: string;
}

const default_companies: Company[] = [
  {
    id: 1,
    name: "Syntyce Solutions",
    owner: "Herbert Stokes",
    industry: "Health Services",
    rating: 2.9,
    location: "Berlin, Germany",
    logo: "🏢",
    employee: "10-50",
    website: "www.syntycesolution.com",
    email: "info@syntycesolution.com",
    since: "1995",
    description:
      "A company incurs fixed and variable costs such as the purchase of raw materials, salaries and overhead, as explained by AccountingTools, Inc. Business owners have the discretion to determine the actions.",
  },
  {
    id: 2,
    name: "Moetic Fashion",
    owner: "Timothy Smith",
    industry: "Textiles: Clothing, Footwear",
    rating: 4.9,
    location: "Damascus, Syria",
    logo: "👗",
  },
  {
    id: 3,
    name: "Meta4Systems",
    owner: "Nancy Martino",
    industry: "Computer Industry",
    rating: 3.3,
    location: "London, UK",
    logo: "🟡",
  },
  {
    id: 4,
    name: "Syntyce Solutions",
    owner: "Michael Morris",
    industry: "Chemical Industries",
    rating: 4.0,
    location: "Damascus, Syria",
    logo: "🏢",
  },
  {
    id: 5,
    name: "Micro Design",
    owner: "Mary Cousar",
    industry: "Financial Services",
    rating: 2.7,
    location: "Windhoek, Namibia",
    logo: "💎",
  },
  {
    id: 6,
    name: "Zoetic Fashion",
    owner: "James Price",
    industry: "Textiles: Clothing, Footwear",
    rating: 4.4,
    location: "Brasilia, Brazil",
    logo: "⭕",
  },
  {
    id: 7,
    name: "Digitech Galaxy",
    owner: "Alexis Clarke",
    industry: "Telecommunications Services",
    rating: 3.2,
    location: "Bogota, Colombia",
    logo: "🔵",
  },
  {
    id: 8,
    name: "Force Medicines",
    owner: "Glen Matney",
    industry: "Health Services",
    rating: 3.1,
    location: "Phoenix, USA",
    logo: "💊",
  },
];

const CompanyTable = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company>(
    default_companies[0]
  );
  const [selectedValue, setSelectedValue] = useState("");
  const [companies, setCompanies] = useState<Company[]>(default_companies);
  const [paginatedCompanies, setPaginatedCompanies] = useState<Company[]>();

  const options = [
    { value: "Location", label: "Location" },
    { value: "Company", label: "Company" },
    { value: "Owner", label: "Owner" },
    { value: "Rating", label: "Rating" },
  ];

  return (
    <>
      {/* Header */}
      <AddCompaniesHeader companies={companies} setCompanies={setCompanies} />

      <div className="min-h-screen bg-gray-50 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-x-6">
            {/* Main Table */}
            <div className="w-3/4 rounded shadow-sm transition-all duration-300 bg-white">
              {/* Search and Sort */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <FiSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for company..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <div className="relative">
                      <SelectDropdown
                        label=""
                        options={options}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        placeholder="Sort by"
                        className="w-40"
                      />
                      <FiChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <CompaniesTable
                companies={paginatedCompanies}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
              />

              {/* Pagination */}
              <GeneralPagination 
                datas={ companies }
                setPaginatedData={setPaginatedCompanies}
              />
            </div>

            {/* Company Details Sidebar */}
            <CompanyDetails selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyTable;
