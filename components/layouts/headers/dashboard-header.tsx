import React from "react";
import { FiBell, FiMessageCircle } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import NavigationLinks from "@/components/pages/landing/nav-links";

const user = {
    names: "Bikorimana Saveur",
    role: "Admin",
};

const getDisplayName = (fullName: string) => {
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    return `${firstName[0]}. ${lastName}`;
};

const DashboardHeader: React.FC = () => {
    const displayName = getDisplayName(user.names);

    return (
        <header className="flex items-center justify-between h-20 px-8 border-b border-gray-100 bg-white sticky top-0 z-20">
            <nav className="flex gap-8">
                <NavigationLinks />
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

                    {/* Name and Role */}
                    <div className="text-sm leading-tight">
                        <div className="font-medium text-gray-800">
                            {displayName}
                        </div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
