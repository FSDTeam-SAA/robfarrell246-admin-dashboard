"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { total?: number; totalPages?: number };
};

type BackendPurchase = {
  _id: string;
  user?: { email?: string } | string;
  plan?: { title?: string } | string;
  amountPaid: number;
  status: "pending" | "completed" | "failed";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
};

type PurchaseList = {
  purchases: BackendPurchase[];
  paginationInfo?: { totalPages?: number };
};

export type Transaction = {
  chargeId: string;
  date: string;
  time: string;
  customer: string;
  price: string;
  amount: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED";
};

const apiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003/api/v1").replace(/\/$/, "");

function useAccessToken() {
  const { data: session } = useSession();
  return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}

const toTransaction = (purchase: BackendPurchase): Transaction => {
  const createdAt = new Date(purchase.createdAt);
  const user = typeof purchase.user === "object" ? purchase.user : undefined;
  const plan = typeof purchase.plan === "object" ? purchase.plan : undefined;

  return {
    chargeId: purchase.stripePaymentIntentId || purchase.stripeSessionId || purchase._id,
    date: new Intl.DateTimeFormat("en-CA").format(createdAt),
    time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(createdAt),
    customer: user?.email || "—",
    price: plan?.title || "Credit top-up",
    amount: `$${purchase.amountPaid.toFixed(2)}`,
    status: purchase.status === "completed" ? "SUCCEEDED" : purchase.status === "failed" ? "FAILED" : "PENDING",
  };
};

export function useTransactions(page: number) {
  const token = useAccessToken();

  return useQuery<{ transactions: Transaction[]; total: number; totalPages: number }>({
    queryKey: ["transactions", page],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl()}/credit-plan/purchases/all?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = (await response.json()) as ApiEnvelope<PurchaseList>;
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load transactions");

      return {
        transactions: payload.data.purchases.map(toTransaction),
        total: payload.meta?.total ?? payload.data.purchases.length,
        totalPages: payload.meta?.totalPages ?? payload.data.paginationInfo?.totalPages ?? 1,
      };
    },
    enabled: Boolean(token),
    placeholderData: (previousData) => previousData,
  });
}
