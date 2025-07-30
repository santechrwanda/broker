"use client";

import SecuritySummary from "@/components/pages/market/security-summar";
import SecuritiesTable from "@/components/pages/market/market-table";
import { FiTrendingUp } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";

const statistics = [
  {
    label: "Total Buy",
    value: "$658.00k",
    icon: <FiTrendingUp className="text-blue-500" />,
    bg: "bg-blue-100",
  },
  {
    label: "My Shares",
    value: "243",
    icon: <IoShareSocialOutline className="text-red-500" />,
    bg: "bg-red-100",
  },

  {
    label: "No of Securities",
    value: "104",
    icon: <IoShareSocialOutline className="text-yellow-500" />,
    bg: "bg-yellow-100",
  },
];

const SecuritiesPage: React.FC = () => {

  return (
    <>
      <SecuritySummary stats={ statistics } />  
      <SecuritiesTable />
    </>
  );
};

export default SecuritiesPage;
