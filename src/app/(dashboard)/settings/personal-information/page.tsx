import SettingSidebar from '../_components/settings-sidebar'
import PersonalInformationForm from './_components/personal-information-form'
import DashboardOverviewHeader from '../../_components/dashboard-overview-header'

const PersonalInfoPage = () => {
  return (
    <div>
      <DashboardOverviewHeader title="Personal Information" description="Manage your profile, contact details, and public information." />
      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[292px_minmax(0,1fr)]">
        <div>
          <SettingSidebar />
        </div>
        <div className="min-w-0">
          <PersonalInformationForm />
        </div>
      </main>
    </div>
  )
}

export default PersonalInfoPage
