"use client";

import { ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Coins, Eye, Pencil, Plus, Search, Sparkles, TicketPercent, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { useCreateCreditPlan, useCreditOverview, useCreditPlans, useCreditPurchases, useDeleteCreditPlan, useUpdateCreditPlan } from "./credit-api";
import CreateCreditPlanModal from "./create-credit-plan-modal";
import PurchaseReceiptModal from "./purchase-receipt-modal";
import type { CreditOverviewCards, CreditPlan, PlanFormValues, Purchase } from "./credit-types";

const CreditContainer = () => {
  const [tab, setTab] = useState<"plans" | "purchases">("plans");
  const [filter, setFilter] = useState<"all" | "active" | "archive">("all");
  const [editingPlan, setEditingPlan] = useState<CreditPlan | null | undefined>(undefined);
  const [receipt, setReceipt] = useState<Purchase | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const overview = useCreditOverview();
  const plans = useCreditPlans();
  const purchases = useCreditPurchases(page);
  const createPlan = useCreateCreditPlan();
  const updatePlan = useUpdateCreditPlan();
  const deletePlan = useDeleteCreditPlan();

  const visiblePurchases = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return purchases.data?.purchases ?? [];
    return (purchases.data?.purchases ?? []).filter((purchase) =>
      `${purchase.customer} ${purchase.email} ${purchase.plan} ${purchase.transactionId}`.toLowerCase().includes(term),
    );
  }, [purchases.data?.purchases, query]);

  const savePlan = async (values: PlanFormValues) => {
    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, values });
        toast.success("Credit plan updated successfully");
      } else {
        await createPlan.mutateAsync(values);
        toast.success("Credit plan created successfully");
      }
      setEditingPlan(undefined);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save credit plan");
    }
  };

  const removePlan = async (plan: CreditPlan) => {
    try {
      await deletePlan.mutateAsync(plan.id);
      toast.success("Credit plan deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete credit plan");
    }
  };

  return (
    <section className="bg-[#F7F9FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex items-center justify-between gap-4"><span className="inline-flex items-center gap-1.5 text-[12px] text-[#2861E7]"><Coins className="h-3.5 w-3.5" />Billing &amp; Token Governance</span><button type="button" onClick={() => setEditingPlan(null)} className="inline-flex h-[35px] shrink-0 items-center gap-2 bg-[#2861E7] px-4 text-[12px] font-medium text-white transition hover:bg-[#1F53CC]"><Plus className="h-3.5 w-3.5" />Create Credit Plan</button></div>

        <OverviewCards overview={overview.data} isLoading={overview.isLoading} error={overview.error} onRetry={() => overview.refetch()} />

        <div className="mt-4 inline-flex bg-[#E5EBF4] p-1"><TabButton active={tab === "plans"} onClick={() => setTab("plans")}><Coins className="h-3.5 w-3.5" />Credit Top-up Plans</TabButton><TabButton active={tab === "purchases"} onClick={() => setTab("purchases")}><CircleDollarSign className="h-3.5 w-3.5" />User Purchases &amp; Earnings ({purchases.data?.total ?? 0})</TabButton></div>

        {tab === "plans" ? (
          <PlansPanel plans={plans.data} filter={filter} isLoading={plans.isLoading} error={plans.error} isDeleting={deletePlan.isPending} onFilter={setFilter} onEdit={setEditingPlan} onDelete={removePlan} onRetry={() => plans.refetch()} />
        ) : (
          <PurchasesPanel purchases={visiblePurchases} total={purchases.data?.total ?? 0} totalPages={purchases.data?.totalPages ?? 1} query={query} page={page} isLoading={purchases.isLoading} error={purchases.error} onQuery={setQuery} onPage={setPage} onReceipt={setReceipt} onRetry={() => purchases.refetch()} />
        )}
      </div>
      <CreateCreditPlanModal isOpen={editingPlan !== undefined} plan={editingPlan ?? null} isSaving={createPlan.isPending || updatePlan.isPending} onClose={() => setEditingPlan(undefined)} onSave={savePlan} />
      <PurchaseReceiptModal purchase={receipt} onClose={() => setReceipt(null)} />
    </section>
  );
};

