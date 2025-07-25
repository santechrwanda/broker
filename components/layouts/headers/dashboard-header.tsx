"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiMessageCircle, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaRegUserCircle, FaSpinner } from "react-icons/fa";
import { useGetLoggedUserQuery } from "@/hooks/use-authentication";
import DashboardAccountMenu from "@/components/dropdowns/dashboard-account";

const getDisplayName = (fullName: string) => {
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    return `${firstName[0]}. ${lastName}`;
};

const DashboardHeader: React.FC = () => {
    const { data: user, isLoading } = useGetLoggedUserQuery();
    const displayName = getDisplayName(user?.names || "");
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <header className="flex items-center justify-between h-20 px-8 border-b border-gray-400/40 shadow bg-white sticky top-0 z-20">
            <nav className="flex w-5/12 items-center rounded-lg gap-2 bg-gray-50 border border-gray-200">
                <FiSearch className="text-gray-400 ml-2" size={18} />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-2  focus:outline-none text-sm"
                />
            </nav>
            <div className="flex items-center gap-7">
                <button className="relative text-gray-500 hover:text-[#004f64]">
                    <FiMessageCircle size={22} />
                </button>
                <button className="relative text-gray-500 hover:text-[#004f64]">
                    <FiBell size={22} />
                </button>

                <div className="flex items-center gap-2">
                    {/* Profile Icon */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#004f64] flex items-center justify-center bg-gray-100">
                        <FaRegUserCircle size={28} className="text-[#004f64]" />
                    </div>

                    {/* Name and Role with Dropdown */}
                    <div className="relative inline-block min-w-20 text-left" ref={menuRef}>
                        {!isLoading ?<button
                            id="menu-button"
                            type="button"
                            aria-expanded={open}
                            aria-haspopup="true"
                            className="inline-flex w-full items-center gap-x-1.5 px-3 py-2 text-sm cursor-pointer font-semibold text-gray-900"
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <div className="flex items-start flex-col gap-1">
                               <span className="font-medium text-gray-800">{displayName}</span>
                               <span className="text-sm text-gray-500">{user?.role}</span>
                            </div>
                            <FiChevronDown className="-mr-1 size-5 text-gray-400" />
                        </button>
                        : <FaSpinner className="animate-spin mr-2" />
                        }
                        {open && (
                           <DashboardAccountMenu user = { user } /> 
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
