"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { CreditOverviewCards, CreditPlan, PlanFormValues, Purchase } from "./credit-types";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
};

type BackendPlan = {
  _id: string;
  title: string;
  actualPrice: number;
  discountedPrice: number;
  creditVolume: number;
  description?: string;
  promoLabel?: string;
  isFeatured?: boolean;
};

type BackendPurchase = {
  _id: string;
  user?: { _id?: string; name?: string; email?: string } | string;
  plan?: { _id?: string; title?: string } | string;
  amountPaid: number;
  creditsAdded: number;
  status: "pending" | "completed" | "failed";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
};

type PurchasesData = {
  purchases: BackendPurchase[];
  paginationInfo?: { currentPage?: number; totalPages?: number };
};

type MemberDetailData = {
  user?: { role?: "LANDLORD" | "TENANT" | "ADMIN" };
};

const apiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003/api/v1").replace(/\/$/, "");

function useAccessToken() {
  const { data: session } = useSession();
  return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}

async function request<T>(path: string, token?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const payload = await response.json();
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "Request failed");
  return payload;
}

const toCreditPlan = (plan: BackendPlan): CreditPlan => ({
  id: plan._id,
  title: plan.title,
  badge: plan.promoLabel || "Standard",
  description: plan.description || "",
  credits: plan.creditVolume,
  price: plan.discountedPrice,
  featured: Boolean(plan.isFeatured),
});

const toPurchase = (purchase: BackendPurchase): Purchase => {
  const user = typeof purchase.user === "object" ? purchase.user : undefined;
  const plan = typeof purchase.plan === "object" ? purchase.plan : undefined;

  return {
    id: purchase._id,
    userId: user?._id,
    customer: user?.name || "Unknown user",
    email: user?.email || "—",
    // The list API only populates name and email, not the account role.
    role: "Unknown",
    plan: plan?.title || "Unknown plan",
    credits: purchase.creditsAdded,
    amount: purchase.amountPaid,
    date: new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(purchase.createdAt)),
    paymentMethod: "Stripe Checkout",
    transactionId: purchase.stripePaymentIntentId || purchase.stripeSessionId || purchase._id,
    status: purchase.status === "completed" ? "SUCCEEDED" : purchase.status === "failed" ? "FAILED" : "PENDING",
  };
};

const toPayload = (values: PlanFormValues) => ({
  title: values.title,
  // The existing form has one price field. It is the discounted checkout price;
  // use the same value as the required actualPrice until the design exposes both.
  actualPrice: values.price,
  discountedPrice: values.price,
  creditVolume: values.credits,
  description: values.description,
  promoLabel: values.badge,
  isFeatured: values.featured,
});

export function useCreditOverview() {
  const token = useAccessToken();
  return useQuery<CreditOverviewCards>({
    queryKey: ["credit-overview"],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<{ cards: CreditOverviewCards }>>("/credit-plan/admin/overview", token);
      return payload.data.cards;
    },
    enabled: Boolean(token),
  });
}

export function useCreditPlans() {
  const token = useAccessToken();
  return useQuery<CreditPlan[]>({
    queryKey: ["credit-plans"],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<BackendPlan[]>>("/credit-plan", token);
      return payload.data.map(toCreditPlan);
    },
    enabled: Boolean(token),
  });
}

export function useCreditPurchases(page: number) {
  const token = useAccessToken();
  return useQuery<{ purchases: Purchase[]; total: number; totalPages: number }>({
    queryKey: ["credit-purchases", page],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<PurchasesData>>(`/credit-plan/purchases/all?page=${page}&limit=10`, token);
      return {
        purchases: payload.data.purchases.map(toPurchase),
        total: payload.meta?.total ?? payload.data.purchases.length,
        totalPages: payload.meta?.totalPages ?? payload.data.paginationInfo?.totalPages ?? 1,
      };
    },
    enabled: Boolean(token),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreditPurchaseRoles(purchases: Purchase[], enabled: boolean) {
  const token = useAccessToken();
  const userIds = Array.from(new Set(purchases.map((purchase) => purchase.userId).filter((userId): userId is string => Boolean(userId))));
  const queries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["credit-purchase-member", userId],
      queryFn: async () => {
        const payload = await request<ApiEnvelope<MemberDetailData>>(`/credit-plan/members/${userId}`, token);
        return payload.data.user?.role;
      },
      enabled: Boolean(token && enabled),
      staleTime: 5 * 60_000,
    })),
  });

  return userIds.reduce<Map<string, Purchase["role"]>>((roles, userId, index) => {
    const role = queries[index]?.data;
    roles.set(userId, role === "LANDLORD" ? "Broker" : role === "TENANT" ? "Tenant" : "Unknown");
    return roles;
  }, new Map());
}

export function useCreateCreditPlan() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PlanFormValues) => request("/credit-plan", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(values)),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credit-plans"] }),
  });
}

export function useUpdateCreditPlan() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PlanFormValues }) => request(`/credit-plan/${id}`, token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(values)),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credit-plans"] }),
  });
}

export function useDeleteCreditPlan() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(`/credit-plan/${id}`, token, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["credit-plans"] }),
  });
}
