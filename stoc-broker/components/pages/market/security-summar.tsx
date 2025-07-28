// components/StatsCards.tsx
import {
  FiTrendingUp,
} from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";

const statistics = [
  {
    label: "Total Commission",
    value: "$658.00k",
    icon: <FiTrendingUp className="text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    label: "No. of Customers",
    value: "243",
    icon: <LuUsers className="text-red-500" />,
    bg: "bg-red-100",
  },

  {
    label: "Available Securities",
    value: "104",
    icon: <IoShareSocialOutline className="text-yellow-500" />,
    bg: "bg-yellow-100",
  },
];

interface StatsCardProps {
  stats?: {
    label: string;
    value: string;
    icon: React.ReactNode;
    bg: string;
  }[];
}

export default function StatsCards({ stats = statistics }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm"
        >
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
          </div>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-md ${stat.bg}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}

      <div
          key={ 4 }
          className="flex items-center justify-between bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <div>
            <p className="text-sm text-gray-500">Display Data of current:</p>
            <div className="flex gap-2 items-end mt-2">
                <button className={`${false ? "border border-red-500/20" : "bg-red-500/20"} px-3 cursor-pointer h-7 text-red-500 hover:text-white hover:bg-red-400 text-[12px] rounded`}>Month</button>
                <button className="border border-info/20 px-3 cursor-pointer  h-7 text-info hover:text-white hover:bg-info text-[12px] rounded">Week</button>
                <button className="border border-yellow-500/20 cursor-pointer px-3 h-7 text-yellow-600 hover:text-white hover:bg-yellow-400 text-[12px] rounded">Day</button>
            </div>
          </div>
        </div>
    </div>
  );
}
