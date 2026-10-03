"use client";

import { Clock3 } from "lucide-react";
import { useState } from "react";

const sourceRows = [
  ["Rentable Square Footage", "2200 RSF", "User Provided Lease Specs", "100%", "Verified", "Confirmed from architectural CAD lease plan"],
  ["Existing Grease Trap Capacity", "1,500 Gallons", "User Provided Lease Specs", "95%", "High", "Located in exterior sub-grade utility vault"],
  ["Trade Area Household Income", "$112,400", "Esri Demographic Data 2026", "88%", "Official", "Census Tract 13.02 ACS 5-year estimate"],
  ["Retail Spending Gap (Dining)", "$4.2M / yr", "Esri Demographic Data 2026", "92%", "High", "Unmet lunch and dinner corridor demand"],
  ["General Contractor Labor Rates", "$85–$125 / hr", "Austin Construction Benchmark 2026", "85%", "Estimated", "Union/commercial non-residential Austin average"],
  ["City Permit Timeline", "10 - 14 Weeks", "Austin Construction Benchmark 2026", "80%", "Estimated", "Subject to expedited commercial review"],
];

export function FitScorePanel() {
  const [filter, setFilter] = useState("All Sources");
  return <ValidationShell><FilterTabs value={filter} onChange={setFilter} /><SourceTable rows={filter === "All Sources" ? sourceRows : sourceRows.filter(row => row[2].includes(filter === "User Provided" ? "User Provided" : filter === "External APIs" ? "Esri" : "Austin"))} /></ValidationShell>;
}

export function VersionHistoryPanel() {
  const [filter, setFilter] = useState("All Sources");
  return <ValidationShell><FilterTabs value={filter} onChange={setFilter} /><div className="overflow-x-auto rounded-[5px] border border-[#D6E0EB]"><table className="min-w-[820px] w-full text-left text-[9px]"><thead className="bg-[#E2E8F1] text-[#4E5D71]"><tr>{["Data Point", "Date", "Top Concept", "Fit Score", "Credits Used", "Status", "Actions"].map(item => <th key={item} className="px-3 py-3 font-medium">{item}</th>)}</tr></thead><tbody>{[["Analysis v1.0", "28 Aug 2026", "Fast Casual Restaurant & Taproom", "91/100", "8 Credits"], ["Analysis v0.9 (Draft)", "28 Aug 2026", "Boutique Reformer Pilates Studio", "84/100", "8 Credits"]].map((row) => <tr key={row[0]} className="border-t border-[#E1E8F0]"><td className="px-3 py-3 text-[#27364B]">{row[0]}</td><td className="px-3 py-3 text-[#526174]"><Clock3 className="mr-1 inline h-3 w-3" />{row[1]}</td><td className="px-3 py-3 text-[#526174]">{row[2]}</td><td className="px-3 py-3 text-[#00A550]">{row[3]}</td><td className="px-3 py-3 text-[#65758C]">{row[4]}</td><td className="px-3 py-3"><span className="rounded bg-[#E9FFF2] px-2 py-1 text-[#00A550]">completed</span></td><td className="px-3 py-3"><button type="button" className="rounded bg-[#EEF4FF] px-2 py-1 text-[#2861E7] hover:bg-[#DCEAFF]">View</button></td></tr>)}</tbody></table></div></ValidationShell>;
}

function ValidationShell({ children }: { children: React.ReactNode }) { return <section className="m-3 overflow-hidden rounded-[5px] border border-[#CBD7E6] bg-white sm:m-4 lg:m-6"><header className="flex flex-col justify-between gap-3 border-b border-[#DCE5EF] p-3 sm:flex-row"><div><h2 className="text-[14px] font-bold text-[#151D30]">Detailed 17-Line CapEx Build-Out Model</h2><p className="mt-1 text-[10px] text-[#65758C]">Itemized construction cost benchmark calibrated for 2,450 SF Fast Casual conversion in Austin, TX.</p></div><div className="text-right text-[10px] text-[#65758C]">Expected Total:<b className="mt-1 block text-[14px] text-[#151D30]">$653,000</b></div></header><div className="p-3">{children}</div></section>; }
function FilterTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <div className="mb-5 inline-flex rounded-[2px] border border-[#CBD7E6] p-0.5">{["All Sources", "User Provided", "External APIs", "Modelled Assumptions"].map(item => <button type="button" key={item} onClick={() => onChange(item)} className={`px-3 py-1 text-[9px] ${value === item ? "rounded bg-[#2861E7] text-white" : "text-[#526174] hover:bg-[#EEF3F8]"}`}>{item}</button>)}</div>; }
function SourceTable({ rows }: { rows: string[][] }) { return <div className="overflow-x-auto rounded-[5px] border border-[#D6E0EB]"><table className="min-w-[880px] w-full text-left text-[9px]"><thead className="bg-[#E2E8F1] text-[#4E5D71]"><tr>{["Data Point", "Value", "Source Type", "Verification", "Compliance Notes"].map(item => <th key={item} className="px-3 py-3 font-medium">{item}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-t border-[#E1E8F0]"><td className="px-3 py-3 text-[#27364B]">{row[0]}</td><td className="px-3 py-3 text-[#526174]">{row[1]}</td><td className="px-3 py-3"><SourceTag source={row[2]} /></td><td className="px-3 py-2"><span className="inline-flex items-center gap-1"><i className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#00A550] text-[7px] text-[#00A550]">{row[3]}</i><span><b className="block text-[#00A550]">{row[4]}</b><small className="text-[7px] text-[#65758C]">Analysis Complete</small></span></span></td><td className="px-3 py-3 text-[#65758C]">{row[5]}</td></tr>)}</tbody></table></div>; }
function SourceTag({ source }: { source: string }) { const type = source.includes("User") ? "user" : source.includes("Esri") ? "external" : "model"; const classes = type === "user" ? "bg-[#EDF4FF] text-[#2861E7]" : type === "external" ? "bg-[#E9FFF2] text-[#00A550]" : "bg-[#FFF6E6] text-[#EE8300]"; return <span className={`rounded px-1.5 py-1 ${classes}`}>{source}</span>; }
