import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalInfoSkeleton() {
  return (
    <div className="min-h-[610px] w-full rounded-[5px] bg-[#F5F6F7] px-4 py-5 shadow-[0_2px_7px_rgba(24,30,43,0.10)] sm:px-5">
      <div className="mb-7">
        <Skeleton className="mb-2 h-7 w-56" />
        <Skeleton className="h-3 w-80 max-w-full" />
      </div>
      <Skeleton className="mb-7 h-4 w-28" />
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => <div key={item}><Skeleton className="mb-2 h-3 w-24" /><Skeleton className="h-9 w-full" /></div>)}
        <div className="sm:col-span-2"><Skeleton className="mb-2 h-3 w-14" /><Skeleton className="h-[72px] w-full" /></div>
        <div className="sm:col-span-2"><Skeleton className="mb-2 h-3 w-28" /><Skeleton className="h-9 w-full" /></div>
        {[5, 6].map((item) => <div key={item}><Skeleton className="mb-2 h-3 w-24" /><Skeleton className="h-9 w-full" /></div>)}
      </div>
      <div className="mt-7 flex justify-end gap-3">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}
