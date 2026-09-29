import { ArrowRight, CircleUserRound } from "lucide-react";

const recentUsers = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@agency.com",
    type: "BROKER",
    plan: "plan_pro_broker",
    credits: "572 Credits",
    status: "ACTIVE",
  },
  {
    name: "Marcus Vance",
    email: "marcus@vance.com",
    type: "TENANT",
    plan: "plan_tenant_growth",
    credits: "676 Credits",
    status: "ACTIVE",
  },
  {
    name: "Elena Rostova",
    email: "elena@dallascre.com",
    type: "BROKER",
    plan: "plan_starter_broker",
    credits: "99 Credits",
    status: "ACTIVE",
  },
  {
    name: "David Chen",
    email: "david@matchacase.com",
    type: "TENANT",
    plan: "plan_tenant_growth",
    credits: "0 Credits",
    status: "SUSPENDED",
  },
] as const;

const RecentUser = () => {
  return (
    <section className="overflow-hidden rounded-md border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">
      <header className="flex h-[68px] items-center justify-between px-6 sm:px-[25px]">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#131B2E]">
          Recent User
        </h2>
        <a
          href="/users"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#1F64FF] transition hover:text-[#0B4DE2]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </a>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse">
          <thead className="bg-[#E7ECF4] text-left">
            <tr className="h-[62px] text-[16px] font-medium text-[#303A4C]">
              <th className="w-[21%] px-6 font-medium">User</th>
              <th className="w-[14%] px-3 font-medium">Type</th>
              <th className="w-[18%] px-3 font-medium">Plan</th>
              <th className="w-[17%] px-3 font-medium">Credits</th>
              <th className="w-[17%] px-3 font-medium">Status</th>
              <th className="w-[13%] px-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => {
              const isActive = user.status === "ACTIVE";
              const isBroker = user.type === "BROKER";

              return (
                <tr key={user.email} className="h-[83px] border-t border-[#D8DEE8] text-[15px] text-[#192238]">
                  <td className="px-6 py-3">
                    <p className="max-w-[145px] truncate text-[16px] font-medium leading-5">{user.name}</p>
                    <p className="mt-1 max-w-[145px] truncate text-[13px] leading-none text-[#5B6980]">{user.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[14px] font-medium leading-4 ${isBroker ? "bg-[#EEF6FF] text-[#1F5AFF]" : "bg-[#EDFCF2] text-[#08A94E]"}`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block max-w-[130px] break-words text-[15px] leading-[17px] text-[#1F5EFF]">{user.plan}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex rounded-md bg-[#FFF9EC] px-2.5 py-0.5 text-[14px] leading-4 text-[#F07800]">{user.credits}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[14px] font-medium leading-4 ${isActive ? "bg-[#EDFCF2] text-[#08A94E]" : "bg-[#FFF0F1] text-[#EF2332]"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-[#08A94E]" : "bg-[#EF2332]"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      aria-label={`Manage ${user.name}`}
                      className={`inline-flex h-[38px] w-[58px] items-center justify-center ${isActive ? "bg-[#FFF2F2] text-[#F3212C]" : "bg-[#FFF9EB] text-[#EE8600]"} transition hover:brightness-95`}
                    >
                      <CircleUserRound className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentUser;
