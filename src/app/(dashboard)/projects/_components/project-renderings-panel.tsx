import { ProjectApiUnavailable } from "./project-api-unavailable";

export default function ProjectRenderingsPanel() {
  return <ProjectApiUnavailable title="Photorealistic AI Tenant Visualizations" message="The backend has no Admin-accessible property-linked AI rendering result endpoint, so no rendering can be loaded for this project." />;
}
