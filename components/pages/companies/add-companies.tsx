"use client"

import ExportCompaniesDropdown from "@/components/dropdowns/export-company-dropdown"
import Link from "next/link"
import React from "react"
import ExcelJS from "exceljs"
import { MdOutlineImportExport } from "react-icons/md"
import { type Company, useCreateCompanyMutation } from "@/hooks/use-company"
import { toast } from "react-toastify"

interface AddCompaniesProps {
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
}

const AddCompaniesHeader = ({ companies, setCompanies }: AddCompaniesProps) => {
  const [createCompany] = useCreateCompanyMutation()
  const [importError, setImportError] = React.useState("")
  const [isImporting, setIsImporting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // CSV parser utility
  function parseCSV(text: string) {
    const lines = text.trim().split(/\r?\n/)
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.replace(/"/g, "").trim())
      const obj: any = {}
      headers.forEach((h, i) => {
        obj[h.toLowerCase().replace(/ /g, "")] = values[i]
      })
      return obj
    })
  }

  // Map imported data to Company interface
  const mapImportedDataToCompany = (data: any): Partial<Company> => {
    return {
      companyName: data.companyname || data.name || data.company || "",
      companyAddress: data.companyaddress || data.address || data.location || "",
      companyTelephone: data.companytelephone || data.telephone || data.phone || "",
      companyCategory: data.companycategory || data.category || data.industry || "technology",
      numberOfShares: Number.parseInt(data.numberofshares || data.shares || "0") || 0,
      ownerFullName: data.ownerfullname || data.owner || data.ownername || "",
      ownerEmail: data.owneremail || data.email || "",
      ownerPhone: data.ownerphone || data.ownertel || "",
      ownerAddress: data.owneraddress || data.owneraddr || "",
      status: "pending" as const,
    }
  }

  // Import handler with backend integration
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("")
    setIsImporting(true)
    const file = e.target.files?.[0]

    if (!file) {
      setIsImporting(false)
      return
    }

    try {
      let importedData = []

      if (file.name.endsWith(".xlsx")) {
        const workbook = new ExcelJS.Workbook()
        const arrayBuffer = await file.arrayBuffer()
        await workbook.xlsx.load(arrayBuffer)
        const worksheet = workbook.worksheets[0]
        const rows = worksheet.getSheetValues()

        if (!Array.isArray(rows[1])) {
          setImportError("Invalid Excel format: missing header row.")
          setIsImporting(false)
          return
        }

        const headers = (rows[1] as any[]).slice(1).map((h) =>
          String(h || "")
            .toLowerCase()
            .replace(/ /g, ""),
        )

        importedData = rows
          .slice(2)
          .filter((row) => Array.isArray(row))
          .map((row: any) => {
            const obj: any = {}
            row.slice(1).forEach((cell: any, i: number) => {
              obj[headers[i]] = cell
            })
            return obj
          })
      } else if (file.name.endsWith(".csv")) {
        const text = await file.text()
        importedData = parseCSV(text)
      } else {
        setImportError("Unsupported file type. Only .xlsx and .csv are allowed.")
        setIsImporting(false)
        return
      }

      // Process and create companies
      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      for (const data of importedData) {
        try {
          const companyData = mapImportedDataToCompany(data)

          // Validate required fields
          if (!companyData.companyName || !companyData.ownerFullName || !companyData.ownerEmail) {
            errorCount++
            errors.push(`Row ${importedData.indexOf(data) + 2}: Missing required fields`)
            continue
          }

          // Create company via API
          await createCompany(companyData as Omit<Company, "id" | "createdAt" | "updatedAt">).unwrap()
          successCount++
        } catch (error: any) {
          errorCount++
          errors.push(`Row ${importedData.indexOf(data) + 2}: ${error.message || "Failed to create company"}`)
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} companies!`)
      }

      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} companies. Check console for details.`)
        console.error("Import errors:", errors)
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      setImportError("Failed to import file. Please check the format.")
      toast.error("Import failed: " + (error.message || "Unknown error"))
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex items-center justify-between rounded p-6 border border-gray-200 bg-white">
      <Link
        href="/dashboard/companies/add-new"
        className="bg-[#127894] cursor-pointer text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-[#004f64] transition-colors"
      >
        <span className="text-lg">+</span>
        Add Company
      </Link>

      <div className="flex flex-col gap-1 items-end">
        <div className="flex items-start gap-x-6">
          {/* Export companies */}
          <ExportCompaniesDropdown companies={companies} />

          <div className="flex flex-col items-end">
            <button
              className={`cursor-pointer flex gap-x-2 items-center text-white px-4 py-2 rounded-sm transition-colors ${
                isImporting ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
              }`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              type="button"
            >
              <MdOutlineImportExport size={18} />
              {isImporting ? "Importing..." : "Import"}
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
          disabled={isImporting}
        />
      </div>
    </div>
  )
}

export default AddCompaniesHeader
