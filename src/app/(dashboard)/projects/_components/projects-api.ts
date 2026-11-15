"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: { total?: number; totalPages?: number };
};

type BackendAnalysis = {
  _id: string;
  status?: string;
  user?: { name?: string; email?: string; role?: string } | string | null;
  property?: {
    address?: string;
    suite_name?: string;
    state_county?: string;
    property_type?: string;
    square_footage_sf?: number;
    previous_tenant?: string;
    previous_use?: string;
  };
  lease_terms?: { asking_base_rent?: number; rent_calculation_unit?: string; lease_type?: string; tenant_improvement_level?: string; landlord_work_contribution?: number; rentable_square_footage?: number; desired_lease_term?: string; preferred_categories?: string[]; excluded_categories?: string[]; landlord_notes?: string };
  space_condition?: {
    current_condition?: string;
    ceiling_height_ft?: number;
    parking_availability?: string;
    signage_availability?: string;
    zoning_permitted_use?: string;
  };
  systems?: {
    plumbing?: { condition?: string; work_needed?: string[]; requires_additional_plumbing?: string };
    hvac?: { responsibility?: string; condition?: string; existing_units?: number; additional_capacity_required?: string; work_needed?: string[] };
    electrical?: { responsibility?: string; existing_service?: string; condition?: string; work_needed?: string[]; preferred_upgrade?: string };
    fire_protection?: { responsibility?: string; condition?: string; sprinkler_status?: string; work_needed?: string[] };
    gas?: { condition?: string; work_needed?: string[]; requires_natural_gas?: string };
  };
  analysis_preferences?: {
    opening_timeline?: string;
    preferred_tenant_quality?: string;
    business_categories?: string;
    ai_instructions?: string;
  };
};

export type DashboardProject = {
  id: string;
  address: string;
  location: string;
  broker: string;
  email: string;
  spaceType: string;
  squareFootage: string;
  baseRent: string;
  status: string;
  property: NonNullable<BackendAnalysis["property"]>;
  leaseTerms: NonNullable<BackendAnalysis["lease_terms"]>;
  spaceCondition: NonNullable<BackendAnalysis["space_condition"]>;
  systems: NonNullable<BackendAnalysis["systems"]>;
  preferences: NonNullable<BackendAnalysis["analysis_preferences"]>;
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
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers },
  });
  const payload = await response.json();
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "Request failed");
  return payload;
}

const formatMoney = (value?: number) => value == null ? "—" : `$${value.toLocaleString()}`;
const toTitleCase = (value?: string) => (value || "Draft").replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());

const toDashboardProject = (analysis: BackendAnalysis): DashboardProject => {
  const user = typeof analysis.user === "object" ? analysis.user : undefined;
  const property = analysis.property || {};

  return {
    id: analysis._id,
    address: property.address || "Address unavailable",
    location: property.suite_name || property.state_county || "—",
    broker: user?.name || "Unassigned",
    email: user?.email || "—",
    spaceType: property.property_type || "—",
    squareFootage: property.square_footage_sf == null ? "—" : `${property.square_footage_sf.toLocaleString()} SF`,
    baseRent: formatMoney(analysis.lease_terms?.asking_base_rent),
    status: toTitleCase(analysis.status),
    property,
    leaseTerms: analysis.lease_terms || {},
    spaceCondition: analysis.space_condition || {},
    systems: analysis.systems || {},
    preferences: analysis.analysis_preferences || {},
  };
};

export function usePropertyAnalyses({ page, search }: { page: number; search: string }) {
  const token = useAccessToken();
  return useQuery<{ projects: DashboardProject[]; total: number; totalPages: number }>({
    queryKey: ["property-analyses", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search.trim()) params.set("search", search.trim());
      const payload = await request<ApiEnvelope<BackendAnalysis[]>>(`/property-analyses?${params.toString()}`, token);
      return {
        projects: payload.data.map(toDashboardProject),
        total: payload.meta?.total ?? payload.data.length,
        totalPages: payload.meta?.totalPages ?? 1,
      };
    },
    enabled: Boolean(token),
    placeholderData: (previousData) => previousData,
  });
}

export function usePropertyAnalysis(id: string) {
  const token = useAccessToken();
  return useQuery<DashboardProject>({
    queryKey: ["property-analysis", id],
    queryFn: async () => {
      const payload = await request<ApiEnvelope<BackendAnalysis>>(`/property-analyses/${id}`, token);
      return toDashboardProject(payload.data);
    },
    enabled: Boolean(token && id),
  });
}

export function useDeletePropertyAnalysis() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => request(`/property-analyses/${id}`, token, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["property-analyses"] }),
  });
}
