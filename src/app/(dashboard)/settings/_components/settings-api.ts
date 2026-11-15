"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type Profile = {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  profileImage?: string;
  creditBalance?: number;
};

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

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

export function useProfile() {
  const token = useAccessToken();
  return useQuery<Profile>({
    queryKey: ["admin-profile"],
    queryFn: async () => (await request<ApiEnvelope<Profile>>("/user/me", token)).data,
    enabled: Boolean(token),
  });
}

export function useUpdateProfile() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Pick<Profile, "name" | "companyName" | "phone">) => request<ApiEnvelope<Profile>>("/user/me", token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-profile"] }),
  });
}

export function useUploadAvatar() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, hasAvatar }: { file: File; hasAvatar: boolean }) => {
      const formData = new FormData();
      formData.append("profileImage", file);
      return request<ApiEnvelope<Profile>>("/user/upload-avatar", token, {
        method: hasAvatar ? "PUT" : "POST",
        body: formData,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-profile"] }),
  });
}

export function useChangePassword() {
  const token = useAccessToken();
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => request("/auth/change-password", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
  });
}
