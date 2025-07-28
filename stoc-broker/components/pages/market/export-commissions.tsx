"use client";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { pdf} from "@react-pdf/renderer";
import CommissionPDFDocument from "./export-commissions-pdf";

const commissionData = [
  {
    broker: "Alice Johnson",
    brokerRole: "Agent",
    customer: "Timothy Smith",
    company: "MTNR",
    status: "completed",
  },
  {
    broker: "Bob Williams",
    brokerRole: "Teller",
    customer: "Herbert Stokes",
    company: "BKGR",
    status: "inprogress",
  },
  {
    broker: "Carol Lee",
    brokerRole: "Agent",
    customer: "Charles Kubik",
    company: "EQTY",
    status: "cancelled",
  },
  {
    broker: "David Kim",
    brokerRole: "Teller",
    customer: "Glen Matney",
    company: "KCB",
    status: "completed",
  },
  {
    broker: "Eva Brown",
    brokerRole: "Agent",
    customer: "Carolyn Jones",
    company: "MTNR",
    status: "inprogress",
  },
  {
    broker: "Frank Green",
    brokerRole: "Teller",
    customer: "Kevin Dawson",
    company: "BKGR",
    status: "completed",
  },
];



const ExportCommissions = () => {
  // Excel Export
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Commissions");
    worksheet.columns = [
      { header: "BROKER NAME", key: "broker", width: 20 },
      { header: "BROKER ROLE", key: "brokerRole", width: 15 },
      { header: "CUSTOMER NAME", key: "customer", width: 20 },
      { header: "COMPANY", key: "company", width: 10 },
      { header: "STATUS", key: "status", width: 12 },
    ];
    worksheet.getRow(1).font = { bold: true };
    commissionData.forEach((item) => {
      worksheet.addRow({
        broker: item.broker,
        brokerRole: item.brokerRole,
        customer: item.customer,
        company: item.company,
        status: item.status,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "commissions.xlsx");
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ["BROKER NAME", "BROKER ROLE", "CUSTOMER NAME", "COMPANY", "STATUS"];
    const rows = commissionData.map((c) => [
      c.broker,
      c.brokerRole,
      c.customer,
      c.company,
      c.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "commissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export
  const exportToPDF = async () => {
    const blob = await pdf(<CommissionPDFDocument commissions={commissionData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "commissions.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between my-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">EXPORT COMMISSIONS INTO</h1>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-x-4">
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-red-700 hover:bg-gray-50 w-full md:w-auto justify-center" onClick={exportToPDF}>
              <FaRegFilePdf />
              PDF
            </button>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-blue-700 hover:bg-gray-50 w-full md:w-auto justify-center" onClick={exportToCSV}>
              <BsFiletypeCsv />
              CSV
            </button>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center" onClick={exportToExcel}>
              <FaRegFileExcel />
              EXCEL
            </button>
          </div>
        </div>
      </div>
  )
}

export default ExportCommissions