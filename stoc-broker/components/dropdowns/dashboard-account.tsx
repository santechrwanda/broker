import { LoggedUser } from "@/hooks/use-authentication";
import React from "react";
import { useLogoutUserMutation } from "@/hooks/use-authentication";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AccountsProps {
    user?: LoggedUser;
}

const DashboardAccountMenu: React.FC<AccountsProps> = ({ user }) => {
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser().unwrap();
      router.push("/sign-in");
    } catch {
      // Optionally handle error
    }
  };

  return (
    <div
      role="menu"
      tabIndex={-1}
      aria-labelledby="menu-button"
      aria-orientation="vertical"
      className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100"
    >
      <div role="none" className="py-1">
        <p
          id="menu-item-0"
          role="menuitem"
          tabIndex={-1}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Signed In as <br />{" "}
          <span className="font-semibold">{user?.name}</span>
        </p>
      </div>
      <div role="none" className="py-1">
        <a
          id="menu-item-2"
          role="menuitem"
          href="#"
          tabIndex={-1}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Account Settings
        </a>
        <a
          id="menu-item-3"
          role="menuitem"
          href="#"
          tabIndex={-1}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Profile
        </a>
      </div>
      <div role="none" className="py-1">
        <Link
          href="#"
          id="menu-item-4"
          role="menuitem"
          tabIndex={-1}
          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
          onClick={handleSignOut}
        >
          {isLoading ? "Signing out..." : "Sign out"}
        </Link>
      </div>
    </div>
  );
};

export default DashboardAccountMenu;
