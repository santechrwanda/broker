"use client"
import { FiTrendingUp } from "react-icons/fi"
import type React from "react"

import { IoShareSocialOutline } from "react-icons/io5"
import { LuUsers } from "react-icons/lu"
import { useGetAllCommissionsQuery } from "@/hooks/use-commissions"
import { useGetAllUsersQuery } from "@/hooks/use-users"
import { useGetAllCompaniesQuery } from "@/hooks/use-company"
import LoadingSpinner from "@/components/common/loading-spinner"

interface StatsCardProps {
  stats?: {
    label: string
    value: string | number
    icon: React.ReactNode
    bg: string
  }[]
}

export default function StatsCards({ stats }: StatsCardProps) {
  const { data: commissions, isLoading: commissionsLoading, isError: commissionsError } = useGetAllCommissionsQuery()
  const { data: users, isLoading: usersLoading, isError: usersError } = useGetAllUsersQuery()
  const { data: companies, isLoading: companiesLoading, isError: companiesError } = useGetAllCompaniesQuery()

  const isLoading = commissionsLoading || usersLoading || companiesLoading
  const isError = commissionsError || usersError || companiesError

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm h-32 animate-pulse">
          
        </div>
        <div className="flex items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm h-32">
          
        </div>
        <div className="flex items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm h-32">
          
        </div>
        <div className="flex items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm h-32">
          
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full text-center text-red-500 p-6 bg-white rounded-lg shadow-sm">
          Error loading statistics.
        </div>
      </div>
    )
  }

  const totalCommission = commissions?.reduce((sum, c) => sum + c.commissionAmount, 0) || 0
  const numberOfCustomers = users?.filter((user) => user.role === "customer").length || 0
  const availableSecurities = companies?.length || 0
  const commissionCents = Number(totalCommission > 0 ? totalCommission/1000 : 0).toFixed(2) // Assuming commission is in cents

  const statisticsData = stats || [
    {
      label: "Total Commission",
      value: `$${ commissionCents }k`,
      icon: <FiTrendingUp className="text-blue-500" />,
      bg: "bg-blue-100",
    },
    {
      label: "No. of Customers",
      value: numberOfCustomers,
      icon: <LuUsers className="text-red-500" />,
      bg: "bg-red-100",
    },
    {
      label: "Available Securities",
      value: availableSecurities,
      icon: <IoShareSocialOutline className="text-yellow-500" />,
      bg: "bg-yellow-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((stat, index) => (
        <div key={index} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
          </div>
          <div className={`w-10 h-10 flex items-center justify-center rounded-md ${stat.bg}`}>{stat.icon}</div>
        </div>
      ))}

      <div key={4} className="flex items-center justify-between bg-gray-50 p-6 rounded-lg shadow-sm">
        <div>
          <p className="text-sm text-gray-500">Display Data of current:</p>
          <div className="flex gap-2 items-end mt-2">
            <button
              className={`${false ? "border border-red-500/20" : "bg-red-500/20"} px-3 cursor-pointer h-7 text-red-500 hover:text-white hover:bg-red-400 text-[12px] rounded`}
            >
              Month
            </button>
            <button className="border border-info/20 px-3 cursor-pointer h-7 text-info hover:text-white hover:bg-info text-[12px] rounded">
              Week
            </button>
            <button className="border border-yellow-500/20 cursor-pointer px-3 h-7 text-yellow-600 hover:text-white hover:bg-yellow-400 text-[12px] rounded">
              Day
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}