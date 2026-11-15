import { RefreshCcw } from "lucide-react";

export function ApiLoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3 rounded-[6px] border border-[#D7E0EB] bg-white p-4">
      <div className="h-5 w-40 rounded bg-[#E7ECF4]" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 rounded bg-[#F1F4F8]" />
      ))}
    </div>
  );
}

export function ApiErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[6px] border border-[#F3D8D8] bg-white px-5 py-6 text-center">
      <h3 className="text-sm font-semibold text-[#343A40]">Unable to load data</h3>
      <p className="mt-1 text-xs text-[#777777]">{message || "Please try again."}</p>
      <button type="button" onClick={onRetry} className="mt-4 inline-flex h-9 items-center gap-2 rounded-[3px] border border-[#DCE4EF] px-3 text-xs text-[#42546D] hover:bg-[#F7F9FC]">
        <RefreshCcw className="h-3.5 w-3.5" /> Retry
      </button>
    </div>
  );
}

export function ApiEmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-[6px] border border-dashed border-[#C9D5E4] bg-white px-5 py-6 text-center text-sm text-[#718097]">
      {message}
    </div>
  );
}
