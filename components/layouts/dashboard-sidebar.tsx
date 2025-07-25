"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiSettings,
    FiUser,
} from "react-icons/fi";
import Image from "next/image";
import clsx from "clsx";

const bottomNavLinks = [
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: <FiSettings size={20} />,
    },
    { name: "Profile", href: "/dashboard/profile", icon: <FiUser size={20} /> },
];

interface SideBarProps {
    topNavLinks: {
        name: string;
        href: string;
        icon: React.ReactNode;
    }[]
}
const DashboardSidebar: React.FC<SideBarProps> = ({ topNavLinks }) => {
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
                                            <span
                                                className={clsx(
                                                    "text-[#004f64] group-hover:text-[#007fa3]",
                                                )}
                                            >
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
                <ul className="flex flex-col gap-1">
                    {bottomNavLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-2 text-sm rounded-lg font-medium transition group",
                                        isActive
                                            ? "bg-[#eaf6fa] text-[#007fa3]"
                                            : "text-gray-700 hover:bg-[#eaf6fa]",
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            "text-[#004f64] group-hover:text-[#007fa3]",
                                        )}
                                    >
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
