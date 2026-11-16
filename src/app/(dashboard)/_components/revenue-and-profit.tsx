"use client";

import { useState } from "react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "./api-feedback";
import { useAdminDashboardCharts } from "./admin-dashboard-queries";

const periods = ["7 days", "12 months"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const yLabels = ["$300k", "$225k", "$150k", "$75k", "$0k"];

const chartRange = {
  "7 days": "7d",
  "12 months": "12m",
} as const;

const formatChartLabel = (label: string, range: "7d" | "12m") => {
  const date = new Date(`${range === "12m" ? `${label}-01` : label}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", range === "12m" ? { month: "short" } : { month: "short", day: "numeric" }).format(date);
};
const calendarMonth = (label: string) => Number(label.slice(5, 7));
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const RevenueAndProfit = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>("12 months");
  const [activeMonth, setActiveMonth] = useState(5);
  const { data, isLoading, isError, error, refetch } = useAdminDashboardCharts(chartRange[selectedPeriod]);
  const rawChartData = data?.data.revenueChart ?? [];
  const chartData = selectedPeriod === "12 months" ? [...rawChartData].sort((first, second) => calendarMonth(first.label) - calendarMonth(second.label)) : rawChartData;
  const maxValue = Math.max(
    ...chartData.flatMap(({ revenue, profit }) => [revenue, profit]),
    1,
  );
  const activeIndex = Math.min(activeMonth, Math.max(chartData.length - 1, 0));
  const tooltipOnRightEdge = activeIndex >= chartData.length - 2;

  if (isLoading) return <ApiLoadingSkeleton rows={5} />;
  if (isError) return <ApiErrorState message={error.message} onRetry={() => refetch()} />;
  if (chartData.length === 0) return <ApiEmptyState message="No revenue data found for this period." />;

  return (
    <section className="overflow-hidden rounded-md border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">
      <header className="flex h-[60px] items-center justify-between border-b border-[#D8DEE8] px-5">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#131B2E]">Revenue &amp; Profit</h2>
        <div className="inline-flex rounded-[3px] border border-[#E1E8F2] bg-[#FBFCFE] p-0.5">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-[3px] px-3 py-[7px] text-[10px] font-medium leading-none transition sm:px-3.5 ${selectedPeriod === period ? "bg-[#285DE7] text-white shadow-sm" : "text-[#55647B] hover:bg-[#F0F4FA]"}`}
            >
              {period}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-hidden px-3 pb-3 pt-4 sm:px-4">
        <div className="relative w-full">
          <svg className="h-auto w-full" viewBox="0 0 760 348" fill="none" role="img" aria-label="Revenue and profit by month">
            <g fill="#F8FAFD">
              {Array.from({ length: 12 }).flatMap((_, row) =>
                Array.from({ length: 66 }).map((__, column) => (
                  <rect key={`${row}-${column}`} x={56 + column * 10.35} y={4 + row * 13.2} width="8.5" height="11" rx="1.5" />
                )),
              )}
            </g>

            <g fill="#64758E" fontFamily="inherit" fontSize="15" textAnchor="end">
              {yLabels.map((label, index) => <text key={label} x="45" y={18 + index * 77}>{label}</text>)}
            </g>

            {chartData.map((point, monthIndex) =>
              Array.from({ length: 5 }).map((_, columnIndex) => {
                const x = 57 + monthIndex * (657 / Math.max(chartData.length, 1)) + columnIndex * 10.35;
                const hoverable = monthIndex === activeMonth;
                const revenueHeight = Math.max(1, Math.round((point.revenue / maxValue) * 11));
                const profitHeight = Math.max(1, Math.round((point.profit / maxValue) * 11));
                const blocks = Array.from({ length: revenueHeight });
                const paleBlocks = Array.from({ length: profitHeight });

                return (
                  <g key={`${monthIndex}-${columnIndex}`} onMouseEnter={() => setActiveMonth(monthIndex)} className="cursor-pointer">
                    {blocks.map((_, blockIndex) => (
                      <rect key={`dark-${blockIndex}`} x={x} y={281 - blockIndex * 13.2} width="8.5" height="11" rx="1.5" fill={hoverable ? "#536983" : "#64758E"} />
                    ))}
                    {paleBlocks.map((_, blockIndex) => (
                      <rect key={`light-${blockIndex}`} x={x} y={281 - (revenueHeight + blockIndex) * 13.2} width="8.5" height="11" rx="1.5" fill={hoverable ? "#D5DFEB" : "#E0E7F0"} />
                    ))}
                  </g>
                );
              }),
            )}

            <g fill="#667A99" fontFamily="inherit" fontSize="14" textAnchor="middle">
              {chartData.map((point, index) => <text key={point.label} x={70 + index * (657 / Math.max(chartData.length, 1))} y="325">{formatChartLabel(point.label, chartRange[selectedPeriod])}</text>)}
            </g>
            <g fill="#667A99" fontSize="13" textAnchor="middle">
              {chartData.slice(0, -1).map((point, index) => <text key={`${point.label}-dot`} x={97.5 + index * (657 / Math.max(chartData.length, 1))} y="325">·</text>)}
            </g>
          </svg>

          <div
            className="pointer-events-none absolute w-[109px] rounded-md bg-white px-2.5 py-2 text-[11px] text-[#5D6D85] shadow-[0_4px_12px_rgba(35,51,82,0.10)]"
            style={tooltipOnRightEdge ? { right: "2%", top: "46px" } : { left: `${12 + activeMonth * 7.2}%`, top: "46px" }}
          >
            <p className="border-b border-[#EEF1F5] pb-1 font-medium text-[#1D293D]">{chartData[activeIndex] ? formatChartLabel(chartData[activeIndex].label, chartRange[selectedPeriod]) : months[activeMonth]}</p>
            <p className="mt-1 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#64758E]" />Revenue <b className="text-[#1D293D]">{formatCurrency(chartData[activeIndex]?.revenue ?? 0)}</b></p>
            <p className="mt-1 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#64758E]" />Profit <b className="text-[#1D293D]">{formatCurrency(chartData[activeIndex]?.profit ?? 0)}</b></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueAndProfit;
