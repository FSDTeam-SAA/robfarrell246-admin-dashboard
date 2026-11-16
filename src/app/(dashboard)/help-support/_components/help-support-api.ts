"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { statusToApi, toSupportTicket, type SupportTicket, type TicketStatus } from "./help-support-types";

type ApiEnvelope<T> = { success: boolean; message: string; data: T; meta?: { total?: number } };
type BackendTicket = Parameters<typeof toSupportTicket>[0];
type TicketListData = { tickets: BackendTicket[] };
export type SupportCards = { totalRequests: number; activeQueue: number; waitingOnUser: number; resolvedClosed: number };

const apiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003/api/v1").replace(/\/$/, "");

function useAccessToken() {
  const { data: session } = useSession();
  return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}

async function request<T>(path: string, token?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
  const payload = await response.json();
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "Request failed");
  return payload;
}

export function useSupportTickets() {
  const token = useAccessToken();
  return useQuery<{ tickets: SupportTicket[]; total: number }>({
    queryKey: ["admin-support-tickets"],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<TicketListData>>("/help-support/admin/all?limit=100", token);
      return {
        tickets: payload.data.tickets.map(toSupportTicket),
        total: payload.meta?.total ?? payload.data.tickets.length,
      };
    },
    enabled: Boolean(token),
  });
}

export function useSupportCards() {
  const token = useAccessToken();
  return useQuery<SupportCards>({
    queryKey: ["admin-support-cards"],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<SupportCards>>("/help-support/admin/cards", token);
      return payload.data;
    },
    enabled: Boolean(token),
  });
}

export function useSupportTicket(ticketId: string | null) {
  const token = useAccessToken();
  return useQuery<SupportTicket>({
    queryKey: ["admin-support-ticket", ticketId],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<BackendTicket>>(`/help-support/${ticketId}`, token);
      return toSupportTicket(payload.data);
    },
    enabled: Boolean(token && ticketId),
  });
}

export function useUpdateTicketStatus(ticketId: string) {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: TicketStatus) => request(`/help-support/${ticketId}/status`, token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusToApi[status] }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-cards"] });
    },
  });
}

export function useReplyToTicket(ticketId: string) {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => request(`/help-support/${ticketId}/reply`, token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support-ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-cards"] });
    },
  });
}
