"use client";

import { Download, MapPin, RefreshCw, Share2 } from "lucide-react";
import type { ProjectTab } from "./project-detail-data";
import { concepts, projectTabs } from "./project-detail-data";

export default function ProjectDetailHeader({ tab, onTabChange, onBack }: { tab: ProjectTab; onTabChange: (tab: ProjectTab) => void; onBack: () => void }) {
  return (
    <>
      <header className="flex flex-col gap-4 border-b border-[#E2E8F0] bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button type="button" onClick={onBack} className="text-[10px] text-[#526174] hover:text-[#2861E7]">Projects <span className="mx-1">›</span> <span className="font-semibold text-[#2861E7]">South Congress Retail Gallery</span></button>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]"><strong className="text-[#27364B]">123 Market Street Retail Plaza - Suite 104</strong><span className="text-[#2861E7]">Analysis v1.0</span><span className="inline-flex items-center gap-1 text-[#0AA656]"><i className="h-1.5 w-1.5 rounded-full bg-[#0AB85D]" />Report Ready</span></div>
          <h1 className="mt-2 flex items-center gap-1.5 text-[15px] font-bold text-[#151D30]"><MapPin className="h-3.5 w-3.5 text-[#2861E7]" />123 Market Street, Suite 104, Austin, TX 78701</h1>
          <p className="mt-1 text-[10px] text-[#5D6B82]">2,450 SF · Asking $44/SF NNN · TI $45/SF</p>
        </div>
        <div className="flex shrink-0 gap-2"><Action label="Download Report" icon={<Download />} /><Action label="Share Brief" icon={<Share2 />} /><Action label="Re-run Analysis" icon={<RefreshCw />} primary /></div>
      </header>
      <section className="mx-3 mt-4 rounded-[5px] bg-[#E7EDF5] p-2.5 sm:mx-4 lg:mx-6">
        <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-[#27364B]"><span>⚯ &nbsp; AI Evaluated Tenant Opportunities (3 Concepts Ranked)</span><span className="font-normal text-[#2861E7]">Active: Concept #1</span></div>
        <div className="mt-2 grid gap-2 lg:grid-cols-3">{concepts.map((concept, index) => <article key={concept.rank} className={`rounded-[5px] bg-white px-3 py-2 ${index === 0 ? "border-2 border-[#2861E7]" : "border border-transparent"}`}><div className="flex justify-between text-[9px]"><span className={index === 0 ? "font-semibold text-[#00A550]" : "font-semibold text-[#2861E7]"}>{concept.rank} <span className="ml-2 font-normal text-[#65758C]">{concept.category}</span></span><span className="font-bold text-[#00A550]">{concept.score} /100</span></div><div className="mt-1 flex items-end justify-between"><h2 className="text-[13px] font-bold text-[#151D30]">{concept.title}</h2><span className="text-[9px] text-[#65758C]">Fit Score</span></div></article>)}</div>
      </section>
      <nav aria-label="Project sections" className="mx-3 mt-3 flex overflow-x-auto border-b border-[#E2E8F0] bg-white sm:mx-4 lg:mx-6">{projectTabs.map((item) => <button type="button" key={item} onClick={() => onTabChange(item)} className={`h-[31px] shrink-0 px-3 text-[10px] transition ${tab === item ? "rounded-[3px] bg-[#2861E7] text-white" : "text-[#46566E] hover:text-[#2861E7]"}`}>{item}</button>)}</nav>
    </>
  );
}

function Action({ label, icon, primary = false }: { label: string; icon: React.ReactNode; primary?: boolean }) { return <button type="button" className={`inline-flex h-8 items-center gap-1.5 px-3 text-[10px] font-medium ${primary ? "bg-[#2861E7] text-white hover:bg-[#1F53CC]" : "bg-[#F5F7FA] text-[#27364B] hover:bg-[#EAF0F6]"}`}>{icon && <span className="[&>svg]:h-3 [&>svg]:w-3">{icon}</span>}{label}</button>; }
