"use client";

import { useState } from "react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { ProjectAssumptionsPanel } from "./project-detail-analysis";
import ProjectBudgetPanel from "./project-budget-panel";
import { CompetitionPanel, MarketPanel } from "./project-market-panels";
import { type ProjectTab } from "./project-detail-data";
import ProjectDetailHeader from "./project-detail-header";
import { OverviewPanel } from "./project-detail-overview";
import ProjectRenderingsPanel from "./project-renderings-panel";
import { ReportPanel } from "./project-detail-tables";
import { FitScorePanel, VersionHistoryPanel } from "./project-validation-panels";
import { usePropertyAnalysis } from "./projects-api";

export default function ProjectDetail({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const [tab, setTab] = useState<ProjectTab>("Overview");
  const projectQuery = usePropertyAnalysis(projectId);

  if (projectQuery.isLoading) return <section className="min-h-screen bg-[#F5F8FB] p-4 sm:p-6"><ApiLoadingSkeleton rows={6} /></section>;
  if (projectQuery.isError) return <section className="min-h-screen bg-[#F5F8FB] p-4 sm:p-6"><ApiErrorState message={projectQuery.error.message} onRetry={() => projectQuery.refetch()} /></section>;
  if (!projectQuery.data) return <section className="min-h-screen bg-[#F5F8FB] p-4 sm:p-6"><ApiEmptyState message="Project not found." /></section>;

  return <section className="min-h-screen bg-[#F5F8FB] pb-8"><ProjectDetailHeader project={projectQuery.data} tab={tab} onTabChange={setTab} onBack={onBack} />{tab === "Overview" && <OverviewPanel project={projectQuery.data} />}{tab === "AI Renderings" && <ProjectRenderingsPanel />}{tab === "Market & Demographics" && <MarketPanel />}{tab === "Competition & POIs" && <CompetitionPanel />}{tab === "Budget & Investment" && <ProjectBudgetPanel project={projectQuery.data} />}{tab === "Assumptions" && <ProjectAssumptionsPanel project={projectQuery.data} />}{tab === "Fit Score" && <FitScorePanel />}{tab === "Report Preview" && <ReportPanel />}{tab === "Version History" && <VersionHistoryPanel />}</section>;
}
