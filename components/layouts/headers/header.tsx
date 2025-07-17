"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTimes, FaBars } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import NavigationLinks from "@/components/landing/nav-links";
import LanguageDropdown from "@/components/dropdowns/language-dropdown";
const navLinks = ["Services", "Market", "Partners", "About us"];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] bg-white shadow-md">
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
            <button className="text-gray-700 font-medium px-4 py-2 rounded transition hover:text-green-700">
                <CiSearch size={25} className="inline-block mr-2" />
            </button>
            
            <LanguageDropdown />

            <Link href="/sign-in" className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2d94b0] to-[#004f64] text-white font-semibold shadow cursor-pointer transition">
                <MdOutlineAccountCircle size={ 20 } className="inline-block mr-2" />
                Sign in
            </Link>
            
        </div>
        
        {/* Mobile Hamburger */}
        <button
          className="lg:hidden ml-auto"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="w-7 h-7 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
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
      )}
    </header>
  );
};

export default Header;