import React, { useState, useEffect } from "react";

interface PaginationProps {
  datas: any[];
  setPaginatedData: (data: any[]) => void;
}

const GeneralPagination: React.FC<PaginationProps> = ({
  datas,
  setPaginatedData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(datas.length / pageSize);

  // Reset to page 1 if data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [datas]);

  useEffect(() => {
    const paginatedData = datas.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    setPaginatedData(paginatedData);
  }, [currentPage, datas, setPaginatedData]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex items-center justify-end p-6 gap-6 border-t border-gray-200">
      <button
        className={`text-gray-400 hover:text-gray-600 ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`w-8 h-8 rounded text-sm ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        className={`text-gray-600 hover:text-gray-800 ${
          currentPage === totalPages || totalPages === 0
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next
      </button>
    </div>
  );
};

export default GeneralPagination;
