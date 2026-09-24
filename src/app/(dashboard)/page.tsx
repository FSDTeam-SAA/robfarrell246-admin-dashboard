import React from 'react'
import { DashboardOverview } from './_components/dashboard-overview'
import DashboardOverviewHeader from './_components/dashboard-overview-header'
import TotalRevenue from './_components/total-revenue'
import RecentRequests from './_components/recent-requests'
import ExpiringDocuments from './_components/expiring-documents'

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardOverviewHeader title='Dashboard Overview' description="Welcome back! Here's what's happening with VELARI today."/>
      <DashboardOverview/>
      <TotalRevenue/>
      <div className="mx-4 grid gap-4 py-4 sm:mx-6 sm:grid-cols-[1.4fr_1fr] sm:py-5">
        <RecentRequests />
        <ExpiringDocuments />
      </div>
    </div>
  )
}

export default DashboardOverviewPage
