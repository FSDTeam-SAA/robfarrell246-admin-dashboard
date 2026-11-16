"use client";

import { ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, Search, UserRoundCog, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import SuspendUserModal from "./suspend-user-modal";
import { type DashboardUser, useAdminUsers, useSetUserSuspension, useUserPlanLookup } from "./users-api";

const EMPTY_USERS: DashboardUser[] = [];

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

const UsersContainer = () => {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"ALL" | DashboardUser["role"]>("ALL");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query);
  const usersQuery = useAdminUsers({ page, search: debouncedQuery, role });
  const setSuspension = useSetUserSuspension();
  const data = usersQuery.data;
  const users = data?.users ?? EMPTY_USERS;
  const userPlans = useUserPlanLookup(users);
  const usersWithPlans = users.map((user) => ({ ...user, plan: userPlans.get(user.id) ?? user.plan }));
  const isSearching = query.trim() !== debouncedQuery.trim() || usersQuery.isFetching;
  const hasActiveFilters = Boolean(debouncedQuery.trim()) || role !== "ALL";

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const changeRole = (value: "ALL" | DashboardUser["role"]) => {
    setRole(value);
    setPage(1);
  };

  const updateSuspension = () => {
    if (!selectedUser) return;
    const isSuspended = selectedUser.status === "ACTIVE";
    setSuspension.mutate({ userId: selectedUser.id, isSuspended }, {
      onSuccess: () => {
        toast.success(isSuspended ? "User suspended" : "User reactivated");
        setSelectedUser(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  if (usersQuery.isLoading) return <section className="p-4 sm:p-6"><ApiLoadingSkeleton rows={6} /></section>;
  if (usersQuery.isError) return <section className="p-4 sm:p-6"><ApiErrorState message={usersQuery.error.message} onRetry={() => usersQuery.refetch()} /></section>;
  if (!data || (data.total === 0 && !hasActiveFilters)) return <section className="p-4 sm:p-6"><ApiEmptyState message="No users found." /></section>;

  return (
    <section className="p-4 sm:p-6">
      <div className="overflow-hidden rounded-[3px] border border-[#E0E7F0] bg-white">
        <div className="flex min-h-[44px] flex-col justify-between gap-3 bg-[#2948B4] px-3 py-2 sm:flex-row sm:items-center sm:px-3.5">
          <div className="flex items-center gap-2"><label className="relative block w-full sm:w-[235px]"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77849A]" strokeWidth={1.6} /><input ref={searchInputRef} type="text" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }} placeholder="Search by name or email..." aria-label="Search users by name or email" className="h-[24px] w-full rounded-[3px] border-0 bg-white py-1 pl-7 pr-9 text-[11px] text-[#26364D] outline-none placeholder:text-[#8A96A8] focus:ring-2 focus:ring-white/60" />{query ? <button type="button" onClick={() => { setQuery(""); setPage(1); }} aria-label="Clear search" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#77849A] hover:bg-[#EEF2F7] hover:text-[#26364D]"><X className="h-3 w-3" /></button> : <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#D7DEE8] bg-[#F7F9FC] px-1 py-px text-[8px] text-[#7E8999]">⌘K</kbd>}</label>{isSearching && <span className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] text-white/90"><LoaderCircle className="h-3 w-3 animate-spin" />Searching...</span>}</div>
          <label className="flex items-center justify-end gap-2 text-[11px] text-white"><span>Filter Role:</span><span className="relative"><select value={role} onChange={(event) => changeRole(event.target.value as "ALL" | DashboardUser["role"])} aria-label="Filter users by role" className="h-[24px] appearance-none rounded-[3px] border-0 bg-white py-1 pl-2 pr-6 text-[10px] text-[#344054] outline-none"><option value="ALL">ALL Roles</option><option value="BROKER">Broker</option><option value="TENANT">Tenant</option></select><ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#526174]" /></span></label>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[840px] border-collapse text-left"><thead className="bg-[#E6EBF3] text-[10px] font-medium uppercase text-[#4F5E73]"><tr className="h-[34px]"><th className="w-[23%] px-4 font-medium">User &amp; Organization</th><th className="w-[10%] px-3 font-medium">Role</th><th className="w-[22%] px-3 font-medium">Plan</th><th className="w-[16%] px-3 text-center font-medium">Credits</th><th className="w-[17%] px-3 text-center font-medium">Status</th><th className="w-[12%] px-3 text-center font-medium normal-case">Action</th></tr></thead><tbody>{usersWithPlans.map((user) => { const isActive = user.status === "ACTIVE"; return <tr key={user.id} className="h-[49px] border-b border-[#E5EAF1] last:border-b-0"><td className="px-4 py-2"><p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">{user.name}</p><p className="max-w-[210px] truncate text-[10px] leading-3 text-[#728096]">{user.email}</p></td><td className="px-3 py-2"><span className={user.role === "BROKER" ? "rounded bg-[#EDF4FF] px-1.5 py-0.5 text-[9px] font-medium text-[#2D6EEA]" : "rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#10A85B]"}>{user.role}</span></td><td className="px-3 py-2 text-[10px] text-[#728096]">{user.plan || "No plan"}</td><td className="px-3 py-2 text-center"><span className="rounded bg-[#FFF8E8] px-1.5 py-0.5 text-[9px] font-medium text-[#F08A00]">{user.credits} Credits</span></td><td className="px-3 py-2 text-center"><span className={isActive ? "inline-flex items-center gap-1 rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#0AA656]" : "inline-flex items-center gap-1 rounded bg-[#FFF0F1] px-1.5 py-0.5 text-[9px] font-medium text-[#F22C35]"}><span className={isActive ? "h-1.5 w-1.5 rounded-full bg-[#0AB85D]" : "h-1.5 w-1.5 rounded-full bg-[#F62D39]"} />{user.status}</span></td><td className="px-3 py-2 text-center"><button type="button" onClick={() => setSelectedUser(user)} aria-label={`${isActive ? "Suspend" : "Reactivate"} ${user.name}`} className={isActive ? "inline-flex h-[25px] w-[34px] items-center justify-center rounded-sm bg-[#FFF2F4] text-[#EE3440] transition hover:bg-[#FFE3E6]" : "inline-flex h-[25px] w-[34px] items-center justify-center rounded-sm bg-[#EAFBF1] text-[#0AA656] transition hover:bg-[#DDF7E8]"}><UserRoundCog className="h-3.5 w-3.5" strokeWidth={1.55} /></button></td></tr>; })}{usersWithPlans.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[12px] text-[#718097]">No users match your search.</td></tr>}</tbody></table></div>
        <footer className="flex min-h-[45px] items-center justify-between gap-3 border-t border-[#E5EAF1] px-3.5 py-2 text-[10px] text-[#526174]"><span>{data.total} requests · Page {page} of {data.totalPages}</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button><span className="inline-flex h-[25px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px]">{page}</span><button type="button" onClick={() => setPage((current) => Math.min(data.totalPages, current + 1))} disabled={page === data.totalPages} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button></div></footer>
      </div>
      <SuspendUserModal isOpen={selectedUser !== null} userName={selectedUser?.name ?? null} isSuspended={selectedUser?.status === "SUSPENDED"} isPending={setSuspension.isPending} onClose={() => setSelectedUser(null)} onConfirm={updateSuspension} />
    </section>
  );
};

export default UsersContainer;
