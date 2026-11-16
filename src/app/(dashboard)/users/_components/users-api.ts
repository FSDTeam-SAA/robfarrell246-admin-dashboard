"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  meta?: { total: number; page: number; limit: number; totalPages: number };
  data: T;
};

type BackendUser = {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  role: "LANDLORD" | "TENANT";
  creditBalance?: number;
  isSuspended?: boolean;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  role: "BROKER" | "TENANT";
  credits: number;
  status: "ACTIVE" | "SUSPENDED";
  plan: string | null;
};

type MemberDetailData = {
  purchases?: Array<{
    plan?: { title?: string } | string | null;
  }>;
};

type UserListData = {
  users: BackendUser[];
  paginationInfo: { currentPage: number; totalPages: number };
};

const toDashboardUser = (user: BackendUser): DashboardUser => ({
  id: user._id,
  name: user.name,
  email: user.email,
  companyName: user.companyName,
  role: user.role === "LANDLORD" ? "BROKER" : "TENANT",
  credits: user.creditBalance ?? 0,
  status: user.isSuspended ? "SUSPENDED" : "ACTIVE",
  plan: null,
});

function useAccessToken() {
  const { data: session } = useSession();
  return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}

async function request<T>(path: string, token?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
  const payload = await response.json();
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "Request failed");
  return payload;
}

export function useAdminUsers({ page, search, role }: { page: number; search: string; role: "ALL" | DashboardUser["role"] }) {
  const token = useAccessToken();
  return useQuery<{ users: DashboardUser[]; total: number; totalPages: number }>({
    queryKey: ["admin-users", page, search, role],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search.trim()) params.set("search", search.trim());
      if (role !== "ALL") params.set("role", role === "BROKER" ? "LANDLORD" : "TENANT");
      const payload = await request<ApiEnvelope<UserListData>>(`/user/all-users?${params.toString()}`, token);
      return {
        users: payload.data.users.map(toDashboardUser),
        total: payload.meta?.total ?? payload.data.users.length,
        totalPages: payload.meta?.totalPages ?? payload.data.paginationInfo.totalPages ?? 1,
      };
    },
    enabled: Boolean(token),
    placeholderData: (previousData) => previousData,
  });
}

export function useSetUserSuspension() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) => request(`/user/${userId}/suspend`, token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuspended }),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUserPlanLookup(users: DashboardUser[]) {
  const token = useAccessToken();
  const userIds = Array.from(new Set(users.map((user) => user.id)));
  const queries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["admin-user-credit-plan", userId],
      queryFn: async () => {
        const payload = await request<ApiEnvelope<MemberDetailData>>(`/credit-plan/members/${userId}`, token);
        const plan = payload.data.purchases?.[0]?.plan;
        return typeof plan === "object" ? plan?.title || null : null;
      },
      enabled: Boolean(token),
      staleTime: 5 * 60_000,
    })),
  });

  return userIds.reduce<Map<string, string | null>>((plans, userId, index) => {
    plans.set(userId, queries[index]?.data ?? null);
    return plans;
  }, new Map());
}
