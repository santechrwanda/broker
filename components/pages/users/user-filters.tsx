"use client";
import { SelectDropdown } from "@/components/ui/select";
import React from "react";
import { FiSearch } from "react-icons/fi"; 

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedDate: (date: string) => void;
  selectedDate: string;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const UserFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}: UserFiltersProps) => {

  const userStatus = [
    { label: "All", value: "All" },
    { label: "Active", value: "ACTIVE" },
    { label: "Blocked", value: "BLOCKED" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 pt-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for name, email, phone, status..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-[450px] focus:outline-none focus:ring-1 focus:ring-[#1b7b95] focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <SelectDropdown
          label=""
          options={userStatus}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Filter by status"
          className="w-40"
        />
      </div>
    </div>
  );
};

export default UserFilters;
