type SupportSummaryProps = { tickets: number };
const cards = [
  { label: "Total Requests", value: "3", detail: "Across all roles", detailClass: "text-[#00A550]" },
  { label: "Active Queue", value: "1", detail: "Open & In Review", detailClass: "text-[#2861E7]" },
  { label: "Waiting on User", value: "1", detail: "Awaiting customer reply", detailClass: "text-[#64748B]" },
  { label: "Resolved / Closed", value: "1", detail: "Completed inquiries", detailClass: "text-[#64748B]" },
  { label: "Avg Resolution", value: "3.8h", detail: "Under SLA target (24h)", detailClass: "text-[#00A550]" },
];
const SupportSummary = ({ tickets }: SupportSummaryProps) => <section aria-label="Support request summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map((card, index) => <article key={card.label} className="min-h-[77px] rounded-[6px] border border-[#D7E0EB] bg-white px-3 py-2.5"><p className="text-[10px] text-[#526174]">{card.label}</p><p className="mt-0.5 text-[18px] font-bold leading-5 text-[#151D30]">{index === 0 ? tickets : card.value}</p><span className={`mt-1 inline-block rounded bg-[#F0F3F7] px-1.5 py-0.5 text-[9px] ${card.detailClass}`}>{card.detail}</span></article>)}</section>;
export default SupportSummary;
