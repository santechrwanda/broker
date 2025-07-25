"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import NavigationLinks from "@/components/pages/landing/nav-links";
import LanguageDropdown from "@/components/dropdowns/language-dropdown";
import MobileMenu from "@/components/dropdowns/mobile-menu";
import {
  useGetLoggedUserQuery,
  useLogoutUserMutation,
} from "@/hooks/use-authentication";
import { FaRegUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import HeaderSearch from "./header-search";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const { data: user } = useGetLoggedUserQuery();
  const [logoutUser] = useLogoutUserMutation();

  // Close modal on Escape
  React.useEffect(() => {
    if (!searchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  // Close profile dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const handleSignOut = async () => {
    await logoutUser().unwrap();
    window.location.href = "/sign-in";
  };

  return (
    <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] bg-white shadow-md sticky top-0">
      {/* Search Modal */}
      {searchOpen && (
        <HeaderSearch setSearchOpen={setSearchOpen} searchOpen={searchOpen} />
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

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2d94b0] to-[#004f64] text-white font-semibold shadow cursor-pointer transition"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <FaRegUserCircle size={22} className="inline-block" />
                <span>{user.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {user.role}
                </span>
                <FiChevronDown className="ml-1" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                  <div className="py-1">
                    <p className="block px-4 py-2 text-sm text-gray-700">
                      Signed in as <br />
                      <span className="font-semibold">{user.name}</span>
                    </p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2d94b0] to-[#004f64] text-white font-semibold shadow cursor-pointer transition"
            >
              <MdOutlineAccountCircle size={20} className="inline-block mr-2" />
              Sign in
            </Link>
          )}
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
