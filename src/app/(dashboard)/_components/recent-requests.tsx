import Link from "next/link";

export type RecentRequest = { id: string; applicant: string; service: string; status: string };
const defaultRequests: RecentRequest[] = [
  { id: "SR-2024-0002", applicant: "Ahmed Al Mansouri", service: "Residence Visa", status: "In Progress" },
  { id: "SR-2024-0006", applicant: "Ahmed Al Mansouri", service: "Residence Visa", status: "Submitted" },
  { id: "SR-2024-0001", applicant: "Ahmed Al Mansouri", service: "Golden Visa", status: "Completed" },
  { id: "SR-2024-0004", applicant: "Sara Mohammed", service: "Freezone Company Setup", status: "Awaiting Budget" },
  { id: "SR-2024-0003", applicant: "Sara Mohammed", service: "Freelance Visa", status: "Government Review" },
];

export default function RecentRequests({ data = defaultRequests }: { data?: RecentRequest[] }) {
  return <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-5" aria-labelledby="recent-requests-title">
    <div className="mb-2 flex items-center justify-between"><h2 id="recent-requests-title" className="text-sm font-semibold text-[#24272C]">Recent Requests</h2><Link href="#" className="text-[10px] font-medium text-[#1769FF] hover:underline">View all</Link></div>
    <div>{data.map((request) => <div key={request.id} className="flex min-h-[48px] items-center justify-between gap-3 border-b border-[#EFF0F2] py-2 last:border-0"><div className="min-w-0"><p className="truncate text-[11px] font-medium text-[#17191C]">{request.id}</p><p className="truncate text-[9px] text-[#9A9EA4]">{request.applicant} - {request.service}</p></div><span className="shrink-0 rounded-full bg-[#F0F1F2] px-2.5 py-1 text-[9px] text-[#454A50]">{request.status}</span></div>)}</div>
  </section>;
}
