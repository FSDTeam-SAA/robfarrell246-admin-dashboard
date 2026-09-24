"use client";

import { CalendarDays, Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type RevenuePoint = { month: string; value: number };

const defaultRevenue: RevenuePoint[] = [
  { month: "Jan", value: 40 }, { month: "Feb", value: 190 }, { month: "Mar", value: 120 },
  { month: "Apr", value: 85 }, { month: "May", value: 295 }, { month: "Jun", value: 500 },
  { month: "Jul", value: 470 }, { month: "Aug", value: 355 }, { month: "Sep", value: 610 },
  { month: "Oct", value: 410 }, { month: "Nov", value: 215 }, { month: "Dec", value: 290 },
];

const formatCurrency = (value: number) => `AED ${new Intl.NumberFormat("en-US").format(value)}`;

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-[#E7E9ED] bg-white px-3 py-2.5 shadow-[0_5px_15px_rgba(0,0,0,0.12)]"><p className="text-[9px] text-[#8C929A]">This month</p><p className="text-sm font-semibold text-[#24272C]">{formatCurrency(payload[0].value)}</p><p className="text-[10px] text-[#8C929A]">{label}</p></div>;
}

export default function TotalRevenue({ data = defaultRevenue }: { data?: RevenuePoint[] }) {
  return <section className="mx-4 rounded-lg border border-[#E5E7EB] bg-white px-3 py-4 sm:mx-6 sm:px-4 lg:px-5" aria-labelledby="total-revenue-title">
    <div className="mb-3 flex items-center justify-between gap-3"><h2 id="total-revenue-title" className="flex items-center gap-1.5 text-sm font-semibold text-[#24272C]">Total Revenue <Info className="h-3.5 w-3.5 text-[#92979E]" strokeWidth={1.7} /></h2><button type="button" className="inline-flex items-center gap-1 rounded border border-[#D9DDE2] px-2 py-1 text-[10px] text-[#5E646C] transition hover:border-[#1769FF] hover:text-[#1769FF]">June, 2026 <CalendarDays className="h-3 w-3 text-[#1769FF]" strokeWidth={1.7} /></button></div>
    <div className="h-[185px] w-full sm:h-[205px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1769FF" stopOpacity={0.18} /><stop offset="100%" stopColor="#1769FF" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#F0F1F3" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#747A82", fontSize: 9 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#747A82", fontSize: 9 }} width={28} ticks={[0, 250, 500, 750]} /><Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#1769FF", strokeDasharray: "3 3" }} /><Area type="monotone" dataKey="value" stroke="#1769FF" strokeWidth={2.5} fill="url(#revenueFill)" dot={false} activeDot={{ r: 4, fill: "#1769FF", stroke: "white", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div>
  </section>;
}
