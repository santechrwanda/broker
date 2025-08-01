"use client";

import { cn } from '@/utility/utility';
import Link from 'next/link';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
  handleClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  linkClassName?: string;
  labelClassName?:string;
}

// Breadcrumb Component
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, linkClassName, labelClassName, className = "",  }) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <FiChevronRight size={16} className="text-gray-400" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={cn("text-gray-500 hover:text-gray-700 transition-colors cursor-pointer",linkClassName)}
              onClick={item.handleClick}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn("text-gray-900 font-medium", labelClassName)}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;