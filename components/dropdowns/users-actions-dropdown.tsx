"use client";
import React from "react";
import { CustomDropdown, DropdownItem } from "../ui/dropdown";
import { HiDotsHorizontal, HiOutlineEye } from "react-icons/hi";
import { LuPencil } from "react-icons/lu";
import { FaRegCircleStop } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

export interface UserAction {
  action_name: string;
  icon: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  className?: string;
}

const defaultActions: UserAction[] = [
  {
    action_name: "Edit",
    icon: <LuPencil className="size-4" />,
    onClick: () => alert("Edit clicked"),
  },
  {
    action_name: "View",
    icon: <HiOutlineEye className="size-4" />,
  },
  {
    action_name: "Block",
    icon: <FaRegCircleStop className="size-4" />,
    onClick: () => alert("Block clicked"),
    className: "text-[#c39305]",
  },
  {
    action_name: "Delete",
    icon: <RiDeleteBin5Line className="size-4" />,
    onClick: () => alert("Delete clicked"),
    destructive: true,
  },
];

interface UserActionsDropdownProps {
  actions?: UserAction[];
}

const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  actions = defaultActions,
}) => {
  return (
    <CustomDropdown
      trigger={
        <button className="inline-flex items-center rounded cursor-pointer bg-[#3091ac]/30 px-4 py-2 text-sm text-gray-800">
          <HiDotsHorizontal className="size-4" />
        </button>
      }
      dropdownClassName="min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
      position="bottom-right"
    >
      {actions.map((action, idx) => (
        <React.Fragment key={action.action_name}>
          {action.action_name === "Block" && <hr className="my-1 border-gray-200" />}
          <DropdownItem
            icon={action.icon}
            onClick={action.onClick}
            destructive={action.destructive}
            className={action.className}
          >
            {action.action_name}
          </DropdownItem>
        </React.Fragment>
      ))}
    </CustomDropdown>
  );
};

export default UserActionsDropdown;
