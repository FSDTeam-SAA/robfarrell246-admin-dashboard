import { Building2, CheckCircle2, MapPin } from "lucide-react";
import { ProjectApiUnavailable } from "./project-api-unavailable";
import type { DashboardProject } from "./projects-api";

export function OverviewPanel({ project }: { project?: DashboardProject }) {
  if (!project) return <ProjectApiUnavailable title="Project Overview" message="Select a project to load its property analysis data." />;
  const systemCards = [
    ["Plumbing", project.systems.plumbing?.condition, project.systems.plumbing?.requires_additional_plumbing, project.systems.plumbing?.work_needed],
    ["HVAC", project.systems.hvac?.condition, project.systems.hvac?.additional_capacity_required, project.systems.hvac?.work_needed],
    ["Electrical", project.systems.electrical?.condition, project.systems.electrical?.existing_service, project.systems.electrical?.work_needed],
    ["Fire Protection", project.systems.fire_protection?.condition, project.systems.fire_protection?.sprinkler_status, project.systems.fire_protection?.work_needed],
    ["Gas", project.systems.gas?.condition, project.systems.gas?.requires_natural_gas, project.systems.gas?.work_needed],
  ] as const;

  return <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.42fr)_minmax(340px,1fr)]">
    <div className="space-y-3">
      <Panel><span className="rounded bg-[#EAFBF1] px-2 py-1 text-[9px] text-[#00A550]">Property analysis input</span><h2 className="mt-3 text-[14px] font-bold">{project.spaceType}</h2><p className="mt-1 text-[10px] leading-[15px] text-[#65758C]">{project.property.previous_use || project.property.previous_tenant || "No prior-use detail provided."}</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><Info label="Current condition" value={project.spaceCondition.current_condition} /><Info label="Ceiling height" value={project.spaceCondition.ceiling_height_ft == null ? undefined : `${project.spaceCondition.ceiling_height_ft} ft`} /><Info label="Parking" value={project.spaceCondition.parking_availability} /><Info label="Zoning / permitted use" value={project.spaceCondition.zoning_permitted_use} /></div></Panel>
      <Panel><h3 className="text-[13px] font-bold">Lease &amp; Investment Inputs</h3><div className="mt-3 grid gap-2 sm:grid-cols-3"><Info label="Asking base rent" value={project.baseRent} /><Info label="Rent calculation" value={project.leaseTerms.rent_calculation_unit} /><Info label="Lease type" value={project.leaseTerms.lease_type} /><Info label="Rentable area" value={project.leaseTerms.rentable_square_footage == null ? project.squareFootage : `${project.leaseTerms.rentable_square_footage.toLocaleString()} SF`} /><Info label="Tenant improvement" value={project.leaseTerms.tenant_improvement_level} /><Info label="Landlord contribution" value={project.leaseTerms.landlord_work_contribution == null ? undefined : `$${project.leaseTerms.landlord_work_contribution.toLocaleString()}`} /></div></Panel>
      <Panel><h3 className="text-[13px] font-bold">Physical Infrastructure &amp; MEP Inputs</h3><div className="mt-3 grid gap-2 md:grid-cols-2">{systemCards.map(([name, condition, detail, work]) => <article key={name} className="rounded border border-[#D7E0EB] bg-[#F7F9FC] p-2"><p className="text-[10px] font-medium text-[#2861E7]"><CheckCircle2 className="mr-1 inline h-3 w-3" />{name}</p><p className="mt-2 text-[9px] text-[#526174]">{condition || "No condition provided"}</p>{detail && <p className="mt-1 text-[9px] text-[#65758C]">{detail}</p>}{work?.length ? <p className="mt-1 text-[9px] text-[#65758C]">Work needed: {work.join(", ")}</p> : null}</article>)}</div></Panel>
    </div>
    <div className="space-y-3"><Panel><h3 className="flex items-center gap-2 text-[13px] font-bold"><MapPin className="h-4 w-4 text-[#2861E7]" />Property record</h3><dl className="mt-3 space-y-2 text-[10px]"><Info label="Address" value={project.address} /><Info label="Suite / location" value={project.location} /><Info label="Broker" value={project.broker} /><Info label="Business categories" value={project.preferences.business_categories} /><Info label="Opening timeline" value={project.preferences.opening_timeline} /></dl></Panel><div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-[#AFC0D8] bg-[#EEF3F9] p-5 text-center"><Building2 className="h-7 w-7 text-[#2861E7]" /><p className="mt-2 text-[11px] font-medium text-[#526174]">No property image API data</p><p className="mt-1 text-[9px] text-[#728096]">Property analysis stores structured site inputs, not uploaded property imagery.</p></div></div>
  </div>;
}

function Panel({ children }: { children: React.ReactNode }) { return <section className="rounded-[5px] border border-[#D7E0EB] bg-white p-3 text-[#151D30]">{children}</section>; }
function Info({ label, value }: { label: string; value?: string }) { return <div><dt className="text-[8px] uppercase text-[#728096]">{label}</dt><dd className="mt-1 text-[10px] font-medium text-[#27364B]">{value || "—"}</dd></div>; }
