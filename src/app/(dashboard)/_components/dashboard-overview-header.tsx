import { ChevronDown, Coins } from "lucide-react";
import Image from "next/image";

import noUserImage from "../../../../public/assets/images/no-user.jpeg";
import NotificationModal from "@/components/modals/notification-modal";

type DashboardOverviewHeaderProps = {
  title: string;
  description: string;
};

const DashboardOverviewHeader = ({ title, description }: DashboardOverviewHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DCE4EE] bg-white px-4 shadow-[0_2px_10px_rgba(35,52,81,0.04)] sm:px-6">
      <div className="mx-auto flex min-h-[62px] w-full max-w-[1600px] items-center justify-between gap-5 py-2">
        <div className="min-w-0 pl-12 sm:pl-0">
          <h1 className="truncate text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#151D30]">{title}</h1>
          {description && <p className="mt-1 truncate text-[12px] leading-none text-[#5D6B82] sm:text-[13px]">{description}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationModal />

          <a
            href="/credit"
            className="hidden h-[36px] items-center gap-1.5 rounded-[3px] border border-[#F28B19] px-3 text-[11px] font-medium text-[#E97900] transition hover:bg-[#FFF8EF] sm:inline-flex"
          >
            <Coins className="h-3.5 w-3.5" strokeWidth={1.8} />
            28 Credit Balance
          </a>

          <button
            type="button"
            aria-label="Open profile menu"
            className="hidden h-[40px] min-w-[176px] items-center gap-2 rounded-[3px] border border-[#E0E7F0] bg-white px-2.5 text-left transition hover:bg-[#F8FAFD] md:flex"
          >
            <Image src={noUserImage} alt="Iqbal Hasan" className="h-6 w-6 rounded-full object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-medium leading-4 text-[#1B2638]">Iqbal Hasan</span>
              <span className="block truncate text-[9px] leading-3 text-[#718097]">you@company.com</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#748298]" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardOverviewHeader;
