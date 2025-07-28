import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTimes } from "react-icons/fa";

interface MenuProps {
    setMenuOpen: (bool: boolean) => void;
}
const navLinks = [
    "Home",
    "Services",
    "Market",
    "Partners",
    "About us",
    "Contact us",
];

const MobileMenu = ({ setMenuOpen }: MenuProps) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
            <div className="bg-white w-72 max-w-full h-full p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setMenuOpen(false)}
                    >
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={130}
                            height={40}
                            className="w-24"
                            priority
                        />
                    </Link>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <FaTimes className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <nav className="flex-1">
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((item) => (
                            <li key={item}>
                                <a
                                    href="#"
                                    className="block text-gray-700 font-medium py-2 px-2 rounded hover:bg-gray-100"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-8 flex flex-col gap-3">
                    <button className="text-gray-700 font-medium px-4 py-2 rounded transition hover:text-green-700 text-left">
                        Login
                    </button>
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-900 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-900 transition text-left">
                        Start Free Trial
                    </button>
                </div>
            </div>
            <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
    );
};

export default MobileMenu;
