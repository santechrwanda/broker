"use client";
import { UserShape } from "@/components/pages/users/users-list";
import { useLogoutUserMutation } from "@/hooks/use-authentication";
import Link from "next/link";
import React from "react";

interface ProfileProps {
  user: UserShape;
}
const ProfileDropdown = ({ user }: ProfileProps) => {
  const [logoutUser] = useLogoutUserMutation();
  const handleSignOut = async () => {
    await logoutUser().unwrap();
    window.location.href = "/sign-in";
  };
  return (
    <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
      <div className="py-1">
        <p className="block px-4 py-2 text-sm text-gray-700">
          Signed in as <br />
          <span className="font-semibold">{user.name}</span>
        </p>
      </div>
      <div className="py-1">
        <Link
          href="/sign-in"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Dashboard
        </Link>
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
  );
};

export default ProfileDropdown;
