"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, DollarSign, FileText, RefreshCcw, TriangleAlert, Users } from "lucide-react";
import { useSession } from "next-auth/react";

import DashboardOverviewSkeleton from "./dashboard-overview-skeleton";
import { DashboardOverviewsApiResponse } from "./dashboard-overview-data-type";

const overviewCards = [
  {
    label: "Total Clients",
    key: "totalClients",
    fallbackKey: "totalUsers",
    icon: Users,
    iconClass: "bg-[#EAF1FF] text-[#1769FF]",
    valuePrefix: "",
    currency: false,
  },
  {
    label: "Active Requests",
    key: "activeRequests",
    fallbackKey: "totalSubmissions",
    icon: FileText,
    iconClass: "bg-[#FFF7E1] text-[#B58200]",
    valuePrefix: "",
    currency: false,
  },
  {
    label: "Completed This Month",
    key: "completedThisMonth",
    fallbackKey: "totalPayments",
    icon: CheckCircle2,
    iconClass: "bg-[#E9F8F0] text-[#16864C]",
    valuePrefix: "",
    currency: false,
  },
  {
    label: "Revenue Tracked",
    key: "revenueTracked",
    fallbackKey: "totalRevenue",
    icon: DollarSign,
    valuePrefix: "AED ",
    iconClass: "bg-[#F4EAFE] text-[#913CF0]",
    currency: true,
  },
  {
    label: "Pending Bookings",
    key: "pendingBookings",
    fallbackKey: undefined,
    icon: CalendarDays,
    iconClass: "bg-[#EAF9F7] text-[#069B8E]",
    valuePrefix: "",
    currency: false,
  },
  {
    label: "Employees Expiring",
    key: "employeesExpiring",
    fallbackKey: undefined,
    icon: TriangleAlert,
    iconClass: "bg-[#FDE5E1] text-[#E45042]",
    valuePrefix: "",
    currency: false,
  },
] as const;

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(value ?? 0);

export function DashboardOverview() {
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<DashboardOverviewsApiResponse>({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard overview");
      }

      const response = await res.json();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch dashboard overview");
      }

      return response;
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-[#F3D8D8] bg-white px-5 py-6 text-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)]">
          <h3 className="text-base font-semibold text-[#343A40]">
            Failed to load overview
          </h3>
          <p className="mt-1 text-sm text-[#777777]">
            {error?.message || "Something went wrong while fetching dashboard data."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-[#6A735F] px-4 text-sm font-medium text-[#4F5B45] transition hover:bg-[#F1F2F0]"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {overviewCards.map(({ label, key, fallbackKey, icon: Icon, valuePrefix = "", iconClass, currency }) => {
        const value = data?.data?.[key] ?? (fallbackKey ? data?.data?.[fallbackKey] : undefined) ?? 0;
        return (
        <div
          key={key}
          className="group flex min-h-[86px] items-center justify-between gap-4 rounded-lg border border-[#E9EBEF] bg-white px-4 py-4 shadow-[0_2px_5px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.09)] sm:min-h-[96px] sm:px-5"
        >
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium leading-normal text-[#555B63] sm:text-[11px]">{label}</p>
            <p className="mt-1 truncate text-xl font-bold leading-tight tracking-[-0.02em] text-[#202328] sm:text-[23px]">
              {valuePrefix}{currency ? formatNumber(value) : formatNumber(value)}
            </p>
          </div>
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
            <Icon className="h-6 w-6" strokeWidth={2} />
          </span>
        </div>
        );
      })}
    </div>
  );
}
