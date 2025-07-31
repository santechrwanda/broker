"use client"
import { useMemo } from "react"
import { useGetAllCommissionsQuery } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import { useGetMarketDataQuery } from "@/hooks/use-market"
import LoadingSpinner from "@/components/common/loading-spinner"
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { BsFillBuildingFill } from "react-icons/bs"

const ClientDashboard = () => {
  const { data: commissions = [], isLoading: isLoadingCommissions } = useGetAllCommissionsQuery()
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery()
  const { data: companies = [], isLoading: isLoadingCompanies } = useGetAllCompaniesQuery()
  const { data: marketData = [], isLoading: isLoadingMarket } = useGetMarketDataQuery({});

  // Mock current user ID - in real app, this would come from auth context
  const currentUserId = "user-123"

  // Filter commissions for current client
  const myCommissions = useMemo(() => {
    return commissions.filter((commission) => commission.customerId === currentUserId)
  }, [commissions, currentUserId])

  const stats = useMemo(() => {
    const totalCommissions = myCommissions.length
    const completedCommissions = myCommissions.filter((c) => c.status === "completed").length
    const pendingCommissions = myCommissions.filter((c) => c.status === "pending").length
    const totalCommissionAmount = myCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0)

    return {
      totalCommissions,
      completedCommissions,
      pendingCommissions,
      totalCommissionAmount,
      totalCompanies: companies.length,
      totalMarketValue: marketData.reduce((sum, m) => sum + (m.value || 0), 0),
    }
  }, [myCommissions, companies, marketData])

  if (isLoadingCommissions || isLoadingUsers || isLoadingCompanies || isLoadingMarket) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here&apos;s your portfolio overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Commissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCommissions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.completedCommissions} completed</span>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-yellow-600 font-medium">{stats.pendingCommissions} pending</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commission Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalCommissionAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BsFillBuildingFill className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Market Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalMarketValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Commissions</h2>
        </div>
        <div className="p-6">
          {myCommissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No commissions found. Start trading to see your commissions here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myCommissions.slice(0, 5).map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commission.companyId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.numberOfShares}</td>
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
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {commission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
