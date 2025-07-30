"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiSettings, FiUser } from "react-icons/fi"
import Image from "next/image"
import clsx from "clsx"
import { FaChevronDown } from "react-icons/fa" // Import ChevronDown for dropdown indicator

interface NavLink {
  name: string
  href: string
  icon: React.ReactNode
  subLinks?: NavLink[] // Add optional subLinks
}

const bottomNavLinks = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <FiSettings size={20} />,
  },
  { name: "Profile", href: "/dashboard/profile", icon: <FiUser size={20} /> },
]

interface SideBarProps {
  topNavLinks: NavLink[]
}

const DashboardSidebar: React.FC<SideBarProps> = ({ topNavLinks }) => {
  const pathname = usePathname()
  const [openSubMenu, setOpenSubMenu] = React.useState<Record<string, boolean>>({})

  // Initialize openSubMenu based on current pathname
  React.useEffect(() => {
    const initialOpenState: Record<string, boolean> = {}
    topNavLinks.forEach((link) => {
      if (link.subLinks) {
        initialOpenState[link.name] = link.subLinks.some((subLink) => pathname.startsWith(subLink.href))
      }
    })
    setOpenSubMenu(initialOpenState)
  }, [pathname, topNavLinks])

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <aside className="bg-white h-screen w-64 flex flex-col justify-between border-r border-gray-100 shadow-sm fixed top-0 left-0 z-30">
      {/* Logo */}
      <div>
        <div className="flex items-center h-20 px-6 border-b border-gray-100">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={130} height={40} className="w-24" priority />
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 py-4">
          {/* Top Nav */}
          <nav>
            <ul className="flex flex-col gap-1">
              {topNavLinks.map((link) => {
                const isParentActive =
                  link.subLinks && link.subLinks.some((subLink) => pathname.startsWith(subLink.href))
                const isLinkActive = pathname === link.href // For direct links without sub-menus

                return (
                  <li key={link.name}>
                    {link.subLinks ? (
                      // Parent link with sub-menus (clickable to open/close dropdown)
                      <div
                        onClick={() => toggleSubMenu(link.name)}
                        className={clsx(
                          "flex items-center justify-between gap-3 text-sm px-4 py-2 rounded-lg font-medium transition group cursor-pointer",
                          isParentActive ? "bg-[#eaf6fa] text-[#007fa3]" : "text-gray-700 hover:bg-[#eaf6fa]",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={clsx(
                              "text-[#004f64] group-hover:text-[#007fa3]",
                              isParentActive && "text-[#007fa3]",
                            )}
                          >
                            {link.icon}
                          </span>
                          <span>{link.name}</span>
                        </span>
                        <FaChevronDown
                          size={10}
                          className={clsx("transition-transform", openSubMenu[link.name] ? "rotate-0" : "-rotate-90")}
                        />
                      </div>
                    ) : (
                      // Regular link without sub-menus
                      <Link
                        href={link.href}
                        className={clsx(
                          "flex items-center gap-3 text-sm px-4 py-2 rounded-lg font-medium transition group",
                          isLinkActive ? "bg-[#eaf6fa] text-[#007fa3]" : "text-gray-700 hover:bg-[#eaf6fa]",
                        )}
                      >
                        <span
                          className={clsx(
                            "text-[#004f64] group-hover:text-[#007fa3]",
                            isLinkActive && "text-[#007fa3]",
                          )}
                        >
                          {link.icon}
                        </span>
                        <span>{link.name}</span>
                      </Link>
                    )}

                    {link.subLinks && openSubMenu[link.name] && (
                      <ul className="ml-4 mt-1 flex flex-col gap-1">
                        {link.subLinks.map((subLink) => {
                          const isSubActive = pathname === subLink.href
                          return (
                            <li key={subLink.name}>
                              <Link
                                href={subLink.href}
                                className={clsx(
                                  "flex items-center gap-3 text-xs px-4 py-2 rounded-lg font-medium transition group", // Reduced font size for sub-tabs
                                  isSubActive ? "bg-[#eaf6fa] text-[#007fa3]" : "text-gray-700 hover:bg-[#eaf6fa]",
                                )}
                              >
                                <span
                                  className={clsx(
                                    "text-[#004f64] group-hover:text-[#007fa3]",
                                    isSubActive && "text-[#007fa3]",
                                  )}
                                >
                                  {subLink.icon}
                                </span>
                                <span>{subLink.name}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="px-3 py-4 border-t border-gray-100">
        <ul className="flex flex-col gap-1">
          {bottomNavLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 text-sm rounded-lg font-medium transition group",
                    isActive ? "bg-[#eaf6fa] text-[#007fa3]" : "text-gray-700 hover:bg-[#eaf6fa]",
                  )}
                >
                  <span className={clsx("text-[#004f64] group-hover:text-[#007fa3]")}>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

export default DashboardSidebar
