import SettingSidebar from '../_components/settings-sidebar'
import ChangePasswordForm from './_components/change-password-form'
import DashboardOverviewHeader from '../../_components/dashboard-overview-header'

const ChangePasswordPage = () => {
  return (
    <div>
      <DashboardOverviewHeader title="Password & Security" description="Update your password and keep your dashboard account secure." />
      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[292px_minmax(0,1fr)]">
        <div>
          <SettingSidebar />
        </div>
        <div className="min-w-0">
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  )
}

export default ChangePasswordPage
