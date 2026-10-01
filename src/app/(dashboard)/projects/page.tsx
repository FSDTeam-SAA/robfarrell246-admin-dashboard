import DashboardOverviewHeader from "../_components/dashboard-overview-header";
import ProjectsContainer from "./_components/projects-container";

const ProjectsPage = () => (
  <div>
    <DashboardOverviewHeader title="Projects" description="Manage projects, plans, and project activity." />
    <ProjectsContainer />
  </div>
);

export default ProjectsPage;
