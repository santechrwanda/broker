"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiX } from "react-icons/fi";
import { useDeleteUserMutation } from "@/hooks/use-users";
import { toast } from "react-toastify";

interface ConfirmProps { 
    userName: string,
    userId: string
    isOpen: boolean,
    setIsOpen?: (bol: boolean) => void
}
export default function ConfirmDeletionModal({ userName, setIsOpen, userId, isOpen }: ConfirmProps) {
  const [confirmName, setConfirmName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [deleteUser, { isLoading, error, isSuccess, reset }] = useDeleteUserMutation();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) toast.error((error as any)?.data?.message || "Failed to delete user.");
    if (isSuccess) toast.success("User deleted successfully");
    if(error || isSuccess) reset();
}, [error, isSuccess, reset]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setIsOpen && setIsOpen(false),
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
    });
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmName.trim() !== userName) {
      toast.error("Name does not match. Please enter your name correctly to confirm.");
      return;
    }
      await deleteUser({ id: userId }).unwrap();
      closeModal();
   
  };

  return (
    <>
      {/* Overlay & Modal */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-md overflow-hidden rounded-md bg-white p-6 shadow-lg"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={18} />
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-[#004f64] mb-4">
              Confirm User Deletion
            </h2>
            <div className="text-sm text-gray-600 mb-4">
              This action is permanent and cannot be undone. To confirm <br /> deletion, please type <span className="text-black font-bold">{userName}</span> below.
            </div>

            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter your name to confirm"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring focus:ring-red-200"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Confirm Deletion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}