const OverviewCards = ({ overview, isLoading, error, onRetry }: { overview?: CreditOverviewCards; isLoading: boolean; error: Error | null; onRetry: () => void }) => {
  if (isLoading) return <ApiLoadingSkeleton rows={2} />;
  if (error) return <ApiErrorState message={error.message} onRetry={onRetry} />;
  if (!overview) return <ApiEmptyState message="No credit overview is available." />;

  return <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <Metric label="Total Credit Pack Earnings" value={`$${overview.totalCreditPackEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} detail="Completed credit pack purchases" detailClass="text-[#04A854] bg-[#EAFBF1]" />
    <Metric label="Total Credits Sold / Issued" value={overview.totalCreditsSold.toLocaleString()} suffix="CR" detail="Across completed pack purchases" />
    <Metric label="Total Credits Used / Burned" value={overview.totalCreditsUsed.toLocaleString()} suffix="CR" valueClass="text-[#EE8300]" detail="Reported by the credit overview API" />
    <Metric label="Active Credits in Circulation" value={overview.activeCreditsInCirculation.toLocaleString()} suffix="CR" valueClass="text-[#2861E7]" detail="Held in tenant & broker balances" />
  </section>;
};

const Metric = ({ label, value, suffix, detail, valueClass = "", detailClass = "" }: { label: string; value: string; suffix?: string; detail: string; valueClass?: string; detailClass?: string }) => <div className="min-h-[77px] rounded-[5px] border border-[#D7E0EB] bg-white px-3 py-2.5"><p className="text-[10px] text-[#526174]">{label}</p><p className={`mt-0.5 text-[18px] font-bold leading-5 text-[#151D30] ${valueClass}`}>{value} {suffix && <span className="text-[11px] font-medium text-[#5D6B82]">{suffix}</span>}</p><span className={`mt-1 inline-block rounded bg-[#F0F3F7] px-1.5 py-0.5 text-[9px] ${detailClass || "text-[#65758C]"}`}>{detail}</span></div>;
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => <button type="button" onClick={onClick} className={`inline-flex h-[27px] items-center gap-1.5 px-3 text-[11px] ${active ? "bg-[#2861E7] text-white shadow-sm" : "text-[#53647C] hover:text-[#2861E7]"}`}>{children}</button>;

const PlansPanel = ({ plans, filter, isLoading, error, isDeleting, onFilter, onEdit, onDelete, onRetry }: { plans?: CreditPlan[]; filter: "all" | "active" | "archive"; isLoading: boolean; error: Error | null; isDeleting: boolean; onFilter: (value: "all" | "active" | "archive") => void; onEdit: (plan: CreditPlan) => void; onDelete: (plan: CreditPlan) => void; onRetry: () => void }) => (
  <div className="mt-4">
    <div className="mb-4 flex min-h-[58px] flex-col justify-between gap-3 rounded-[6px] border border-[#D7E0EB] bg-white px-3.5 py-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3"><span className="text-[11px] font-medium text-[#344054]">Filter Status:</span><div className="inline-flex rounded bg-[#E5EBF4] p-1">{(["all", "active", "archive"] as const).map((item) => <button key={item} type="button" onClick={() => onFilter(item)} disabled={item !== "all"} title={item !== "all" ? "Plan archive status is not available in the backend API" : undefined} className={`h-[25px] px-3 text-[11px] capitalize disabled:cursor-not-allowed disabled:opacity-60 ${filter === item ? "rounded bg-[#2861E7] text-white" : "text-[#506078]"}`}>{item === "all" ? "All" : item === "archive" ? "Archive" : "Active"}</button>)}</div></div>
      <p className="flex items-center gap-2 text-[11px] text-[#53647C]"><Sparkles className="h-4 w-4 text-[#2861E7]" />Active packages appear immediately in Broker and Tenant Top-Up Modals.</p>
    </div>
    {isLoading ? <ApiLoadingSkeleton rows={4} /> : error ? <ApiErrorState message={error.message} onRetry={onRetry} /> : !plans?.length ? <ApiEmptyState message="No credit plans are available." /> : <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} isDeleting={isDeleting} onEdit={() => onEdit(plan)} onDelete={() => onDelete(plan)} />)}</div>}
  </div>
);

