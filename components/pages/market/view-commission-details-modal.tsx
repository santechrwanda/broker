"use client"
import { HiOutlineX } from "react-icons/hi"
import { FiPhone, FiMail } from "react-icons/fi"
import type { Commission } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import LoadingSpinner from "@/components/common/loading-spinner"

interface ViewCommissionDetailsModalProps {
  commission: Commission | null
  isOpen: boolean
  onClose: () => void
}

const ViewCommissionDetailsModal = ({ commission, isOpen, onClose }: ViewCommissionDetailsModalProps) => {
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery()
  const { data: companies, isLoading: companiesLoading } = useGetAllCompaniesQuery()

  if (!isOpen || !commission) return null

  const getBrokerDetails = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        }
      : null
  }

  const getCustomerDetails = (id: string) => {
    const user = users?.find((u) => u.id === id)
    return user
      ? {
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      : null
  }

  const getCompanyDetails = (id: string) => {
    const company = companies?.find((c) => c.id === id)
    return company
      ? {
          name: company.companyName,
          email: company.companyAddress,
          phone: company.companyTelephone,
          website: company.companyName,
        }
      : null
  }

  const broker = getBrokerDetails(commission.brokerId)
  const customer = getCustomerDetails(commission.customerId)
  const company = getCompanyDetails(commission.companyId)

  if (usersLoading || companiesLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
        <LoadingSpinner />
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    inprogress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-purple-100 text-purple-700",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity z-40" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl z-50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between border-b pb-4 mb-4">
              <h3 className="text-2xl leading-6 font-semibold text-gray-900">Commission Details</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Commission Info */}
              <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Transaction Overview</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Commission ID:</span> {commission.id}
                  </p>
                  <p>
                    <span className="font-medium">Shares:</span> {commission.numberOfShares}
                  </p>
                  <p>
                    <span className="font-medium">Price Per Share:</span> {Number(commission?.pricePerShare).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Commission Rate:</span> {Number(commission.commissionRate * 100).toFixed(2)}
                    %
                  </p>
                  <p>
                    <span className="font-medium">Total Amount:</span> ${Number(commission?.totalAmount).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Commission Amount:</span> ${Number(commission?.commissionAmount).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[commission.status]}`}>
                      {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Created At:</span> {new Date(commission.createdAt)?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span> {new Date(commission.updatedAt)?.toLocaleString()}
                  </p>
                  {commission.notes && (
                    <p>
                      <span className="font-medium">Notes:</span> {commission.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Related Parties & Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Broker Details */}
                {broker && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Broker Details</h4>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span> {broker.name}
                      </p>
                      <p>
                        <span className="font-medium">Role:</span>{" "}
                        {broker.role.charAt(0).toUpperCase() + broker.role.slice(1)}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {broker.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {broker.phone || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${broker.email}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b7b95] hover:bg-[#20acd3]"
                      >
                        <FiMail className="mr-2" /> Message Broker
                      </a>
                      {broker.phone && (
                        <a
                          href={`tel:${broker.phone}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                        >
                          <FiPhone className="mr-2" /> Call Broker
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Details */}
                {customer && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Details</h4>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span> {customer.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {customer.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {customer.phone || "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${customer.email}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#fbbf24] hover:bg-[#eab308]"
                      >
                        <FiMail className="mr-2" /> Message Customer
                      </a>
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                        >
                          <FiPhone className="mr-2" /> Call Customer
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Company Details */}
                {company && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Company Details</h4>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span> {company.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {company.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {company.phone || "N/A"}
                      </p>
                      {company.website && (
                        <p>
                          <span className="font-medium">Website:</span>{" "}
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${company.email}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#20acd3] hover:bg-[#1b7b95]"
                      >
                        <FiMail className="mr-2" /> Message Company
                      </a>
                      {company.phone && (
                        <a
                          href={`tel:${company.phone}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                        >
                          <FiPhone className="mr-2" /> Call Company
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCommissionDetailsModal