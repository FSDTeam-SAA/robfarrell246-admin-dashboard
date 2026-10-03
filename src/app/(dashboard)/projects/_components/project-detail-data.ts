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

export const concepts = [
  { rank: "#1 Match", score: 91, title: "Fast Casual Taproom & Kitchen", category: "Food & Beverage" },
  { rank: "#2 Match", score: 84, title: "Fast Casual Taproom & Kitchen", category: "Food & Beverage" },
  { rank: "#3 Match", score: 78, title: "Fast Casual Taproom & Kitchen", category: "Food & Beverage" },
];

export const metrics = [
  { label: "Total Population", value: "14,280", note: "+2.8% Annual", color: "text-[#0AA656]" },
  { label: "Median Household Income", value: "$118,500", note: "Top 8% in Metropolitan Area", color: "text-[#2861E7]" },
  { label: "Daytime Population", value: "22,400", note: "Corporate Employees + Commuters", color: "text-[#151D30]" },
  { label: "Annual Retail Expenditure", value: "$48.5M / yr", note: "Unfulfilled Outflow Demand", color: "text-[#0AA656]" },
];