const PlanCard = ({ plan, isDeleting, onEdit, onDelete }: { plan: CreditPlan; isDeleting: boolean; onEdit: () => void; onDelete: () => void }) => <article className="overflow-hidden rounded-[5px] border border-[#AFC0D8] bg-white"><div className="min-h-[197px] p-3"><div className="flex items-start justify-between gap-2"><span className="rounded bg-[#E8F1FF] px-1.5 py-0.5 text-[10px] font-medium text-[#2861E7]">{plan.badge || "Standard"}</span><div className="flex gap-1">{plan.featured && <span className="rounded border border-[#75A4FF] px-1.5 py-0.5 text-[9px] text-[#2861E7]">Popular</span>}<span className="rounded border border-[#4ED18A] px-1.5 py-0.5 text-[9px] text-[#00A550]">Active</span></div></div><h3 className="mt-3 text-[12px] font-semibold text-[#2162E6]">{plan.title}</h3><p className="mt-2 h-[30px] overflow-hidden text-[10px] leading-[15px] text-[#6B7B92]">{plan.description}</p><div className="mt-3 border-b border-[#E2E8F0] pb-3"><p className="flex items-center gap-1 text-[20px] font-bold text-[#00A550]"><TicketPercent className="h-3.5 w-3.5" />{plan.credits}<span className="text-[9px] font-medium">CREDITS</span></p><div className="mt-1.5 flex justify-between text-[10px]"><span className="font-semibold text-[#2861E7]">${plan.price} USD</span><span className="text-[#53647C]">${(plan.price / plan.credits).toFixed(2)} / credit</span></div></div><div className="mt-2 overflow-hidden rounded-[3px] border border-[#CAD6E4] text-[9px]"><div className="flex justify-between px-1.5 py-1 text-[#73839A]"><span>Total Purchases:</span><b className="text-[#2162E6]">—</b></div><div className="flex justify-between border-t border-[#E2E8F0] px-1.5 py-1 text-[#73839A]"><span>Revenue Earned:</span><b className="text-[#00A550]">—</b></div></div></div><footer className="flex h-[38px] items-center justify-between border-t border-[#E2E8F0] px-3"><button type="button" disabled title="Plan archive is not available in the backend API" className="cursor-not-allowed text-[10px] text-[#EE8B00] opacity-60">Archive</button><div className="flex items-center gap-3"><button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-[10px] text-[#2861E7] hover:underline"><Pencil className="h-3 w-3" />Edit</button><button type="button" disabled={isDeleting} onClick={onDelete} aria-label={`Delete ${plan.title}`} className="text-[#F1424A] hover:text-[#D8232D] disabled:opacity-50"><Trash2 className="h-3 w-3" /></button></div></footer></article>;

const PurchasesPanel = ({ purchases, total, totalPages, query, page, isLoading, error, onQuery, onPage, onReceipt, onRetry }: { purchases: Purchase[]; total: number; totalPages: number; query: string; page: number; isLoading: boolean; error: Error | null; onQuery: (value: string) => void; onPage: (value: number) => void; onReceipt: (purchase: Purchase) => void; onRetry: () => void }) => <div className="mt-4 overflow-hidden rounded-[3px] border border-[#E0E7F0] bg-white"><div className="flex min-h-[44px] flex-col justify-between gap-3 bg-[#2948B4] px-3 py-2 sm:flex-row sm:items-center sm:px-3.5"><label className="relative block w-full sm:w-[235px]"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77849A]" /><input type="text" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search..." aria-label="Search purchases on this page" className="h-[24px] w-full rounded-[3px] border-0 bg-white py-1 pl-7 pr-9 text-[11px] text-[#26364D] outline-none placeholder:text-[#8A96A8]" /><kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#D7DEE8] bg-[#F7F9FC] px-1 py-px text-[8px] text-[#7E8999]">⌘K</kbd></label><label className="flex items-center justify-end gap-2 text-[11px] text-white"><span>Role:</span><span className="relative"><select disabled value="All" title="Purchase roles are not returned by the backend list API" className="h-[24px] appearance-none rounded-[3px] border-0 bg-white py-1 pl-2 pr-6 text-[10px] text-[#344054] disabled:opacity-100"><option>All</option></select><ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#526174]" /></span></label></div>{isLoading ? <div className="p-4"><ApiLoadingSkeleton rows={5} /></div> : error ? <div className="p-4"><ApiErrorState message={error.message} onRetry={onRetry} /></div> : <><div className="overflow-x-auto"><table className="w-full min-w-[980px] border-collapse text-left"><thead className="bg-[#E1E7F0] text-[10px] font-medium uppercase text-[#4F5E73]"><tr className="h-[34px]"><th className="w-[17%] px-4 font-medium">Customer / User</th><th className="w-[8%] px-3 font-medium">Role</th><th className="w-[15%] px-3 font-medium">Credit Plan Purchased</th><th className="w-[12%] px-3 font-medium">Credits Added</th><th className="w-[12%] px-3 font-medium">Earnings ($ USD)</th><th className="w-[12%] px-3 font-medium">Payment Method</th><th className="w-[12%] px-3 font-medium">Date</th><th className="w-[8%] px-3 font-medium">Status</th><th className="w-[10%] px-3 text-center font-medium normal-case">Action</th></tr></thead><tbody>{purchases.map((purchase) => <PurchaseRow key={purchase.id} purchase={purchase} onReceipt={() => onReceipt(purchase)} />)}{purchases.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-[12px] text-[#718097]">No purchases match your search.</td></tr>}</tbody></table></div><footer className="flex min-h-[52px] items-center justify-between gap-3 px-3.5 py-2 text-[10px] text-[#526174]"><span>{total} requests · Page {page} of {totalPages}</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button><span className="inline-flex h-[25px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5">{page}</span><button type="button" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button></div></footer></>}</div>;

