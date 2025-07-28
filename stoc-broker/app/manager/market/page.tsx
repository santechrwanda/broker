import CommisionTable from "@/components/pages/market/commission-table";
import ExportCommissions from "@/components/pages/market/export-commissions";
import SecuritySummary from "@/components/pages/market/security-summar";
import SecuritiesTable from "@/components/pages/market/security-table";

const SecuritiesPage: React.FC = () => {
  return (
    <div>
      <SecuritySummary />
      <CommisionTable />
      <ExportCommissions />
      <SecuritiesTable />
    </div>
  );
};

export default SecuritiesPage;
