"use client";

import { useState } from "react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "./api-feedback";
import { useAdminDashboardCharts } from "./admin-dashboard-queries";

const periods = ["7 days", "12 months"] as const;
const rangeByPeriod = { "7 days": "7d", "12 months": "12m" } as const;
const chartBounds = { left: 64, right: 926, top: 18, bottom: 376 };

const formatUsers = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatChartLabel = (label: string, range: "7d" | "12m") => {
  const date = new Date(`${range === "12m" ? `${label}-01` : label}T12:00:00`);
  if (range === "12m") return `${new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)} 26`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
};
const calendarMonth = (label: string) => Number(label.slice(5, 7));

function ChartPanel({ children }: { children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-[3px] border border-[#C9D7E8] bg-white shadow-[0_2px_6px_rgba(24,39,75,0.03)]">{children}</section>;
}

const ActiveUser = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>("12 months");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data, isLoading, isError, error, refetch } = useAdminDashboardCharts(rangeByPeriod[selectedPeriod]);
  const rawPoints = data?.data.activeUsersChart ?? [];
  const points = selectedPeriod === "12 months" ? [...rawPoints].sort((first, second) => calendarMonth(first.label) - calendarMonth(second.label)) : rawPoints;
  const maxValue = Math.max(...points.map((point) => point.activeUsers), 1);
  const chartWidth = chartBounds.right - chartBounds.left;
  const chartHeight = chartBounds.bottom - chartBounds.top;
  const pointX = (index: number) => chartBounds.left + (points.length <= 1 ? chartWidth / 2 : (index * chartWidth) / (points.length - 1));
  const pointY = (value: number) => chartBounds.bottom - (value / maxValue) * chartHeight;
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${pointX(index)} ${pointY(point.activeUsers)}`).join(" ");
  const selectedPoint = activeIndex === null ? undefined : points[activeIndex];
  const yAxis = Array.from({ length: 6 }, (_, index) => Math.round(maxValue - (maxValue * index) / 5));

  const header = <header className="flex flex-col gap-3 border-b border-[#D8DEE8] px-4 py-3 sm:h-[60px] sm:flex-row sm:items-center sm:justify-between sm:py-0"><h2 className="text-[18px] font-semibold leading-none tracking-[-0.02em] text-[#131B2E]">Active User</h2><div className="flex flex-wrap items-center gap-2"><div className="inline-flex items-center gap-1 rounded-md bg-[#EDFCF2] px-2 py-1 text-[11px] font-medium leading-3 text-[#08A94E]"><span className="h-2 w-2 rounded-full bg-[#08A94E]" />Active users</div><div className="inline-flex rounded-[3px] border border-[#E1E8F2] bg-[#FBFCFE] p-0.5">{periods.map((period) => <button key={period} type="button" onClick={() => { setSelectedPeriod(period); setActiveIndex(null); }} className={`rounded-[3px] px-3 py-[7px] text-[10px] font-medium leading-none transition sm:px-3.5 ${selectedPeriod === period ? "bg-[#285DE7] text-white shadow-sm" : "text-[#55647B] hover:bg-[#F0F4FA]"}`}>{period}</button>)}</div></div></header>;

  if (isLoading) return <ChartPanel>{header}<div className="p-4"><ApiLoadingSkeleton rows={4} /></div></ChartPanel>;
  if (isError) return <ChartPanel>{header}<div className="p-4"><ApiErrorState message={error.message} onRetry={() => refetch()} /></div></ChartPanel>;
  if (!points.length) return <ChartPanel>{header}<div className="p-4"><ApiEmptyState message="No active-user data found for this period." /></div></ChartPanel>;

  return <ChartPanel>{header}<div className="overflow-hidden px-4 pb-3 pt-4 sm:px-4"><div className="relative w-full"><svg className="h-auto w-full" viewBox="0 0 940 405" fill="none" role="img" aria-label="Active users by period" onMouseLeave={() => setActiveIndex(null)}><g stroke="#DCE5F1" strokeWidth="1">{yAxis.map((_, index) => <path key={index} d={`M64 ${chartBounds.top + index * (chartHeight / 5)}H926`} />)}</g><g fill="#667A99" fontFamily="inherit" fontSize="16" textAnchor="end">{yAxis.map((value, index) => <text key={index} x="48" y={chartBounds.top + 6 + index * (chartHeight / 5)}>{formatUsers(value)}</text>)}</g><path d={linePath} stroke="#159E4A" strokeDasharray="8 8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />{activeIndex !== null && selectedPoint ? <g pointerEvents="none"><path d={`M${pointX(activeIndex)} ${chartBounds.top}V${chartBounds.bottom}`} stroke="#AFC2DF" strokeDasharray="4 4" strokeWidth="1.5" /><circle cx={pointX(activeIndex)} cy={pointY(selectedPoint.activeUsers)} r="6" fill="white" stroke="#159E4A" strokeWidth="3" /></g> : null}<g>{points.map((point, index) => { const previousX = index === 0 ? chartBounds.left : (pointX(index - 1) + pointX(index)) / 2; const nextX = index === points.length - 1 ? chartBounds.right : (pointX(index) + pointX(index + 1)) / 2; return <rect key={point.label} x={previousX} y={chartBounds.top} width={nextX - previousX} height={chartHeight} fill="transparent" tabIndex={0} role="button" aria-label={`${point.label}: ${formatUsers(point.activeUsers)} active users`} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} onClick={() => setActiveIndex(index)} />; })}</g><g fill="#667A99" fontFamily="inherit" fontSize="14">{points.map((point, index) => <text key={point.label} x={index === points.length - 1 ? 920 : pointX(index)} y="400" textAnchor={index === points.length - 1 ? "end" : index === 0 ? "start" : "middle"}>{formatChartLabel(point.label, rangeByPeriod[selectedPeriod])}</text>)}</g></svg>{selectedPoint && activeIndex !== null ? <div className="pointer-events-none absolute top-3 z-10 w-[164px] rounded-md border border-[#E4EBF4] bg-white px-3 py-2 text-[11px] shadow-[0_5px_16px_rgba(35,51,82,0.14)]" style={{ left: `${(pointX(activeIndex) / 940) * 100}%`, transform: `translateX(${activeIndex > points.length - 3 ? "-100%" : activeIndex === 0 ? "0" : "-35%"})` }} role="status" aria-live="polite"><p className="border-b border-[#EEF1F5] pb-1.5 font-semibold text-[#1D293D]">{formatChartLabel(selectedPoint.label, rangeByPeriod[selectedPeriod])}</p><p className="mt-1.5 flex items-center justify-between gap-3 text-[#159E4A]"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#159E4A]" />Active users</span><b className="font-semibold text-[#1D293D]">{formatUsers(selectedPoint.activeUsers)}</b></p></div> : null}</div></div></ChartPanel>;
};

export default ActiveUser;
