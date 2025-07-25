"use client";
import CommisionsActionsDropdown from "@/components/dropdowns/commisions-actions-dropdown";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const data = [
	{
		broker: "Alice Johnson",
		brokerRole: "Agent",
		customer: "Timothy Smith",
		company: "MTNR",
		status: "completed",
	},
	{
		broker: "Bob Williams",
		brokerRole: "Teller",
		customer: "Herbert Stokes",
		company: "BKGR",
		status: "inprogress",
	},
	{
		broker: "Carol Lee",
		brokerRole: "Agent",
		customer: "Charles Kubik",
		company: "EQTY",
		status: "cancelled",
	},
	{
		broker: "David Kim",
		brokerRole: "Teller",
		customer: "Glen Matney",
		company: "KCB",
		status: "completed",
	},
	{
		broker: "Eva Brown",
		brokerRole: "Agent",
		customer: "Carolyn Jones",
		company: "MTNR",
		status: "inprogress",
	},
	{
		broker: "Frank Green",
		brokerRole: "Teller",
		customer: "Kevin Dawson",
		company: "BKGR",
		status: "completed",
	},
];

const statusColors: Record<string, string> = {
	completed: "bg-green-100 text-green-700",
	inprogress: "bg-yellow-100 text-yellow-700",
	cancelled: "bg-red-100 text-red-700",
};

export default function CommisionTable() {
	const [search, setSearch] = useState("");

	const filtered = data.filter(
		(item) =>
			item.broker.toLowerCase().includes(search.toLowerCase()) ||
			item.brokerRole.toLowerCase().includes(search.toLowerCase()) ||
			item.customer.toLowerCase().includes(search.toLowerCase()) ||
			item.company.toLowerCase().includes(search.toLowerCase()) ||
			item.status.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 mt-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-semibold text-gray-700">
					Commissions List
				</h2>
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
			</div>

			<div className="max-sm:overflow-x-auto mt-7">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Broker Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Broker Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Company
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
						{filtered.map((item, idx) => (
							<tr key={idx} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
									{item.broker}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{item.brokerRole}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{item.customer}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{item.company}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${
											statusColors[item.status]
										}`}
									>
										{item.status.charAt(0).toUpperCase() +
											item.status.slice(1)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap flex gap-x-3">
									<CommisionsActionsDropdown />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					No commission found matching your criteria
				</div>
			)}

			{/* Pagination (static example, can be made dynamic) */}
			<div className="mt-4 flex justify-end items-center gap-2 text-sm">
				<button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
					Previous
				</button>
				<button className="px-3 py-1 bg-[#20acd3] border border-[#20acd3] text-white rounded">
					1
				</button>
				<button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
					2
				</button>
				<button className="px-3 py-1 border border-gray-500/40 rounded text-gray-600">
					Next
				</button>
			</div>
		</div>
	);
}
