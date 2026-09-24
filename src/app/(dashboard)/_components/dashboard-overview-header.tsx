import React from "react";

const DashboardOverviewHeader = ({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E7E2DA] bg-[#0B5CFF08] px-4 py-4 pl-16 shadow-[0_2px_10px_rgba(50,59,44,0.04)] backdrop-blur-md sm:px-6 sm:py-5 sm:pl-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex items-start justify-between gap-4">
            <div><h1 className="text-xl font-bold leading-tight tracking-[-0.02em] text-black sm:text-2xl lg:text-[28px]">{title}</h1>{description && <p className="mt-1 max-w-3xl text-xs font-normal leading-relaxed text-[#54595E] sm:text-sm">{description}</p>}</div>
          {action}
        </div>
      </div>
    </header>
  );
};

export default DashboardOverviewHeader;










