export const businessTabs = [
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

export type BusinessTab = (typeof businessTabs)[number];

export const businessConcepts = [
  { rank: "#1 Match", score: 91, title: "Fast Casual Taproom & Kitchen", category: "Food & Beverage" },
  { rank: "#2 Match", score: 84, title: "Boutique Pilates Studio", category: "Wellness" },
  { rank: "#3 Match", score: 78, title: "Artisan Retail Market", category: "Specialty Retail" },
];
