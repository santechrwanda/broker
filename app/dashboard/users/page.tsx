"use client";
import { useMemo, useState } from "react";
import AddUserModal from "@/components/pages/users/add-user-modal";
import UsersList from "@/components/pages/users/users-list";
import UserFilters from "@/components/pages/users/user-filters";
import UserExports from "@/components/pages/users/user-exports";
import GeneralPagination from "@/components/common/pagination";

import React from "react";
import ImportingXlsxAndCsv from "@/components/pages/users/importing-files";
import { useGetAllUsersQuery } from "@/hooks/use-users";
import { ReduxErrorProps } from "@/utility/types";
import LoadingSpinner from "@/components/common/loading-spinner";
import { UserAction } from "@/components/dropdowns/users-actions-dropdown";
import { LuPencil } from "react-icons/lu";
import { HiOutlineEye } from "react-icons/hi";
import { FaRegCircleStop } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // RTK Query hook for fetching users
  const {
    data: apiUsers,
    error,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery();

  // Combine API users with local users (or use only API users based on your needs)
  const allUsers = useMemo(() => {
    if (apiUsers) {
      return apiUsers;
    }
    // Fallback to local users when API data is not available
    return [];
  }, [apiUsers]);

  const defaultActions: UserAction[] = [
    {
      action_name: "Edit",
      icon: <LuPencil className="size-4" />,
      onClick: () => alert("Edit clicked"),
    },
    {
      action_name: "View",
      icon: <HiOutlineEye className="size-4" />,
    },
    {
      action_name: "Block",
      icon: <FaRegCircleStop className="size-4" />,
      onClick: () => alert("Block clicked"),
      className: "text-[#c39305]",
    },
    {
      action_name: "Delete",
      icon: <RiDeleteBin5Line className="size-4" />,
      onClick: () => setIsDeleteOpen(true),
      destructive: true,
    },
  ];

  // ✅ Memoize filtered results
  const filteredCustomers = useMemo(() => {
    return allUsers.filter((customer) => {
      const matchesSearch =
        customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.phone?.includes(searchQuery);

      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;

      const matchesDate = !selectedDate || customer.role.includes(selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, selectedStatus, selectedDate, allUsers]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">
          Error loading users:{" "}
          {(error as ReduxErrorProps)?.data?.message || "Something went wrong"}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">USERS</h1>
          <p className="text-sm text-gray-500">Dashboard / Users</p>
        </div>

        <div className="flex flex-col gap-1 mt-4 md:mt-0">
          <div className="flex gap-3">
            <ImportingXlsxAndCsv />

            <AddUserModal />
          </div>
          <span className="text-xs text-gray-400 ml-1">
            Allowed files: .xlsx, .csv
          </span>
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

        <UsersList
          users={paginatedUsers}
          userActions={defaultActions}
          setIsDeleteOpen={setIsDeleteOpen}
          isDeleteOpen={isDeleteOpen}
        />

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
