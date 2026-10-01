import DashboardOverviewHeader from "../_components/dashboard-overview-header";
import TransactionsContainer from "./_components/transactions-container";

const TransactionsPage = () => (
  <div>
    <DashboardOverviewHeader title="Transactions" description="Review revenue transactions and payment activity." />
    <TransactionsContainer />
  </div>
);

export default TransactionsPage;
