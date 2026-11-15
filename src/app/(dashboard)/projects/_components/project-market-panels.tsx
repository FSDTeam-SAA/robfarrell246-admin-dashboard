import { ProjectApiUnavailable } from "./project-api-unavailable";

export function MarketPanel() {
  return <ProjectApiUnavailable title="Trade Area Demographics & Consumer Demand" message="The backend does not provide property-linked market or demographic data for the Admin dashboard." />;
}

export function CompetitionPanel() {
  return <ProjectApiUnavailable title="Trade Area Competition & Synergies" message="The backend does not provide property-linked competition, POI, or map data for the Admin dashboard." />;
}
