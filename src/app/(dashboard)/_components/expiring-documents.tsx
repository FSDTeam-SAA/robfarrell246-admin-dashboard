import Link from "next/link";

export type ExpiringDocument = { name: string; role: string; status?: string };
const defaultDocuments: ExpiringDocument[] = [{ name: "Raj Patel", role: "Restaurant Manager" }, { name: "Ali Hassan", role: "Waiter" }];

export default function ExpiringDocuments({ data = defaultDocuments }: { data?: ExpiringDocument[] }) {
  return <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-5" aria-labelledby="expiring-documents-title">
    <div className="mb-2 flex items-center justify-between"><h2 id="expiring-documents-title" className="text-sm font-semibold text-[#24272C]">Expiring Documents</h2><Link href="#" className="text-[10px] font-medium text-[#1769FF] hover:underline">View all</Link></div>
    <div>{data.map((document) => <div key={`${document.name}-${document.role}`} className="flex min-h-[48px] items-center justify-between gap-3 border-b border-[#EFF0F2] py-2 last:border-0"><div className="min-w-0"><p className="truncate text-[11px] font-medium text-[#17191C]">{document.name}</p><p className="truncate text-[9px] text-[#9A9EA4]">{document.role}</p></div><span className="shrink-0 text-[9px] font-medium text-[#C48600]">{document.status || "Expiring Soon"}</span></div>)}</div>
  </section>;
}
