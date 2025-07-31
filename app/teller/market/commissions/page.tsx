"use client"
import { useMemo, useState } from "react"
import { useGetAllCommissionsQuery } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import LoadingSpinner from "@/components/common/loading-spinner"
import GeneralPagination from "@/components/common/pagination"
import ViewCommissionDetailsModal from "@/components/pages/market/view-commission-details-modal"
import EditCommissionModal from "@/components/pages/market/edit-commission-modal"
import { FiEye, FiEdit } from "react-icons/fi"

const TellerCommissionsPage = () => {
  const { data: commissions = [], isLoading, error, refetch } = useGetAllCommissionsQuery()
  const { data: users = [] } = useGetAllUsersQuery()
  const { data: companies = [] } = useGetAllCompaniesQuery()

  // Mock current teller ID - in real app, this would come from auth context
  const currentTellerId = "teller-123"

  const [paginatedCommissions, setPaginatedCommissions] = useState<any[]>([])
  const [selectedCommission, setSelectedCommission] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Filter commissions assigned to current teller or where teller is involved
  const tellerCommissions = useMemo(() => {
    return commissions.filter(
      (commission) => commission.brokerId === currentTellerId || commission.assignedTellerId === currentTellerId,
    )
  }, [commissions, currentTellerId])

  const handleViewDetails = (commission: any) => {
    setSelectedCommission(commission)
    setIsViewModalOpen(true)
  }

  const handleEdit = (commission: any) => {
    setSelectedCommission(commission)
    setIsEditModalOpen(true)
  }

  const getBrokerName = (brokerId: string) => {
    const broker = users.find((user) => user.id === brokerId)
    return broker ? broker.name : "Unknown Broker"
  }

  const getCustomerName = (customerId: string) => {
    const customer = users.find((user) => user.id === customerId)
    return customer ? customer.name : "Unknown Customer"
  }

  const getCompanyName = (companyId: string) => {
    const company = companies.find((comp) => comp.id === companyId)
    return company ? company.companyName : "Unknown Company"
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">
          Error loading commissions: {(error as any)?.data?.message || "Something went wrong"}
        </div>
        <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Commissions</h1>
        <p className="text-gray-600 mt-2">Manage commissions assigned to you or where you&apos;re involved</p>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {tellerCommissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Commissions</h3>
              <p className="text-gray-500">You don&apos;t have any commissions assigned to you yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCommissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getBrokerName(commission.brokerId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCustomerName(commission.customerId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCompanyName(commission.companyId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${commission.commissionAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              commission.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : commission.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : commission.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {commission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(commission)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <FiEye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(commission)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            >
                              <FiEdit className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <GeneralPagination datas={tellerCommissions} setPaginatedData={setPaginatedCommissions} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewCommissionDetailsModal
        commission={selectedCommission}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedCommission(null)
        }}
      />

      <EditCommissionModal
        commission={selectedCommission}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCommission(null)
        }}
      />
    </div>
  )
}

export default TellerCommissionsPage