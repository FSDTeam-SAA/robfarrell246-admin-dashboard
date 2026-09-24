import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverviewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[96px] items-center justify-between gap-4 rounded-lg border border-[#E7EAE5] bg-white px-5 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
        >
          <Skeleton className="order-2 h-12 w-12 shrink-0 rounded-full bg-[#ECEFEC]" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28 rounded bg-[#ECEFEC]" />
            <Skeleton className="h-7 w-24 rounded bg-[#E1E5E1]" />
          </div>
        </div>
      ))}
    </div>
  );
}
