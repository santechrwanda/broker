import React from "react";
import ReportFormModal from "./report-form-modal";

const ReportGenerator: React.FC = () => {

  return (
    <div className="bg-white flex justify-between  shadow p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <ReportFormModal />
      </div>
    </div>
  );
};

export default ReportGenerator;
