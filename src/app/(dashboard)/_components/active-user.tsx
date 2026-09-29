"use client";

import { useState } from "react";

const periods = ["30 days", "7 days", "12 months"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ActiveUser = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>("12 months");

  return (
    <section className="overflow-hidden rounded-md border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">
      <header className="flex flex-col gap-4 border-b border-[#D8DEE8] px-7 py-5 lg:h-[92px] lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <h2 className="text-[25px] font-semibold tracking-[-0.02em] text-[#131B2E]">Active User</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-lg bg-[#EDFCF2] px-3 py-1.5 text-[16px] font-medium leading-4 text-[#08A94E]">
            <span className="h-3 w-3 rounded-full bg-[#08A94E]" /> Completed
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg bg-[#EEF7FF] px-3 py-1.5 text-[16px] font-medium leading-4 text-[#2858F6]">
            <span className="h-3 w-3 rounded-full bg-[#2858F6]" /> In Progress
          </div>
          <div className="ml-0 inline-flex rounded-md border border-[#E1E8F2] bg-[#FBFCFE] p-1 lg:ml-1">
            {periods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-md px-4 py-2 text-[15px] font-medium transition sm:px-5 ${selectedPeriod === period ? "bg-[#285DE7] text-white shadow-sm" : "text-[#55647B] hover:bg-[#F0F4FA]"}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="overflow-hidden px-5 pb-5 pt-4 sm:px-7 sm:pt-5">
        <div className="w-full">
          <svg className="h-auto w-full" viewBox="0 0 940 405" fill="none" role="img" aria-label="Active user completed and in-progress activity by month">
            <g stroke="#DCE5F1" strokeWidth="1">
              <path d="M64 18H926" />
              <path d="M64 88H926" />
              <path d="M64 160H926" />
              <path d="M64 232H926" />
              <path d="M64 304H926" />
              <path d="M64 376H926" />
            </g>

            <g fill="#667A99" fontFamily="inherit" fontSize="16" textAnchor="end">
              <text x="48" y="24">5M</text>
              <text x="48" y="94">1M</text>
              <text x="48" y="166">500k</text>
              <text x="48" y="238">100k</text>
              <text x="48" y="310">50k</text>
              <text x="48" y="382">0</text>
            </g>

            <path
              d="M64 376 C88 292 109 218 137 183 C165 147 190 135 217 139 C245 142 254 182 279 223 C304 264 336 282 373 289 C410 296 430 286 451 282 C475 278 502 267 531 269 C562 272 575 290 603 311 C630 331 661 331 686 319 C713 307 735 263 764 204 C792 145 811 139 837 147 C867 156 889 170 926 168"
              stroke="#159E4A"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />
            <path
              d="M64 376 C91 276 112 181 140 121 C167 65 191 47 218 54 C248 61 265 115 293 158 C321 202 340 228 373 237 C405 246 425 247 452 237 C479 227 507 213 535 219 C564 225 578 243 592 284 C606 326 628 363 658 370 C690 378 711 357 732 318 C758 271 782 195 811 166 C838 138 858 142 881 151 C903 160 915 164 926 171"
              stroke="#285DE7"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />

            <g fill="#667A99" fontFamily="inherit" fontSize="16" textAnchor="middle">
              {months.map((month, index) => (
                <text key={month} x={64 + index * 78.36} y="400">{month}</text>
              ))}
            </g>
            <g fill="#667A99" fontSize="14" textAnchor="middle">
              {months.slice(0, -1).map((month, index) => (
                <text key={`${month}-divider`} x={103 + index * 78.36} y="400">·</text>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ActiveUser;
