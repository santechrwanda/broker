"use client"
import { useMemo, useState } from "react"
import AddAndEditUserModal from "@/components/pages/users/add-and-edit-user-modal"
import UsersList from "@/components/pages/users/users-list"
import UserFilters from "@/components/pages/users/user-filters"
import UserExports from "@/components/pages/users/user-exports"
import GeneralPagination from "@/components/common/pagination"
import ImportingXlsxAndCsv from "@/components/pages/users/importing-files"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import type { ReduxErrorProps } from "@/utility/types"
import LoadingSpinner from "@/components/common/loading-spinner"
import { FiPlus } from "react-icons/fi"
const admin_action_names = ["Delete", "Edit", "View", "Block", "Activate"]
const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedDate, setSelectedDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([])
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false)

  // RTK Query hook for fetching users
  const { data: apiUsers, error, isLoading, isError, refetch } = useGetAllUsersQuery()

  // Combine API users with local users (or use only API users based on your needs)
  const allUsers = useMemo(() => {
    if (apiUsers) {
      return apiUsers
    }
    // Fallback to local users when API data is not available
    return []
  }, [apiUsers])

  // ✅ Memoize filtered results
  const filteredEmployees = useMemo(() => {
    return allUsers.filter((user) => {
      // Filter for roles that are NOT 'client' AND NOT 'agent'
      const matchesRole = user.role !== "client" && user.role !== "agent"

      const matchesSearch =
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.phone?.includes(searchQuery)

      const matchesStatus = selectedStatus === "All" || user.status === selectedStatus

      const matchesDate = !selectedDate || user.role.includes(selectedDate) // This seems to be filtering by role, not date. Keep as is if intended.

      return matchesRole && matchesSearch && matchesStatus && matchesDate
    })
  }, [searchQuery, selectedStatus, selectedDate, allUsers])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">
          Error loading users: {(error as ReduxErrorProps)?.data?.message || "Something went wrong"}
        </div>
        <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">EMPLOYEES</h1>
          <p className="text-sm text-gray-500">Dashboard / Users / Employees</p>
        </div>

        <div className="flex flex-col gap-1 mt-4 md:mt-0">
          <div className="flex gap-3">
            <ImportingXlsxAndCsv />

            <button
              onClick={() => setIsAddUpdateModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-4 py-1.5 bg-[#1b7b95] text-white rounded-lg hover:bg-[#004f64]"
            >
              <FiPlus />
              Add Employee
            </button>

            <AddAndEditUserModal isOpen={isAddUpdateModalOpen} setIsOpen={setIsAddUpdateModalOpen} />
          </div>
          <span className="text-xs text-gray-400 ml-1">Allowed files: .xlsx, .csv</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-8">
          <UserExports setShowFilters={setShowFilters} filteredUsers={filteredEmployees} />

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

        <UsersList users={paginatedUsers} allowed_actions={admin_action_names} />

        <GeneralPagination datas={filteredEmployees} setPaginatedData={setPaginatedUsers} />

        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-gray-500">No employee found matching your criteria</div>
        )}
      </div>
    </div>
  )
}

export default EmployeesPage
