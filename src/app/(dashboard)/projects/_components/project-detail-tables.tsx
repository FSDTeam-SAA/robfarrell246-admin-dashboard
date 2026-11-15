import { ProjectApiUnavailable } from "./project-api-unavailable";

export function ReportPanel() {
  return <ProjectApiUnavailable title="Report Preview" message="The backend does not expose a generated report or report-preview API linked to a property analysis." />;
}
