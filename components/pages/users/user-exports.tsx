"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FiFilter } from "react-icons/fi";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeCsv } from "react-icons/bs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import UserPDFDocument from "@/components/pages/users/users-pdf-export";
import { UserShape } from "./users-list";

interface UserExportsProps {
  setShowFilters: Dispatch<SetStateAction<boolean>>
  filteredUsers: UserShape[]
}
const UserExports: React.FC<UserExportsProps> = ({ setShowFilters, filteredUsers }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define columns
    worksheet.columns = [
      { header: "NAME", key: "name", width: 20 },
      { header: "EMAIL", key: "email", width: 30 },
      { header: "PHONE", key: "phone", width: 20 },
      { header: "JOINING DATE", key: "date", width: 20 },
      { header: "STATUS", key: "status", width: 15 },
    ];

    // Bold the header row
    worksheet.getRow(1).font = { bold: true };

    // Add data rows with conditional formatting
    filteredUsers.forEach((user) => {
      const row = worksheet.addRow({
        name: user.name,
        email: user.email,
        phone: user.phone,
        date: user.date,
        status: user.status,
      });

      const statusCell = row.getCell("status");

      // Apply fill color based on status
      if (user.status.toLowerCase() === "active") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C6EFCE" }, // light green
        };
        statusCell.font = { color: { argb: "006100" }, bold: true }; // dark green
      } else if (user.status.toLowerCase() === "blocked") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC7CE" }, // light red
        };
        statusCell.font = { color: { argb: "9C0006" }, bold: true }; // dark red
      }
    });

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "users.xlsx");
  };

  const exportToCSV = () => {
    const headers = ["NAME", "EMAIL", "PHONE", "JOINING DATE", "STATUS"];
    const rows = filteredUsers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.date,
      c.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    const blob = await pdf(
      <UserPDFDocument users={filteredUsers} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <h2></h2>
      <div className="flex items-center gap-2">
        <button
          className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-red-700 hover:bg-gray-50 w-full md:w-auto justify-center"
          onClick={exportToPDF}
        >
          <FaRegFilePdf />
          PDF
        </button>
        <button
          className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center"
          onClick={exportToCSV}
        >
          <BsFiletypeCsv />
          CSV
        </button>
        <button
          className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center"
          onClick={exportToExcel}
        >
          <FaRegFileExcel />
          EXCEL
        </button>
        <button
          className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-full md:w-auto justify-center"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <FiFilter />
          Filters
        </button>
      </div>
    </div>
  );
};

export default UserExports;
