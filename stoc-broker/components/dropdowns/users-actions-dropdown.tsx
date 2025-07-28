"use client";
import React, { useEffect, useState } from "react";
import { CustomDropdown, DropdownItem } from "../ui/dropdown";
import { HiDotsHorizontal, HiOutlineEye } from "react-icons/hi";
import { LuPencil } from "react-icons/lu";
import { FaRegCircleStop } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { UserShape } from "../pages/users/users-list";
import ConfirmDeletionModal from "../pages/users/confirm-delete-modal";
import AddAndEditUserModal from "../pages/users/add-and-edit-user-modal";
import { useChangeUserStatusMutation } from "@/hooks/use-users";
import { toast } from "react-toastify";
import { FiActivity } from "react-icons/fi";
import ViewUserModal from "../pages/users/view-user-modal";

export interface UserAction {
  action_name: string;
  icon: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  className?: string;
}

const default_action_names = ["Delete", "Edit", "View", "Block", "Activate"];

interface UserActionsDropdownProps {
  allowed_actions?: string[];
  user?: UserShape;
  setUser?: (user: UserShape | undefined) => void;
}

const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  setUser,
  allowed_actions = default_action_names,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [handleChangeStatus, { isLoading: statusLoading, error: statusError, reset: resetStatus }] = useChangeUserStatusMutation();
  const [isViewOpen, setIsViewOpen ] = useState(false);
  const oldStatus = user?.status || "";

  const handleBlockAndActivate = async()=> {
    const id= user?.id || "";
    const status = oldStatus === "active" ? "blocked" : "active";
    await handleChangeStatus({id, status}).unwrap();
    toast.success("Status changed successfully");
  }

  useEffect(() => {
      if (statusError) {
        toast.error(
          (statusError as any)?.data?.message || "Failed to change status."
        );
        resetStatus();
      }
      if (statusLoading) {
        toast.loading("Changing Status..");
      }
    }, [statusError, resetStatus, statusLoading]);

  const userActions: UserAction[] = [
    {
      action_name: "Edit",
      icon: <LuPencil className="size-4" />,
      onClick: () => setIsAddUpdateModalOpen(true),
    },
    {
      action_name: "View",
      icon: <HiOutlineEye className="size-4" />,
      onClick: ()=> setIsViewOpen(true)
    },
    {
      action_name: oldStatus === "active" ? "Block" : "Activate",
      icon: oldStatus === "active" ? <FaRegCircleStop className="size-4" /> : <FiActivity className="size-4" /> ,
      onClick: handleBlockAndActivate,
      className: oldStatus === "active" ? "text-[#c39305]" : "text-green-600",
    },
    {
      action_name: "Delete",
      icon: <RiDeleteBin5Line className="size-4" />,
      onClick: () => setIsDeleteOpen(true),
      destructive: true,
    },
  ];
  return (
    <>
      <CustomDropdown
        trigger={
          <button className="inline-flex items-center rounded cursor-pointer bg-[#3091ac]/30 px-4 py-2 text-sm text-gray-800">
            <HiDotsHorizontal className="size-4" />
          </button>
        }
        dropdownClassName="min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
        position="bottom-right"
      >
        {userActions
          .filter((action: UserAction) =>
            allowed_actions.includes(action.action_name)
          )
          .map((action) => (
            <React.Fragment key={action.action_name}>
              {action.action_name === "Block" && (
                <hr className="my-1 border-gray-200" />
              )}
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

      {/* ACTIONS MODALS */}
      <ConfirmDeletionModal
        userName={user?.name || ""}
        userId={user?.id || ""}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen || false}
      />

      {isAddUpdateModalOpen && (
        <AddAndEditUserModal
          user={user}
          setUser={setUser}
          isOpen={isAddUpdateModalOpen}
          setIsOpen={setIsAddUpdateModalOpen}
        />
      )}

      {isViewOpen &&
        <ViewUserModal 
            user={ user }
            isOpen={ isViewOpen }
            setIsOpen={setIsViewOpen}
        />
      }
    </>
  );
};

export default UserActionsDropdown;
