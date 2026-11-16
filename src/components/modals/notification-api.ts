"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type AppNotification = {
  _id: string;
  type:
    | "ANALYSIS_READY"
    | "RENDERINGS_READY"
    | "AI_RUN_FAILED"
    | "CREDITS_ADDED"
    | "TICKET_REPLY"
    | "TICKET_STATUS"
    | "NEW_TICKET"
    | "TICKET_CUSTOMER_REPLY"
    | "NEW_PURCHASE";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  refId?: string | null;
};

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

type NotificationListData = {
  unreadCount: number;
  notifications: AppNotification[];
  paginationInfo: { currentPage: number; totalPages: number };
};

const notificationKey = ["notifications"] as const;

const apiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003/api/v1").replace(/\/$/, "");

function useAccessToken() {
  const { data: session } = useSession();
  return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}

function usePageVisible() {
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    const updatePageVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", updatePageVisibility);
    updatePageVisibility();
    return () => document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);

  return pageVisible;
}

async function request<T>(path: string, token?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
  const payload = await response.json();
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "Notification request failed");
  return payload;
}

export function useNotificationUnreadCount() {
  const token = useAccessToken();
  const pageVisible = usePageVisible();

  return useQuery<number>({
    queryKey: [...notificationKey, "unread-count"],
    queryFn: async () => (await request<ApiEnvelope<{ unreadCount: number }>>("/notifications/unread-count", token)).data.unreadCount,
    enabled: Boolean(token),
    refetchInterval: pageVisible ? 45_000 : false,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });
}

export function useNotifications(filter: "all" | "unread", open: boolean) {
  const token = useAccessToken();

  return useQuery<NotificationListData>({
    queryKey: [...notificationKey, "list", filter],
    queryFn: async () => (
      await request<ApiEnvelope<NotificationListData>>(
        `/notifications?filter=${filter}&page=1&limit=10`,
        token,
      )
    ).data,
    enabled: Boolean(token && open),
  });
}

function useNotificationMutation<T>(mutationFn: (token: string | undefined) => Promise<T>) {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mutationFn(token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKey }),
  });
}

export function useMarkAllNotificationsRead() {
  return useNotificationMutation((token) => request("/notifications/read-all", token, { method: "PUT" }));
}

export function useMarkNotificationRead() {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => request(`/notifications/${notificationId}/read`, token, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKey }),
  });
}

export function useDeleteNotification() {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => request(`/notifications/${notificationId}`, token, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKey }),
  });
}
