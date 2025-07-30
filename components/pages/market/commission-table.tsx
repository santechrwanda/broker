"use client"
import CommisionsActionsDropdown from "@/components/dropdowns/commisions-actions-dropdown"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useGetAllCommissionsQuery, type Commission } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import LoadingSpinner from "@/components/common/loading-spinner"
import EditCommissionModal from "./edit-commission-modal"
import ConfirmDeleteCommissionModal from "./confirm-delete-commission-modal"
import ChangeCommissionStatusModal from "./change-commission-status-modal"
import ViewCommissionDetailsModal from "./view-commission-details-modal"
import AddCommissionModal from "./add-commission-modal" // Import the new modal

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  inprogress: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-blue-100 text-blue-700",
  rejected: "bg-purple-100 text-purple-700",
}

export default function CommisionTable() {
  const [search, setSearch] = useState("")
  const { data: commissions, isLoading: commissionsLoading, isError: commissionsError } = useGetAllCommissionsQuery()
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery()
  const { data: companies, isLoading: companiesLoading } = useGetAllCompaniesQuery()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false) // State for Add Commission Modal
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)

  const getBrokerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? user?.name : "Unknown Broker"
  }

  const getCustomerName = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user ? user?.name : "Unknown Customer"
  }

  const getCompanyName = (id: string) => {
    const company = companies?.find((c) => c.id === id)
    return company ? company.companyName : "Unknown Company"
  }

  const handleEdit = (commission: Commission) => {
    setSelectedCommission(commission)
    setIsEditModalOpen(true)
  }

  const handleDelete = (commission: Commission) => {
    setSelectedCommission(commission)
    setIsDeleteModalOpen(true)
  }

  const handleChangeStatus = (commission: Commission) => {
    setSelectedCommission(commission)
    setIsStatusModalOpen(true)
  }

  const handleViewDetails = (commission: Commission) => {
    setSelectedCommission(commission)
    setIsViewDetailsModalOpen(true)
  }

  const handleAddCommission = () => {
    setIsAddModalOpen(true)
  }

  const filteredCommissions =
    commissions?.filter(
      (item) =>
        getBrokerName(item.brokerId).toLowerCase().includes(search.toLowerCase()) ||
        getCustomerName(item.customerId).toLowerCase().includes(search.toLowerCase()) ||
        getCompanyName(item.companyId).toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()),
    ) || []

  if (commissionsLoading || usersLoading || companiesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (commissionsError) {
    return <div className="text-center py-8 text-red-500">Failed to load commissions.</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Commissions List</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border placeholder:text-sm border-gray-300 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddCommission}
            className="px-4 py-3 bg-[#2d90ab] min-w-36 text-white rounded-md cursor-pointer shadow-sm hover:bg-[#004f64] focus:outline-none text-sm"
          >
            Add Commission
          </button>
        </div>
      </div>

      <div className="max-sm:overflow-x-auto mt-7">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broker Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCommissions.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {getBrokerName(item.brokerId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{getCustomerName(item.customerId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{getCompanyName(item.companyId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${Number(item.totalAmount)?.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-x-3">
                  <CommisionsActionsDropdown
                    commission={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                    onViewDetails={handleViewDetails}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCommissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">No commissions found matching your criteria</div>
      )}

      {/* Pagination (static example, can be made dynamic) */}
      <div className="mt-4 flex justify-end items-center gap-2 text-sm">
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">Previous</button>
        <button className="px-3 py-1 bg-[#20acd3] border border-[#20acd3] text-white rounded">1</button>
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">2</button>
        <button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">Next</button>
      </div>

      {selectedCommission && (
        <>
          <EditCommissionModal
            commission={selectedCommission}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
          <ConfirmDeleteCommissionModal
            commission={selectedCommission}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          />
          <ChangeCommissionStatusModal
            commission={selectedCommission}
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
          />
          <ViewCommissionDetailsModal
            commission={selectedCommission}
            isOpen={isViewDetailsModalOpen}
            onClose={() => setIsViewDetailsModalOpen(false)}
          />
        </>
      )}
      <AddCommissionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}