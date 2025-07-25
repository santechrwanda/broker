"use client";
import { FiUpload } from "react-icons/fi";
import { useMemo, useState } from "react";
import { customers } from "./users.json";
import AddUserModal from "@/components/pages/users/add-user-modal";
import UsersList from "@/components/pages/users/users-list";
import UserFilters from "@/components/pages/users/user-filters";
import UserExports from "@/components/pages/users/user-exports";
import GeneralPagination from "@/components/common/pagination";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);

  // ✅ Memoize filtered results
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;

      const matchesDate = !selectedDate || customer.role.includes(selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, selectedStatus, selectedDate]);

  return (
    <div>
      {/* Header Section */}
      <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">USERS</h1>
          <p className="text-sm text-gray-500">Dashboard / Users</p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <FiUpload className="text-gray-500" />
            Import
          </button>
          <AddUserModal />
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

        <UsersList users={paginatedUsers} />

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
