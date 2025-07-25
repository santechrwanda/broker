"use client";
import Breadcrumb from "@/components/ui/breadcrum";
import { SelectDropdown } from "@/components/ui/select";
import React, { useState, ChangeEvent } from "react";

const AddNewCompanyPage = () => {
  const createProjectBreadcrumb = [
    { label: "Companies", href: "/dashboard/companies" },
    { label: "Register a Company" },
  ];

  const [formData, setFormData] = useState<{
    title: string;
    address: string;
    telephone: string;
    thumbnail: File | null;
    description: string;
    privacy: string;
    categories: string;
    skills: string[];
    email: string;
    ownerFullName: string;
    numberOfShares: number;
    category:
      | "Finance"
      | "Agro-business"
      | "Health"
      | "Services"
      | "Technology";
    ownerAddress: string;
    ownerEmail: string;
    ownerPhone: string;
  }>({
    title: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    address: "",
    ownerFullName: "",
    numberOfShares: NaN,
    email: "",
    category: "Finance",
    telephone: "",
    thumbnail: null,
    description: `It will be as simple as occidental in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is. The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary.
• Product Design, Figma (Software), Prototype
• Four Dashboards : Ecommerce, Analytics, Project etc.
• Create calendar, chat and email app pages.
• Add authentication pages`,
    privacy: "Private",
    categories: "Designing",
    skills: ["UI/UX", "Figma", "HTML", "CSS", "Javascript", "C#", "Nodejs"],
  });
  const [companyCategory, setCompanyCategory] = useState<string>("");

  const [thumbnailName, setThumbnailName] = useState<string>("No file chosen");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
    }));
    setThumbnailName(file ? file.name : "No file chosen");
  };

  const categoryOptions = [
    { value: "Finance", label: "Finance" },
    { value: "Agro-business", label: "Agro-business" },
    { value: "Health", label: "Health" },
    { value: "Services", label: "Services" },
    { value: "Technology", label: "Technology" },
  ];

  return (
    <div>
      <div className="bg-white border-b border-gray-200 absolute top-0 left-0 w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full space-x-4 justify-between">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                REGISTER A COMPANY
              </h1>
              <Breadcrumb items={createProjectBreadcrumb} />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Title Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </h3>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </h3>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="48 KN 1 Rd"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Company Telephone
                  </h3>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="(+250) 783 250 033"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Company Logo
                  </h3>
                  <div className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none">
                    <label className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-md border border-gray-300 cursor-pointer transition-colors">
                      <span className="text-sm text-gray-700">Choose File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {thumbnailName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shares Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
                <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                  Company Shares info.
                </h3>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Number of Shares
                  </h3>
                  <input
                    type="number"
                    name="numberOfShares"
                    value={formData.numberOfShares || ""}
                    onChange={handleInputChange}
                    placeholder="320"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Company Category
                  </h4>
                  <div className="relative">
                    <SelectDropdown
                      options={categoryOptions}
                      value={companyCategory}
                      onChange={setCompanyCategory}
                      placeholder="Filter by status"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side*/}
            <div className="space-y-6">
              {/* Company Owners Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 pt-4">
                <h3 className="text-lg font-medium text-gray-900 pb-4 mb-4 border-b border-gray-200">
                  Company Owners info.
                </h3>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </h3>
                  <input
                    type="text"
                    name="ownerFullName"
                    value={formData.ownerFullName || ""}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Owner Email
                  </h3>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail || ""}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Owner Address
                  </h3>
                  <input
                    type="text"
                    name="ownerAddress"
                    value={formData.ownerAddress || ""}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Owner Phone
                  </h3>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone || ""}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-6 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-6 cursor-pointer py-2 bg-[#1f7e98] cusor-pointer text-white rounded-md hover:bg-[#004f64] transition-colors">
              Register Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCompanyPage;
