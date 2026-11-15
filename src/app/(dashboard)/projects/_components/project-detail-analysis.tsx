import type { DashboardProject } from "./projects-api";

export function ProjectAssumptionsPanel({ project }: { project: DashboardProject }) {
  const rows = [
    ["Property type", project.property.property_type],
    ["Previous tenant", project.property.previous_tenant],
    ["Previous use", project.property.previous_use],
    ["Opening timeline", project.preferences.opening_timeline],
    ["Preferred tenant quality", project.preferences.preferred_tenant_quality],
    ["Business categories", project.preferences.business_categories],
    ["Desired lease term", project.leaseTerms.desired_lease_term],
    ["Preferred categories", project.leaseTerms.preferred_categories?.join(", ")],
    ["Excluded categories", project.leaseTerms.excluded_categories?.join(", ")],
    ["Landlord notes", project.leaseTerms.landlord_notes],
    ["AI instructions", project.preferences.ai_instructions],
  ];

  return <section className="m-3 overflow-hidden rounded-[5px] border border-[#CBD7E6] bg-white sm:m-4 lg:m-6"><header className="border-b border-[#DCE5EF] p-3"><h2 className="text-[14px] font-bold text-[#151D30]">Project Assumptions &amp; Preferences</h2><p className="mt-1 text-[10px] text-[#65758C]">Structured inputs saved with this property analysis.</p></header><div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left text-[10px]"><thead className="bg-[#E2E8F1] text-[#4E5D71]"><tr><th className="px-3 py-3 font-medium">Data Point</th><th className="px-3 py-3 font-medium">Saved Value</th><th className="px-3 py-3 font-medium">Source</th></tr></thead><tbody>{rows.map(([label, value]) => <tr key={label} className="border-t border-[#E1E8F0]"><td className="px-3 py-3 font-medium text-[#27364B]">{label}</td><td className="px-3 py-3 text-[#526174]">{value || "—"}</td><td className="px-3 py-3"><span className="rounded bg-[#EDF4FF] px-1.5 py-1 text-[9px] text-[#2861E7]">Property analysis input</span></td></tr>)}</tbody></table></div></section>;
}
