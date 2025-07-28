import React from "react";
import { CustomDropdown, DropdownItem } from "../ui/dropdown";
import { FaAngleDown, FaRegFileExcel } from "react-icons/fa";
import { BsFilePdf, BsFiletypeCsv } from "react-icons/bs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import CompanyPDFDocument from "../pages/companies/export-companies-pdf";
import { Company } from "@/hooks/use-company";

interface DropdownCompanyProps {
    companies: Company[];
}

const ExportCompaniesDropdown = ({ companies }: DropdownCompanyProps) => {
  // Excel Export
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Companies");
    worksheet.columns = [
      { header: "NAME", key: "name", width: 25 },
      { header: "OWNER", key: "owner", width: 20 },
      { header: "INDUSTRY", key: "industry", width: 25 },
      { header: "LOCATION", key: "location", width: 20 },
      { header: "RATING", key: "rating", width: 10 },
    ];
    worksheet.getRow(1).font = { bold: true };
    companies.forEach((company) => {
      worksheet.addRow({
        name: company.companyName,
        owner: company.ownerFullName,
        industry: company.companyCategory,
        location: company.companyAddress,
        rating: company.numberOfShares,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "companies.xlsx");
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ["NAME", "OWNER", "INDUSTRY", "LOCATION", "RATING"];
    const rows = companies.map((c) => [
      c.companyName,
      c.ownerFullName,
      c.companyCategory,
      c.companyAddress,
      c.numberOfShares,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "companies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export
  const exportToPDF = async () => {
    const blob = await pdf(<CompanyPDFDocument companies={companies} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "companies.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CustomDropdown
      trigger={
        <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-red-600">
        Export
        <FaAngleDown className="w-5 h-5" />
      </button>
      }
      dropdownClassName="min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-1"
      position="bottom-right"
    >
      <DropdownItem
        icon={<BsFilePdf className="size-4 text-red-500" />}
        onClick={exportToPDF}
      >
        PDF
      </DropdownItem>
      <DropdownItem
        icon={<FaRegFileExcel className="text-green-600" />}
        onClick={exportToExcel}
      >
        Excel
      </DropdownItem>
      <DropdownItem
        icon={<BsFiletypeCsv className="text-blue-600" />}
        onClick={exportToCSV}
      >
        CSV
      </DropdownItem>
    </CustomDropdown>
  );
};

export default ExportCompaniesDropdown;
