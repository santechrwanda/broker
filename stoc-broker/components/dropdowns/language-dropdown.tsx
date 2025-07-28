import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const LanguageDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState("English");

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (lang: string) => {
        setSelectedLang(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".language-dropdown")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-black"
            >
                {selectedLang} <FiChevronDown />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-500/30 rounded-md overflow-hidden shadow-lg z-50 language-dropdown">
                    {["English", "French", "Kinyarwanda", "Swahili"].map(
                        (lang) => (
                            <button
                                key={lang}
                                onClick={() => handleSelect(lang)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {lang}
                            </button>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;
