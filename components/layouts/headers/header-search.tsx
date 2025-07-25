"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

interface HeaderSearchProps {
  setSearchOpen: (open: boolean) => void;
  searchOpen?: boolean;
}
const HeaderSearch: React.FC<HeaderSearchProps> = ({
  setSearchOpen,
  searchOpen,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const modalRef = React.useRef<HTMLDivElement>(null);
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // TODO: Implement search logic
    setSearchOpen(false);
  };

  // Animate modal open
  React.useEffect(() => {
    if (searchOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [searchOpen]);
  
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={() => setSearchOpen(false)}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md gap-2 relative min-h-74"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSearchSubmit} className="flex w-full">
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
  );
};

export default HeaderSearch;
