"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type ChartRange = "7d" | "30d" | "12m";

export type DashboardChartPoint = {
  label: string;
  revenue: number;
  profit: number;
};

export type RecentDashboardUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  plan: string | null;
  credits: number;
  status: "ACTIVE" | "SUSPENDED";
};

type AdminDashboardChartsResponse = {
  success: boolean;
  message: string;
  data: {
    range: ChartRange;
    revenueChart: DashboardChartPoint[];
    activeUsersChart: Array<{ label: string; activeUsers: number }>;
    recentUsers: RecentDashboardUser[];
  };
};

export function useAdminDashboardCharts(range: ChartRange) {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)
    ?.accessToken;

  return useQuery<AdminDashboardChartsResponse>({
    queryKey: ["admin-dashboard-charts", range],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard/charts?range=${range}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to fetch dashboard charts");
      }

      return payload;
    },
    enabled: Boolean(token),
  });
}