const PurchaseRow = ({ purchase, onReceipt }: { purchase: Purchase; onReceipt: () => void }) => <tr className="h-[49px] border-b border-[#E5EAF1] last:border-b-0"><td className="px-4 py-2"><p className="truncate text-[11px] font-medium text-[#27364B]">{purchase.customer}</p><p className="max-w-[160px] truncate text-[9px] text-[#728096]">{purchase.email}</p></td><td className="px-3 py-2"><span className="rounded bg-[#F1F4F8] px-1.5 py-0.5 text-[9px] font-medium text-[#63738A]">—</span></td><td className="px-3 text-[10px] text-[#26364D]">{purchase.plan}</td><td className="px-3 text-[10px] text-[#2666E8]">+{purchase.credits} CR</td><td className="px-3 text-[10px] text-[#00A550]">${purchase.amount.toFixed(2)}</td><td className="px-3 text-[10px] text-[#26364D]">Stripe</td><td className="px-3 text-[10px] text-[#26364D]">{purchase.date}</td><td className="px-3"><StatusBadge status={purchase.status} /></td><td className="px-3 text-center"><div className="flex justify-center gap-2"><button type="button" onClick={onReceipt} className="inline-flex h-[25px] items-center gap-1 bg-[#F1F4F8] px-2 text-[10px] text-[#26364D] hover:bg-[#E7ECF2]"><Eye className="h-3.5 w-3.5" />Details</button><button type="button" disabled title="Purchase deletion is not available in the backend API" aria-label={`Delete ${purchase.transactionId}`} className="inline-flex h-[25px] w-[28px] cursor-not-allowed items-center justify-center bg-[#FFF1F2] text-[#F23A43] opacity-60"><Trash2 className="h-3 w-3" /></button></div></td></tr>;

const StatusBadge = ({ status }: { status: Purchase["status"] }) => <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium ${status === "SUCCEEDED" ? "bg-[#EAFBF1] text-[#00A550]" : status === "FAILED" ? "bg-[#FFF1F2] text-[#F23A43]" : "bg-[#FFF7E8] text-[#D97706]"}`}><i className={`h-1.5 w-1.5 rounded-full ${status === "SUCCEEDED" ? "bg-[#0AB85D]" : status === "FAILED" ? "bg-[#F23A43]" : "bg-[#D97706]"}`} />{status}</span>;

export default CreditContainer;
