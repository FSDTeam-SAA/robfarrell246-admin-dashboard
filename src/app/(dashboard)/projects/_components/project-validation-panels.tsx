import { ProjectApiUnavailable } from "./project-api-unavailable";

export function FitScorePanel() {
  return <ProjectApiUnavailable title="Fit Score" message="The backend does not expose an Admin-accessible, property-linked fit-score result API." />;
}

export function VersionHistoryPanel() {
  return <ProjectApiUnavailable title="Version History" message="The backend does not expose analysis-version history linked to a property analysis." />;
}
