"use client";
import React, { useState, useRef } from "react";
import { SelectDropdown } from "@/components/ui/select";
import { FiX, FiUser, FiCamera, FiPlus } from "react-icons/fi";
import Image from "next/image";

export default function AddContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setProfileImage(null);
    setProfilePreview(null);
  };

  const handleAddContact = () => {
    // You can now submit profileImage along with formData to backend
    console.log("Contact added:", formData, profileImage);
    setIsOpen(false);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center cursor-pointer gap-2 px-4 py-1.5 bg-[#1b7b95] text-white rounded-lg hover:bg-[#004f64]"
      >
        <FiPlus />
        Add User
      </button>
    );
  }

  const userRoles = [
    { label: "Admin", value: "admin" },
    { label: "Teller", value: "teller" },
    { label: "Accountant", value: "accountant" },
    { label: "Client", value: "client" },
    { label: "Manager", value: "manager" },
    { label: "Agent", value: "agent" },
    { label: "Company", value: "company" }
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-[#2093b3]/10 p-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-3">
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={profilePreview}
                            fill
                            alt="Profile Preview"
                            className="object-cover rounded-full"
                        />
                  </div>
                ) : (
                  <FiUser size={32} className="text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-picture"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="absolute cursor-pointer bottom-0 right-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                onClick={handleCameraClick}
                tabIndex={0}
              >
                <FiCamera size={12} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
              />
            </div>

            {/* Company Name Field */}
            <SelectDropdown
              label="Role"
              options={userRoles}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="select user role"
              className="w-full"
            />

            {/* Email ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
              />
            </div>

            {/* Phone and Lead Score Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone no"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="KG 33 Ave"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleAddContact}
            className="px-4 py-2 cursor-pointer bg-[#1b7b95] hover:bg-[#004f64] text-white rounded-md transition-colors font-medium"
          >
            Register user
          </button>
        </div>
      </div>
    </div>
  );
}
