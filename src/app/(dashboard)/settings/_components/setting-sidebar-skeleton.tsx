import { Skeleton } from "@/components/ui/skeleton";

export const SettingSidebarSkeleton = () => {
  return (
    <div className="h-full min-h-[553px] overflow-hidden rounded-[5px] bg-[#F5F6F7] shadow-[0_2px_7px_rgba(24,30,43,0.16)]">
      <Skeleton className="h-[132px] w-full rounded-none" />
      <div className="-mt-[67px] flex justify-center">
        <Skeleton className="size-[112px] rounded-full border-[3px] border-white" />
      </div>
      <div className="flex flex-col items-center gap-2 pb-6 pt-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="space-y-3 px-4">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};
