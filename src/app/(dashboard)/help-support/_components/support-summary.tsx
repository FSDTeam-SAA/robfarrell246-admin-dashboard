import type { SupportTicket } from "./help-support-types";

type SupportSummaryProps = { tickets: SupportTicket[]; total: number };

const SupportSummary = ({ tickets, total }: SupportSummaryProps) => {
  const active = tickets.filter((ticket) => ticket.status === "Open" || ticket.status === "In Review").length;
  const resolved = tickets.filter((ticket) => ticket.status === "Resolved" || ticket.status === "Closed").length;
  const cards = [
    { label: "Total Requests", value: String(total), detail: "Across all roles", detailClass: "text-[#00A550]" },
    { label: "Active Queue", value: String(active), detail: "Open & In Review on this page", detailClass: "text-[#2861E7]" },
    { label: "Waiting on User", value: "—", detail: "Status is not provided by API", detailClass: "text-[#64748B]" },
    { label: "Resolved / Closed", value: String(resolved), detail: "Completed inquiries on this page", detailClass: "text-[#64748B]" },
    { label: "Avg Resolution", value: "—", detail: "Resolution-time API unavailable", detailClass: "text-[#64748B]" },
  ];

  return <section aria-label="Support request summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map((card) => <article key={card.label} className="min-h-[77px] rounded-[6px] border border-[#D7E0EB] bg-white px-3 py-2.5"><p className="text-[10px] text-[#526174]">{card.label}</p><p className="mt-0.5 text-[18px] font-bold leading-5 text-[#151D30]">{card.value}</p><span className={`mt-1 inline-block rounded bg-[#F0F3F7] px-1.5 py-0.5 text-[9px] ${card.detailClass}`}>{card.detail}</span></article>)}</section>;
};
export default SupportSummary;
