"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Search, UserRoundCog } from "lucide-react";
import { useMemo, useState } from "react";
import SuspendUserModal from "./suspend-user-modal";

type User = {
  name: string;
  email: string;
  role: "BROKER" | "TENANT";
  plan: string;
  credits: number;
  status: "ACTIVE" | "SUSPENDED";
};

const initialUsers: User[] = [
  { name: "Sarah Jenkins, CCIM", email: "sarah.jenkins@austinretailpartners.com", role: "BROKER", plan: "plan_pro_broker", credits: 572, status: "ACTIVE" },
  { name: "Marcus Vance", email: "marcus@hospitality.co", role: "TENANT", plan: "plan_tenant_growth", credits: 676, status: "ACTIVE" },
  { name: "Elena Rostova", email: "elena@dallascreadvisors.com", role: "BROKER", plan: "plan_starter_broker", credits: 99, status: "ACTIVE" },
  { name: "David Chen", email: "david@matchacraft.com", role: "TENANT", plan: "plan_tenant_growth", credits: 0, status: "SUSPENDED" },
];

const UsersContainer = () => {
  const [userList, setUserList] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"ALL" | User["role"]>("ALL");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const totalPages = 2;

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return userList.filter((user) => {
      const matchesQuery = !normalizedQuery || `${user.name} ${user.email}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (role === "ALL" || user.role === role);
    });
  }, [query, role, userList]);

  const changeRole = (value: "ALL" | User["role"]) => {
    setRole(value);
    setPage(1);
  };

  const suspendSelectedUser = () => {
    if (!selectedUser) return;

    setUserList((currentUsers) => currentUsers.map((user) => (
      user.email === selectedUser.email ? { ...user, status: "SUSPENDED" } : user
    )));
    setSelectedUser(null);
  };

  return (
    <section className="p-4 sm:p-6">
      <div className="overflow-hidden rounded-[3px] border border-[#E0E7F0] bg-white">
        <div className="flex min-h-[44px] flex-col justify-between gap-3 bg-[#2948B4] px-3 py-2 sm:flex-row sm:items-center sm:px-3.5">
          <label className="relative block w-full sm:w-[235px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77849A]" strokeWidth={1.6} />
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search..." aria-label="Search users" className="h-[24px] w-full rounded-[3px] border-0 bg-white py-1 pl-7 pr-9 text-[11px] text-[#26364D] outline-none placeholder:text-[#8A96A8] focus:ring-2 focus:ring-white/60" />
            <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#D7DEE8] bg-[#F7F9FC] px-1 py-px text-[8px] text-[#7E8999]">⌘K</kbd>
          </label>

          <label className="flex items-center justify-end gap-2 text-[11px] text-white">
            <span>Filter Role:</span>
            <span className="relative">
              <select value={role} onChange={(event) => changeRole(event.target.value as "ALL" | User["role"])} aria-label="Filter users by role" className="h-[24px] appearance-none rounded-[3px] border-0 bg-white py-1 pl-2 pr-6 text-[10px] text-[#344054] outline-none">
                <option value="ALL">ALL Roles</option><option value="BROKER">Broker</option><option value="TENANT">Tenant</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#526174]" />
            </span>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead className="bg-[#E6EBF3] text-[10px] font-medium uppercase text-[#4F5E73]"><tr className="h-[34px]"><th className="w-[23%] px-4 font-medium">User &amp; Organization</th><th className="w-[10%] px-3 font-medium">Role</th><th className="w-[22%] px-3 font-medium">Plan</th><th className="w-[16%] px-3 text-center font-medium">Credits</th><th className="w-[17%] px-3 text-center font-medium">Status</th><th className="w-[12%] px-3 text-center font-medium normal-case">Action</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isActive = user.status === "ACTIVE";
                return <tr key={user.email} className="h-[49px] border-b border-[#E5EAF1] last:border-b-0">
                  <td className="px-4 py-2"><p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">{user.name}</p><p className="max-w-[210px] truncate text-[10px] leading-3 text-[#728096]">{user.email}</p></td>
                  <td className="px-3 py-2"><span className={user.role === "BROKER" ? "rounded bg-[#EDF4FF] px-1.5 py-0.5 text-[9px] font-medium text-[#2D6EEA]" : "rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#10A85B]"}>{user.role}</span></td>
                  <td className="px-3 py-2 text-[10px] text-[#2666E8]">{user.plan}</td>
                  <td className="px-3 py-2 text-center"><span className="rounded bg-[#FFF8E8] px-1.5 py-0.5 text-[9px] font-medium text-[#F08A00]">{user.credits} Credits</span></td>
                  <td className="px-3 py-2 text-center"><span className={isActive ? "inline-flex items-center gap-1 rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#0AA656]" : "inline-flex items-center gap-1 rounded bg-[#FFF0F1] px-1.5 py-0.5 text-[9px] font-medium text-[#F22C35]"}><span className={isActive ? "h-1.5 w-1.5 rounded-full bg-[#0AB85D]" : "h-1.5 w-1.5 rounded-full bg-[#F62D39]"} />{user.status}</span></td>
                  <td className="px-3 py-2 text-center"><button type="button" onClick={() => setSelectedUser(user)} disabled={!isActive} aria-label={isActive ? `Suspend ${user.name}` : `${user.name} is already suspended`} className={isActive ? "inline-flex h-[25px] w-[34px] items-center justify-center rounded-sm bg-[#FFF2F4] text-[#EE3440] transition hover:bg-[#FFE3E6]" : "inline-flex h-[25px] w-[34px] cursor-not-allowed items-center justify-center rounded-sm bg-[#FFF8E8] text-[#F09200] opacity-75"}><UserRoundCog className="h-3.5 w-3.5" strokeWidth={1.55} /></button></td>
                </tr>;
              })}
              {filteredUsers.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[12px] text-[#718097]">No users match your search.</td></tr>}
            </tbody>
          </table>
        </div>

        <footer className="flex min-h-[45px] items-center justify-between gap-3 border-t border-[#E5EAF1] px-3.5 py-2 text-[10px] text-[#526174]"><span>12 requests · Page {page} of {totalPages}</span><div className="flex items-center gap-1.5"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button><span className="inline-flex h-[25px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px]">{page}</span><button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button></div></footer>
      </div>
      <SuspendUserModal isOpen={selectedUser !== null} userName={selectedUser?.name ?? null} onClose={() => setSelectedUser(null)} onConfirm={suspendSelectedUser} />
    </section>
  );
};

export default UsersContainer;
