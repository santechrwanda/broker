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
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportName, setReportName] = useState("");

  const brokersOptions = [
    {label: "BK Capital", value: "BK Capital"},
    {label: "Standard Investment Bank", value: "Standard Investment Bank"},
    {label: "Kestrel Capital", value: "Kestrel Capital"},
    {label: "Genghis Capital", value: "Genghis Capital"},
    {label: "Old Mutual Securities", value: "Old Mutual Securities"},
    {label: "NCBA Capital", value: "NCBA Capital"},
    {label: "AIB Capital", value: "AIB Capital"},
    {label: "CBA Capital", value: "CBA Capital"},
    {label: "Dyer & Blair Investment Bank", value: "Dyer & Blair Investment Bank"},
    {label: "African Alliance", value: "African Alliance"},
    {label: "ABC Capital", value: "ABC Capital"},
    {label: "Equity Investment Bank", value: "Equity Investment Bank"}
  ];
  const [type, setType] = useState("market");

  const reportOptions = [
    { value: "market", label: "Market Overview" },
    { value: "transactions", label: "Transaction History" },
    { value: "broker-performance", label: "Broker Performance" },
  ];

  const reportFormatOptions =  [
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" }
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
            <div>
                <label
                  htmlFor="broker"
                  className="block text-sm font-medium text-gray-700"
                >
                  Report Name
                </label>
                
                <input
                type="text"
                  value={reportName}
                  placeholder="Enter Report Name"
                  onChange={(e) => setReportName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring focus:ring-gray-200"
                />
              </div>
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
              <SelectDropdown
                label="Select Broker"
                options={brokersOptions}
                value={broker}
                onChange={(value) => setBroker(value)}
                className="w-full"
              />

              {/* Select Broker */}
              <SelectDropdown
                label="Report Format"
                options={reportFormatOptions}
                value={reportFormat}
                onChange={(value) => setReportFormat(value)}
                className="w-full"
              />


              

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
