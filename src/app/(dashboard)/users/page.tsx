import React from 'react'
import UsersContainer from './_components/users-container'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'

const UserPage = () => {
  return (
    <div>
         <DashboardOverviewHeader
        title="User Management"
        description="Manage brokers, tenants, enterprise subscriptions, credit allowances, and permissions."
      />
      <UsersContainer/>
    </div>
  )
}

export default UserPage
