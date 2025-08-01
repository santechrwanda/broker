"use client";

import { FiCheck, FiChevronDown } from "react-icons/fi";
import { CustomDropdown } from "./dropdown";
import { useState } from "react";
import { cn } from "@/utility/utility";

interface SelectDropdownOption {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label?: string;
  options: SelectDropdownOption[];
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  labelClassName,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const selectOption = (option: SelectDropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const trigger = (
    <div className={`grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2.5 pr-2 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 sm:text-sm ${
      disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'text-gray-900'
    }`}>
      <span className="col-start-1 row-start-1 flex items-center pr-6">
        <span className={`block truncate text-gray-400 ${selectedOption ? "text-gray-900" : "text-gray-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </span>
      <FiChevronDown
        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        aria-hidden="true"
      />
    </div>
  );

  return (
    <div className={className}>
      {label && (
        <label className={cn("block text-sm font-medium text-gray-900 mb-2", labelClassName)}>
          {label}
        </label>
      )}

      <CustomDropdown
        trigger={trigger}
        isOpen={isOpen}
        onToggle={setIsOpen}
        disabled={disabled}
        dropdownClassName="w-full max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm"
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => selectOption(option)}
            className={`relative cursor-default py-2 pr-9 pl-3 select-none hover:bg-[#1e8caa] hover:text-white group ${
              option.value === value ? 'bg-indigo-50 text-[#004f64] font-semibold' : 'text-gray-900'
            }`}
          >
            <span className="block truncate">{option.label}</span>
            {option.value === value && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#1e8caa]">
                <FiCheck className="size-5 group-hover:text-white" />
              </span>
            )}
          </div>
        ))}
      </CustomDropdown>
    </div>
  );
};