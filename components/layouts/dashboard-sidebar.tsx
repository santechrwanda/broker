"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiShield,
  FiMessageSquare,
  FiSettings,
  FiUser,
  FiSearch,
} from "react-icons/fi";
import Image from "next/image";
import clsx from "clsx";
import { RiOrganizationChart } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";

const topNavLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FiHome size={20} /> },
  { name: "Security", href: "/dashboard/security", icon: <FiShield size={20} /> },
  { name: "Chats", href: "/dashboard/chats", icon: <FiMessageSquare size={20} /> },
  { name: "Users", href: "/dashboard/users", icon: <FiUser size={20} /> },
  { name: "Companies", href: "/dashboard/companies", icon: <RiOrganizationChart size={20} /> },
  { name: "Reports", href: "/dashboard/reports", icon: <TbReportAnalytics size={20} /> }
];

const bottomNavLinks = [
  { name: "Settings", href: "/dashboard/settings", icon: <FiSettings size={20} /> },
  { name: "Profile", href: "/dashboard/profile", icon: <FiUser size={20} /> },
];

const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-white h-screen w-64 flex flex-col justify-between border-r border-gray-100 shadow-sm fixed top-0 left-0 z-30">
      {/* Logo */}
      <div>
        <div className="flex items-center h-20 px-6 border-b border-gray-100">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={130}
              height={40}
              className="w-24"
              priority
            />
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 py-4">
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#004f64]/20 text-sm"
            />
          </div>

          {/* Top Nav */}
          <nav>
            <ul className="flex flex-col gap-2">
              {topNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition group",
                        isActive
                          ? "bg-[#eaf6fa] text-[#007fa3]"
                          : "text-gray-700 hover:bg-[#eaf6fa]",
                      )}
                    >
                      <span className={clsx("text-[#004f64] group-hover:text-[#007fa3]")}>
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="px-3 py-4 border-t border-gray-100">
        <ul className="flex flex-col gap-2">
          {bottomNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition group",
                    isActive
                      ? "bg-[#eaf6fa] text-[#007fa3]"
                      : "text-gray-700 hover:bg-[#eaf6fa]",
                  )}
                >
                  <span className={clsx("text-[#004f64] group-hover:text-[#007fa3]")}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
