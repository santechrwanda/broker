"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";

const links = [
    { label: "Home", target: "home" },
    { label: "Services", target: "services" },
    { label: "Market", target: "market" },
    { label: "About us", target: "about-us" },
    { label: "Contact us", target: "contact-us" },
];

const NavigationLinks = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();

        if (pathname !== "/") {
            // Navigate to home with hash (e.g., /#services)
            router.push(`/#${targetId}`);
        } else {
            // Already on home, scroll smoothly to target
            const el = document.getElementById(targetId);
            if (el) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: el, offsetY: 100 },
                    ease: "power2.inOut",
                });
            }
        }
    };

    return (
        <ul className="flex gap-10">
            {links.map(({ label, target }) => (
                <li key={target}>
                    <a
                        href={`/#${target}`}
                        onClick={(e) => handleClick(e, target)}
                        className="text-gray-800 text-lg hover:text-[#004f64] transition"
                    >
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default NavigationLinks;
