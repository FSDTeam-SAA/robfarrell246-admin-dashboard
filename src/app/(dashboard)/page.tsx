import React from "react";
import { DashboardOverview } from "./_components/dashboard-overview";
import DashboardOverviewHeader from "./_components/dashboard-overview-header";
import RecentAnalyses from "./_components/recent-analyses";
import RecentUser from "./_components/recent-user";
import ActiveUser from "./_components/active-user";
import RevenueAndProfit from "./_components/revenue-and-profit";

const DashboardOverviewPage = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFE]">
      <DashboardOverviewHeader
        title="Overview"
        description="Welcome back! Here's what's happening with VELARI today."
      />
      <DashboardOverview />
      <main className="mx-auto grid w-full gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <RevenueAndProfit />
          <RecentAnalyses />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <RecentUser />
          <ActiveUser />
        </div>
      </main>
    </div>
  );
};

export default DashboardOverviewPage;
