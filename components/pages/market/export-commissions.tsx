import { BsFiletypeCsv } from "react-icons/bs";
import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";

const ExportCommissions = () => {
  return (
    <div className="flex bg-white p-6 shadow rounded-md flex-col md:flex-row md:items-center md:justify-between my-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">EXPORT COMMISSIONS INTO</h1>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-x-4">
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-red-700 hover:bg-gray-50 w-full md:w-auto justify-center">
              <FaRegFilePdf />
              PDF
            </button>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center">
              <BsFiletypeCsv />
              CSV
            </button>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-green-700 hover:bg-gray-50 w-full md:w-auto justify-center">
              <FaRegFileExcel />
              EXCEL
            </button>
          </div>
        </div>
      </div>
  )
}

export default ExportCommissions