import DashboardOverviewHeader from "../_components/dashboard-overview-header";
import CreditContainer from "./_components/credit-container";

const CreditPage = () => (
  <div>
    <DashboardOverviewHeader title="Credit" description="Review credit balances and credit allowance activity." />
    <CreditContainer />
  </div>
);

export default CreditPage;
