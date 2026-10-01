import DashboardOverviewHeader from "../_components/dashboard-overview-header";
import BusinessContainer from "./_components/business-container";

const BusinessPage = () => (
  <div>
    <DashboardOverviewHeader title="Business" description="Manage business accounts and subscription details." />
    <BusinessContainer />
  </div>
);

export default BusinessPage;
