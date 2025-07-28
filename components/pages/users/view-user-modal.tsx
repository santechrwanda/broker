"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiUser, FiX } from "react-icons/fi";
import { UserShape } from "./users-list";
import Image from "next/image";

interface ConfirmProps { 
    user: UserShape | undefined,
    isOpen?: boolean,
    setIsOpen?: (bol: boolean) => void
}
export default function ViewUserModal({ user, setIsOpen, isOpen }: ConfirmProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
            className="relative w-full max-w-lg overflow-hidden rounded-md bg-white p-6 shadow-lg"
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
              View user details
            </h2>
            <div className="text-sm text-gray-600 flex w-full justify-center mb-2">
              {user?.profile 
                ?<Image 
                alt={`profile ${user?.name}`}
                width={100}
                height={ 100 }
                src={user?.profile}
                className="object-cover w-[100px] h-[100px] shadow rounded-full "
              />
              : <FiUser size={100} className="bg-gray-100 text-gray-500 rounded-full" />
            }
            </div>
            <div className="flex flex-col items-center mb-5">
                <p className="text-gray-600">{user?.name}</p>
                <p className="mt-1 text-gray-700 text-base">{user?.email}</p>
            </div>

            <div className="flex justify-between">
                <p>Role</p>
                <p className="text-gray-900">{user?.role}</p>
            </div>
            <div className="flex justify-between mt-2">
                <p>Status</p>
                <p className="text-gray-900">{user?.status}</p>
            </div>

            {user?.address &&
                <div className="flex justify-between mt-2">
                <p>Address</p>
                <p className="text-gray-900">{user?.address}</p>
            </div>}
            {user?.phone &&
                <div className="flex justify-between mt-2">
                <p>Phone Number</p>
                <p className="text-gray-900">{user?.phone}</p>
            </div>}
            {user?.status !== "agent" &&
            <div className="flex justify-between mt-2">
                <p>Salary</p>
                <p className="text-gray-900">{user?.salary || 0.0}</p>
            </div>
            }
            {user?.status === "agent" &&
            <div className="flex justify-between mt-2">
                <p>Commission(%) per share</p>
                <p className="text-gray-900">{user?.commission || 0.0}</p>
            </div>
            }

            <div className="flex justify-end gap-2 pt-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border cursor-pointer border-gray-300 px-4 py-1 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            
          </div>
        </div>
      )}
    </>
  );
}