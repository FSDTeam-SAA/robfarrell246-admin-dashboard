"use client";

import { useState } from "react";
import { FitScorePanel as AssumptionsPanel } from "./project-detail-analysis";
import ProjectBudgetPanel from "./project-budget-panel";
import { CompetitionPanel, MarketPanel } from "./project-market-panels";
import { type ProjectTab } from "./project-detail-data";
import ProjectDetailHeader from "./project-detail-header";
import { OverviewPanel } from "./project-detail-overview";
import ProjectRenderingsPanel from "./project-renderings-panel";
import { ReportPanel } from "./project-detail-tables";
import { FitScorePanel, VersionHistoryPanel } from "./project-validation-panels";

export default function ProjectDetail({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ProjectTab>("Overview");
  return <section className="min-h-screen bg-[#F5F8FB] pb-8"><ProjectDetailHeader tab={tab} onTabChange={setTab} onBack={onBack} />{tab === "Overview" && <OverviewPanel />}{tab === "AI Renderings" && <ProjectRenderingsPanel />}{tab === "Market & Demographics" && <MarketPanel />}{tab === "Competition & POIs" && <CompetitionPanel />}{tab === "Budget & Investment" && <ProjectBudgetPanel />}{tab === "Assumptions" && <AssumptionsPanel />}{tab === "Fit Score" && <FitScorePanel />}{tab === "Report Preview" && <ReportPanel />}{tab === "Version History" && <VersionHistoryPanel />}</section>;
}
