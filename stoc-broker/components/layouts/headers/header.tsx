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
import { useGetLoggedUserQuery } from "@/hooks/use-authentication";
import { FaRegUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import HeaderSearch from "./header-search";
import ProfileDropdown from "./profile-dropdown";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const { data: user } = useGetLoggedUserQuery();

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
                {user?.profile ? (
                  <Image
                    src={user?.profile}
                    alt={user?.name}
                    width={23}
                    height={23}
                    className="object-cover rounded-full w-[23px] h-[23px]"
                  />
                ) : (
                  <FaRegUserCircle size={22} className="inline-block" />
                )}
                <div className="">
                  <p>{`${user?.name.split(" ")[0][0].toUpperCase()}. ${user?.name?.split(" ")[1]}`}</p>
                  <p className="text-xs text-left capitalize px-2 rounded">
                    {user.role}
                  </p>
                </div>

                <FiChevronDown className="ml-1" />
              </button>
              {profileOpen && <ProfileDropdown user={user} />}
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
