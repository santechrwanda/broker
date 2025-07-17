"use client";

import React from 'react';
import Link from "next/link";
import { gsap } from "gsap";

const links = [
  { label: "Services", target: "services" },
  { label: "Market", target: "market" },
  { label: "Partners", target: "partners" },
  { label: "About us", target: "about-us" },
];

const NavigationLinks = () => {
  const handleClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, offsetY: 100 }, // adjust offset as needed
        ease: "power2.inOut",
      });
    }
  };

  return (
    <ul className="flex gap-10">
      {links.map(({ label, target }) => (
        <li key={target}>
          <Link
            href={`/#${target}`}
            onClick={(e) => handleClick(e, target)}
            className="text-gray-800 text-lg hover:text-[#004f64] transition"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavigationLinks