"use client";

import { ArrowRight, CircleUserRound } from "lucide-react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "./api-feedback";
import { useAdminDashboardCharts } from "./admin-dashboard-queries";

const RecentUser = () => {
  const { data, isLoading, isError, error, refetch } = useAdminDashboardCharts("12m");
  const recentUsers = data?.data.recentUsers ?? [];

  if (isLoading) return <ApiLoadingSkeleton rows={4} />;
  if (isError) return <ApiErrorState message={error.message} onRetry={() => refetch()} />;
  if (recentUsers.length === 0) return <ApiEmptyState message="No recent users found." />;

  return (
    <section className="overflow-hidden rounded-md border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">
      <header className="flex h-[50px] items-center justify-between px-5">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#131B2E]">
          Recent User
        </h2>
        <a
          href="/users"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1F64FF] transition hover:text-[#0B4DE2]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </a>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] table-fixed border-collapse">
          <thead className="bg-[#E7ECF4] text-left">
            <tr className="h-[46px] text-[12px] font-medium text-[#303A4C]">
              <th className="w-[21%] px-5 font-medium">User</th>
              <th className="w-[14%] px-2 font-medium">Type</th>
              <th className="w-[18%] px-2 font-medium">Plan</th>
              <th className="w-[17%] px-2 font-medium">Credits</th>
              <th className="w-[17%] px-2 font-medium">Status</th>
              <th className="w-[13%] px-2 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => {
              const isActive = user.status === "ACTIVE";
              const isBroker = user.role === "LANDLORD";

              return (
                <tr key={user.email} className="h-[61px] border-t border-[#D8DEE8] text-[12px] text-[#192238]">
                  <td className="px-5 py-2">
                    <p className="max-w-[120px] truncate text-[13px] font-medium leading-4">{user.name}</p>
                    <p className="max-w-[120px] truncate text-[10px] leading-3 text-[#5B6980]">{user.email}</p>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium leading-3 ${isBroker ? "bg-[#EEF6FF] text-[#1F5AFF]" : "bg-[#EDFCF2] text-[#08A94E]"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="block max-w-[110px] break-words text-[11px] leading-[13px] text-[#1F5EFF]">{user.plan || "No plan"}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="inline-flex rounded-md bg-[#FFF9EC] px-2 py-0.5 text-[10px] leading-3 text-[#F07800]">{user.credits} Credits</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium leading-3 ${isActive ? "bg-[#EDFCF2] text-[#08A94E]" : "bg-[#FFF0F1] text-[#EF2332]"}`}>
                      <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#08A94E]" : "bg-[#EF2332]"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      aria-label={`Manage ${user.name}`}
                      className={`inline-flex h-[30px] w-[41px] items-center justify-center ${isActive ? "bg-[#FFF2F2] text-[#F3212C]" : "bg-[#FFF9EB] text-[#EE8600]"} transition hover:brightness-95`}
                    >
                      <CircleUserRound className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentUser;
