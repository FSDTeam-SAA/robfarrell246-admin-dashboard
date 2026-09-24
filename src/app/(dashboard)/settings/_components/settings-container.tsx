import { KeyRound, UserRound } from "lucide-react";
import Link from "next/link";

const SettingsContainer = () => {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-3 px-4 py-6 sm:px-6">
        <Link className="group flex h-11 w-full items-center gap-2.5 rounded-[3px] bg-white px-3 text-[#000044] shadow-[0_3px_8px_rgba(31,37,50,0.12)] transition-colors hover:bg-[#F8F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000044]" href="/settings/personal-information">
          <UserRound className="size-4 stroke-[2]" />
          <span className="text-xs font-semibold">Profile</span>
        </Link>

        <Link className="group flex h-11 w-full items-center gap-2.5 rounded-[3px] bg-white px-3 text-[#000044] shadow-[0_3px_8px_rgba(31,37,50,0.12)] transition-colors hover:bg-[#F8F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000044]" href="/settings/change-password">
          <KeyRound className="size-4 stroke-[2]" />
          <span className="text-xs font-semibold">Password</span>
        </Link>
    </main>
  );
};

export default SettingsContainer;
