"use client";

import { Download, MapPin, RefreshCw, Share2 } from "lucide-react";
import type { ProjectTab } from "./project-detail-data";
import { projectTabs } from "./project-detail-data";
import type { DashboardProject } from "./projects-api";

export default function ProjectDetailHeader({ project, tab, onTabChange, onBack }: { project: DashboardProject; tab: ProjectTab; onTabChange: (tab: ProjectTab) => void; onBack: () => void }) {
  return (
    <>
      <header className="flex flex-col gap-4 border-b border-[#E2E8F0] bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button type="button" onClick={onBack} className="text-[10px] text-[#526174] hover:text-[#2861E7]">Projects <span className="mx-1">›</span> <span className="font-semibold text-[#2861E7]">{project.location}</span></button>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]"><strong className="text-[#27364B]">{project.address}{project.location !== "—" ? ` - ${project.location}` : ""}</strong><span className="text-[#2861E7]">Property Analysis</span><span className="inline-flex items-center gap-1 text-[#0AA656]"><i className="h-1.5 w-1.5 rounded-full bg-[#0AB85D]" />{project.status}</span></div>
          <h1 className="mt-2 flex items-center gap-1.5 text-[15px] font-bold text-[#151D30]"><MapPin className="h-3.5 w-3.5 text-[#2861E7]" />{project.address}</h1>
          <p className="mt-1 text-[10px] text-[#5D6B82]">{project.squareFootage} · Asking {project.baseRent} · {project.spaceType}</p>
        </div>
        <div className="flex shrink-0 gap-2"><Action label="Download Report" icon={<Download />} /><Action label="Share Brief" icon={<Share2 />} /><Action label="Re-run Analysis" icon={<RefreshCw />} primary /></div>
      </header>
      <section className="mx-3 mt-4 rounded-[5px] bg-[#E7EDF5] p-2.5 sm:mx-4 lg:mx-6">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px]"><span className="font-semibold text-[#27364B]">AI Evaluated Tenant Opportunities</span><span className="text-[#65758C]">No Admin-accessible project AI result is available.</span></div>
      </section>
      <nav aria-label="Project sections" className="mx-3 mt-3 flex overflow-x-auto border-b border-[#E2E8F0] bg-white sm:mx-4 lg:mx-6">{projectTabs.map((item) => <button type="button" key={item} onClick={() => onTabChange(item)} className={`h-[31px] shrink-0 px-3 text-[10px] transition ${tab === item ? "rounded-[3px] bg-[#2861E7] text-white" : "text-[#46566E] hover:text-[#2861E7]"}`}>{item}</button>)}</nav>
    </>
  );
}

function Action({ label, icon, primary = false }: { label: string; icon: React.ReactNode; primary?: boolean }) { return <button type="button" disabled title="This action has no backend endpoint yet" className={`inline-flex h-8 cursor-not-allowed items-center gap-1.5 px-3 text-[10px] font-medium opacity-65 ${primary ? "bg-[#2861E7] text-white" : "bg-[#F5F7FA] text-[#27364B]"}`}>{icon && <span className="[&>svg]:h-3 [&>svg]:w-3">{icon}</span>}{label}</button>; }
