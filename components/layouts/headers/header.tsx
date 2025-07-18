"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import gsap from "gsap";
import NavigationLinks from "@/components/pages/landing/nav-links";
import LanguageDropdown from "@/components/dropdowns/language-dropdown";
import MobileMenu from "@/components/dropdowns/mobile-menu";

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const modalRef = React.useRef<HTMLDivElement>(null);

    // Animate modal open
    React.useEffect(() => {
        if (searchOpen && modalRef.current) {
            gsap.fromTo(
                modalRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
            );
        }
    }, [searchOpen]);

    // Close modal on Escape
    React.useEffect(() => {
        if (!searchOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSearchOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [searchOpen]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // TODO: Implement search logic
        setSearchOpen(false);
    };

    return (
        <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] bg-white shadow-md sticky top-0">
            {/* Search Modal */}
            {searchOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
                    onClick={() => setSearchOpen(false)}
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md gap-2 relative min-h-74"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex w-full"
                        >
                            <input
                                type="text"
                                autoFocus
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-[#004f64] hover:bg-[#004f64]/70 text-white px-4 py-2 rounded-r-lg flex items-center justify-center transition-colors"
                                aria-label="Submit search"
                            >
                                <CiSearch size={22} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="relative flex flex-wrap items-center gap-4">
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

                {/* Desktop Nav */}
                <nav className="hidden lg:flex flex-1 justify-center">
                    <NavigationLinks />
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        className="text-gray-700 font-medium px-4 py-2 rounded transition hover:text-green-700"
                        onClick={() => setSearchOpen(true)}
                    >
                        <CiSearch size={25} className="inline-block mr-2" />
                    </button>

                    <LanguageDropdown />

                    <Link
                        href="/sign-in"
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2d94b0] to-[#004f64] text-white font-semibold shadow cursor-pointer transition"
                    >
                        <MdOutlineAccountCircle
                            size={20}
                            className="inline-block mr-2"
                        />
                        Sign in
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="lg:hidden ml-auto"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <FaBars className="w-7 h-7 text-[#004f64]" />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} />}
        </header>
    );
};

export default Header;
