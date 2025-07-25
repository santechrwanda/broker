import { Company } from "@/app/dashboard/companies/page";
import ExportCompaniesDropdown from "@/components/dropdowns/export-company-dropdown";
import Link from "next/link";
import React from "react";
import ExcelJS from "exceljs";
import { MdOutlineImportExport } from "react-icons/md";

interface AddCompaniesProps {
    companies: Company[];
    setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}
const AddCompaniesHeader = ({ companies, setCompanies }: AddCompaniesProps) => {
  const [importError, setImportError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // CSV parser utility
  function parseCSV(text: string) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.replace(/\"/g, "").trim());
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.replace(/\"/g, "").trim());
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h.toLowerCase().replace(/ /g, "")] = values[i];
      });
      return obj;
    });
  }

  // Import handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let importedCompanies = [];
      if (file.name.endsWith(".xlsx")) {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        const rows = worksheet.getSheetValues();
        if (!Array.isArray(rows[1])) {
          setImportError("Invalid Excel format: missing header row.");
          return;
        }
        const headers = (rows[1] as any[]).slice(1).map((h) => String(h || "").toLowerCase().replace(/ /g, ""));
        importedCompanies = rows.slice(2).filter(row => Array.isArray(row)).map((row: any) => {
          const obj: any = {};
          row.slice(1).forEach((cell: any, i: number) => {
            obj[headers[i]] = cell;
          });
          return obj;
        });
      } else if (file.name.endsWith(".csv")) {
        const text = await file.text();
        importedCompanies = parseCSV(text);
      } else {
        setImportError("Unsupported file type. Only .xlsx and .csv are allowed.");
        return;
      }
      // Optionally validate/normalize here
      // TODO: You may want to lift state up to parent to update companies globally
      setCompanies(prev => [...prev, ...importedCompanies]);
      alert(importedCompanies.length + " companies imported! (Demo: update state in parent to see in table)");
    } catch {
      setImportError("Failed to import file. Please check the format.");
    }
  };

  return (
    <div className="flex items-center justify-between rounded p-6 border border-gray-200 bg-white">
      <Link href="/dashboard/companies/add-new" className="bg-[#127894] cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#004f64]">
        <span className="text-lg">+</span>
        Add Company
      </Link>

      <div className="flex flex-col gap-1 items-end">
        <div className="flex items-start gap-x-6">
          {/* Export companies */}
          <ExportCompaniesDropdown companies={ companies }/>
         <div className="flex flex-col items-end">
          <button
            className="bg-teal-500 cursor-pointer flex gap-x-2 items-center text-white px-4 py-2 rounded-sm hover:bg-teal-600"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <MdOutlineImportExport size={18}/>
            Import
          </button>
          <p className="text-xs text-right text-gray-400 mt-1 ml-1">Allowed files: .xlsx, .csv</p>
          </div>
        </div>
        
        {importError && <span className="text-xs text-red-500 ml-1">{importError}</span>}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </div>
    </div>
  );
};

export default AddCompaniesHeader;
