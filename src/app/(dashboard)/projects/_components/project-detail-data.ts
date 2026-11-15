export const projectTabs = [
  "Overview",
  "AI Renderings",
  "Market & Demographics",
  "Competition & POIs",
  "Budget & Investment",
  "Assumptions",
  "Fit Score",
  "Report Preview",
  "Version History",
] as const;

export type ProjectTab = (typeof projectTabs)[number];
