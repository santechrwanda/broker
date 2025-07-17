import React from 'react';
const navLinks = ["Services", "Market", "Partners", "About us"];

const NavigationLinks = () => {
  return (
    <ul className="flex gap-10">
        {navLinks.map((item) => (
        <li key={item}>
            <a
            href="#"
            className="text-gray-800 text-lg hover:text-[#004f64] transition"
            >
            {item}
            </a>
        </li>
        ))}
    </ul>
    
  )
}

export default NavigationLinks