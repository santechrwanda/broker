"use client";
import { useMemo, useState } from "react";
import { customers } from "./users";
import UsersList from "@/components/pages/users/users-list";
import UserFilters from "@/components/pages/users/user-filters";
import UserExports from "@/components/pages/users/user-exports";
import GeneralPagination from "@/components/common/pagination";
import { HiOutlineEye } from "react-icons/hi";
import { FaRegCircleStop } from "react-icons/fa6";

const userActions = [
  {
    action_name: "View details",
    icon: <HiOutlineEye className="size-4" />,
  },
  {
    action_name: "Report user",
    icon: <FaRegCircleStop className="size-4" />,
    onClick: () => alert("Report user clicked"),
    className: "text-[#c39305]",
  }
];

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);

  // ✅ Memoize filtered results
  const filteredCustomers = useMemo(() => {
    return customers?.filter((customer) => {
      const matchesSearch =
        customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.phone.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;

      const matchesDate = !selectedDate || customer.role.includes(selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, selectedStatus, selectedDate]);

  return (
    <div>
      {/* Header Section */}
      <div className="flex bg-white p-6 shadow justify-center  rounded-md flex-col md:flex-row md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MY CUSTOMERS</h1>
          <p className="text-sm text-gray-500">Dashboard / Customers</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-8">
          <UserExports
            setShowFilters={setShowFilters}
            filteredUsers={filteredCustomers}
          />

          {showFilters && (
            <UserFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          )}
        </div>

        <UsersList users={paginatedUsers} userActions={ userActions }/>

        <GeneralPagination
          datas={filteredCustomers}
          setPaginatedData={setPaginatedUsers}
        />

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No user found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
