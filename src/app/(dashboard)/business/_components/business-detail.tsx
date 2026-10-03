"use client";

import { useState } from "react";
import { BusinessAssumptionsPanel } from "./business-detail-analysis";
import BusinessBudgetPanel from "./business-budget-panel";
import type { BusinessTab } from "./business-detail-data";
import BusinessDetailHeader from "./business-detail-header";
import { BusinessOverviewPanel } from "./business-detail-overview";
import { BusinessCompetitionPanel, BusinessMarketPanel } from "./business-market-panels";
import BusinessRenderingsPanel from "./business-renderings-panel";
import { BusinessReportPanel } from "./business-detail-tables";
import { BusinessFitScorePanel, BusinessVersionHistoryPanel } from "./business-validation-panels";

type BusinessDetailProps = { businessName: string; businessType: string; onBack: () => void };

export default function BusinessDetail({ businessName, businessType, onBack }: BusinessDetailProps) {
  const [tab, setTab] = useState<BusinessTab>("Overview");

  return <section className="min-h-screen bg-[#F5F8FB] pb-8">
    <BusinessDetailHeader businessName={businessName} businessType={businessType} tab={tab} onTabChange={setTab} onBack={onBack} />
    {tab === "Overview" && <BusinessOverviewPanel />}
    {tab === "AI Renderings" && <BusinessRenderingsPanel />}
    {tab === "Market & Demographics" && <BusinessMarketPanel />}
    {tab === "Competition & POIs" && <BusinessCompetitionPanel />}
    {tab === "Budget & Investment" && <BusinessBudgetPanel />}
    {tab === "Assumptions" && <BusinessAssumptionsPanel />}
    {tab === "Fit Score" && <BusinessFitScorePanel />}
    {tab === "Report Preview" && <BusinessReportPanel />}
    {tab === "Version History" && <BusinessVersionHistoryPanel />}
  </section>;
}
