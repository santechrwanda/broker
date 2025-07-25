"use client";
import React, { useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { UserShape } from "./users-list";
import { useImportUsersMutation } from "@/hooks/use-users";
import { ReduxErrorProps } from "@/utility/types";


const ImportingXlsxAndCsv = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importUsers, { isLoading, isSuccess, isError, error } ] = useImportUsersMutation();

  // Add imported users to the list
  const handleImportedUsers = async(users: UserShape[]) => {
    
    await importUsers({ users });
  };

  useEffect(()=> {
    if(isSuccess)
        toast.success("Users imported successfully!");
    else if(isError)
        toast.error((error as ReduxErrorProps)?.data?.message || "Failed to import users");
  })

  // CSV parser utility
  function parseCSV(text: string) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map((h) => h.replace(/\"/g, "").trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.replace(/\"/g, "").trim());
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h.toLowerCase().replace(/ /g, "")] = values[i];
      });
      return obj;
    });
  }

  // Import handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      if (file.name.endsWith(".xlsx")) {
        const workbook = new ExcelJS.Workbook();
        const arrayBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        const rows = worksheet.getSheetValues();
        
        if (!Array.isArray(rows[1])) {
          toast.error("Invalid Excel format: missing header row.");
          return;
        }

        const headers = (rows[1] as any[]).slice(1).map((h) =>
          String(h || "")
            .toLowerCase()
            .replace(/ /g, "")
        );

        const users = rows
          .slice(2)
          .filter((row) => Array.isArray(row))
          .map((row: any) => {
            const obj: any = {};
            row.slice(1).forEach((cell: any, i: number) => {
              obj[headers[i]] = cell;
            });
            return obj;
          });

        handleImportedUsers(users);
      } else if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const users = parseCSV(text);
        handleImportedUsers(users);
      } else {
        toast.error("Unsupported file type. Only .xlsx and .csv are allowed.");
      }
    } catch {
      toast.error("Failed to import file. Please check the format.");
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => fileInputRef.current?.click()}
        type="button"
        disabled={isLoading}
      >
        {isLoading ? (
          "Importing..."
        ) : (
          <>
            <FiUpload className="text-gray-500" />
            Import
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.csv"
        style={{ display: "none" }}
        onChange={handleImport}
        disabled={isLoading}
      />
    </div>
  );
};

export default ImportingXlsxAndCsv;