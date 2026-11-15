import { AlertTriangle } from "lucide-react";
import { ProjectApiUnavailable } from "./project-api-unavailable";
import type { DashboardProject } from "./projects-api";

export default function ProjectBudgetPanel({ project }: { project?: DashboardProject }) {
  if (!project) return <ProjectApiUnavailable title="Lease & Investment Inputs" message="Select a project to load its lease and investment input data." />;
  const rows = [
    ["Asking base rent", project.baseRent],
    ["Rent calculation unit", project.leaseTerms.rent_calculation_unit || "—"],
    ["Lease type", project.leaseTerms.lease_type || "—"],
    ["Rentable square footage", project.leaseTerms.rentable_square_footage == null ? project.squareFootage : `${project.leaseTerms.rentable_square_footage.toLocaleString()} SF`],
    ["Tenant improvement level", project.leaseTerms.tenant_improvement_level || "—"],
    ["Landlord work contribution", project.leaseTerms.landlord_work_contribution == null ? "—" : `$${project.leaseTerms.landlord_work_contribution.toLocaleString()}`],
  ];

  return <section className="m-3 overflow-hidden rounded-[4px] border border-[#CBD7E6] bg-white sm:m-4 lg:m-6"><header className="flex flex-col justify-between gap-3 border-b border-[#DCE5EF] p-3 sm:flex-row"><div><h2 className="text-[14px] font-bold">Lease &amp; Investment Inputs</h2><p className="mt-1 text-[10px] text-[#65758C]">Current financial inputs saved with this property analysis.</p></div><div className="text-right text-[10px] text-[#65758C]">Asking rent:<b className="mt-1 block text-[14px] text-[#151D30]">{project.baseRent}</b></div></header><div className="p-3"><div className="rounded-[5px] border border-[#EE9700] bg-[#FFF9EE] p-3"><p className="text-[10px] font-semibold text-[#EE8300]"><AlertTriangle className="mr-1 inline h-3 w-3" />NO CAPEX ESTIMATE API DATA</p><p className="mt-2 text-[9px] leading-[12px] text-[#7B8492]">The backend stores lease and landlord contribution inputs, but does not provide a calculated construction budget or investment estimate.</p></div><div className="mt-4 overflow-x-auto rounded-[5px] border border-[#D6E0EB]"><table className="w-full min-w-[720px] text-left text-[10px]"><thead className="bg-[#E2E8F1] text-[#4F5D71]"><tr><th className="px-3 py-3 font-medium">Lease Data Point</th><th className="px-3 py-3 font-medium">Saved Value</th><th className="px-3 py-3 font-medium">Source</th></tr></thead><tbody>{rows.map(([label, value]) => <tr key={label} className="border-t border-[#E1E8F0]"><td className="px-3 py-3 text-[#27364B]">{label}</td><td className="px-3 py-3 font-medium text-[#27364B]">{value}</td><td className="px-3 py-3"><span className="rounded bg-[#EDF4FF] px-1.5 py-1 text-[9px] text-[#2861E7]">Property analysis input</span></td></tr>)}</tbody></table></div></div></section>;
}
