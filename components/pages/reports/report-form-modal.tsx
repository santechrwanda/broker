"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiX } from "react-icons/fi";
import DatepickerInput from "@/components/ui/date-picker-input";
import { SelectDropdown } from "@/components/ui/select";

export default function ReportFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [broker, setBroker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const brokers = [
    "BK Capital",
    "CDH Investment Bank",
    "MBEA Brokerage",
    "Dyer & Blair",
    "Other",
  ];
  const [type, setType] = useState("market");

  const reportOptions = [
    { value: "market", label: "Market Overview" },
    { value: "transactions", label: "Transaction History" },
    { value: "broker-performance", label: "Broker Performance" },
  ];

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
      onComplete: () => setIsOpen(false),
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!broker || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    // TODO: Replace this with actual report generation logic
    console.log("Generating report for:", { broker, startDate, endDate });

    // Close modal after submission (optional)
    closeModal();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#1d89a7] text-white px-6 py-2 rounded hover:bg-[#004f64] cursor-pointer"
      >
        Generate Report
      </button>

      {/* Overlay & Modal */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex overflow-y-auto items-center justify-center bg-black/50"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute cursor-pointer right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={18} />
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Generate Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Range */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <DatepickerInput
                    selectedDate={startDate ? new Date(startDate) : null}
                    setSelectedDate={(date) =>
                      setStartDate(date ? date.toISOString().split("T")[0] : "")
                    }
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <DatepickerInput
                    selectedDate={endDate ? new Date(endDate) : null}
                    setSelectedDate={(date) =>
                      setEndDate(date ? date.toISOString().split("T")[0] : "")
                    }
                  />
                </div>
              </div>
              <SelectDropdown
                label="Report Type"
                options={reportOptions}
                value={type}
                onChange={(value) => setType(value)}
                className="w-full"
              />
              {/* Select Broker */}
              <div>
                <label
                  htmlFor="broker"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Broker
                </label>
                <select
                  id="broker"
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">-- Choose a Broker --</option>
                  {brokers.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              

              {/* Submit */}
              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="rounded-md bg-[#1d89a7] px-4 py-2 text-white hover:bg-[#004f64]"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
