// app/reports/page.tsx
import ReportGenerator from "@/components/pages/reports/reports-generator";
import ReportList from "@/components/pages/reports/reports-list";
import React from "react";

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ReportGenerator />
      <ReportList />
    </div>
  );
};

export default ReportsPage;
