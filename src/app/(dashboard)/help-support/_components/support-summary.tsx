import { ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import type { SupportCards } from "./help-support-api";

type SupportSummaryProps = { cards?: SupportCards; isLoading: boolean; error?: Error | null; onRetry: () => void };

const SupportSummary = ({ cards, isLoading, error, onRetry }: SupportSummaryProps) => {
  if (isLoading) return <ApiLoadingSkeleton rows={2} />;
  if (error) return <ApiErrorState message={error.message} onRetry={onRetry} />;
  if (!cards) return null;
  const summaryCards = [
    { label: "Total Requests", value: String(cards.totalRequests), detail: "Across all roles", detailClass: "text-[#00A550]" },
    { label: "Active Queue", value: String(cards.activeQueue), detail: "Open & In Review", detailClass: "text-[#2861E7]" },
    { label: "Waiting on User", value: String(cards.waitingOnUser), detail: "Awaiting customer reply", detailClass: "text-[#64748B]" },
    { label: "Resolved / Closed", value: String(cards.resolvedClosed), detail: "Completed inquiries", detailClass: "text-[#64748B]" },
  ];

  return <section aria-label="Support request summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{summaryCards.map((card) => <article key={card.label} className="min-h-[77px] rounded-[6px] border border-[#D7E0EB] bg-white px-3 py-2.5"><p className="text-[10px] text-[#526174]">{card.label}</p><p className="mt-0.5 text-[18px] font-bold leading-5 text-[#151D30]">{card.value}</p><span className={`mt-1 inline-block rounded bg-[#F0F3F7] px-1.5 py-0.5 text-[9px] ${card.detailClass}`}>{card.detail}</span></article>)}</section>;
};
export default SupportSummary;
