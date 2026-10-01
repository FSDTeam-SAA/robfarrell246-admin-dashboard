"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type Business = {
  id: number;
  name: string;
  description: string;
  tenant: string;
  email: string;
  type: "Restaurant & Taproom" | "Boutique Fitness Studio";
  space: string;
  capExBudget: string;
};

const initialBusinesses: Business[] = [
  {
    id: 1,
    name: "Meze & Grain Artisanal Bowls",
    description: "Modern fast-casual Mediterranean kitchen focused on bowls.",
    tenant: "Marcus Vance",
    email: "marcus@vancehospitality.com",
    type: "Restaurant & Taproom",
    space: "1200-1600 SF",
    capExBudget: "$450000",
  },
  {
    id: 2,
    name: "Forma Studio Pilates",
    description: "High-intensity reformer Pilates and athletic conditioning.",
    tenant: "David Chen",
    email: "david@matchcraft.com",
    type: "Boutique Fitness Studio",
    space: "2000-2200SF",
    capExBudget: "$800000",
  },
];

const BusinessContainer = () => {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [query, setQuery] = useState("");
  const [businessType, setBusinessType] = useState("ALL");
  const [page, setPage] = useState(1);
  const totalPages = 2;

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return businesses.filter(
      (business) =>
        (!normalizedQuery ||
          `${business.name} ${business.tenant} ${business.type}`
            .toLowerCase()
            .includes(normalizedQuery)) &&
        (businessType === "ALL" || business.type === businessType),
    );
  }, [businessType, businesses, query]);

  return (
    <section className="p-4">
      <div className="overflow-hidden rounded-[3px] border border-[#E0E7F0] bg-white">
        <div className="flex min-h-[46px] flex-col justify-between gap-3 bg-[#2948B4] px-3 py-2 sm:flex-row sm:items-center sm:px-3.5">
          <label className="relative block w-full sm:w-[250px]">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77849A]"
              strokeWidth={1.6}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              aria-label="Search businesses"
              className="h-[24px] w-full rounded-[3px] border-0 bg-white py-1 pl-7 pr-9 text-[11px] text-[#26364D] outline-none placeholder:text-[#8A96A8] focus:ring-2 focus:ring-white/60"
            />
            <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[#D7DEE8] bg-[#F7F9FC] px-1 py-px text-[8px] text-[#7E8999]">
              ⌘K
            </kbd>
          </label>

          <label className="flex items-center justify-end gap-2 text-[11px] text-white">
            <span>Analysis Type:</span>
            <span className="relative">
              <select
                value={businessType}
                onChange={(event) => {
                  setBusinessType(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by business type"
                className="h-[24px] appearance-none rounded-[3px] border-0 bg-white py-1 pl-2 pr-6 text-[10px] text-[#344054] outline-none"
              >
                <option value="ALL">All Analysis Types (25)</option>
                <option value="Restaurant & Taproom">Restaurant & Taproom</option>
                <option value="Boutique Fitness Studio">Boutique Fitness Studio</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#526174]" />
            </span>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-collapse text-left">
            <thead className="bg-[#E6EBF3] text-[10px] font-medium text-[#4F5E73]">
              <tr className="h-[36px]">
                <th className="w-[25%] px-4 font-medium">Business Name</th>
                <th className="w-[15%] px-3 text-center font-medium">Tenant</th>
                <th className="w-[16%] px-3 font-medium">Business Type</th>
                <th className="w-[12%] px-3 text-center font-medium">Space</th>
                <th className="w-[11%] px-3 text-center font-medium">CapEx Budget ($)</th>
                <th className="w-[11%] px-3 text-center font-medium">STATUS</th>
                <th className="w-[10%] px-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((business) => (
                <tr
                  key={business.id}
                  className="h-[52px] border-b border-[#E5EAF1] last:border-b-0"
                >
                  <td className="px-4 py-2">
                    <p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">
                      {business.name}
                    </p>
                    <p className="truncate text-[10px] leading-3 text-[#728096]">
                      {business.description}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <p className="truncate text-[12px] font-medium leading-4 text-[#27364B]">
                      {business.tenant}
                    </p>
                    <p className="truncate text-[10px] leading-3 text-[#728096]">
                      {business.email}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="truncate text-[12px] font-medium text-[#27364B]">
                      {business.type}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-center text-[12px] font-medium text-[#27364B]">
                    {business.space}
                  </td>
                  <td className="px-3 py-2 text-center text-[12px] font-medium text-[#27364B]">
                    {business.capExBudget}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center gap-1 rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#0AA656]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0AB85D]" />
                      Report Ready
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label={`View details for ${business.name}`}
                        className="inline-flex h-[25px] items-center gap-2 rounded-[2px] bg-[#F1F4F8] px-3 text-[12px] font-medium text-[#27364B] transition hover:bg-[#E5EAF1]"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.7} />
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setBusinesses((current) =>
                            current.filter(({ id }) => id !== business.id),
                          )
                        }
                        aria-label={`Delete ${business.name}`}
                        className="inline-flex h-[25px] w-[34px] items-center justify-center rounded-[2px] bg-[#FFF2F4] text-[#E5262A] transition hover:bg-[#FFE4E7]"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBusinesses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[12px] text-[#718097]">
                    No businesses match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex min-h-[48px] items-center justify-between gap-3 border-t border-[#E5EAF1] px-3.5 py-2 text-[10px] text-[#526174]">
          <span>12 requests · Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </button>
            <span className="inline-flex h-[25px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px]">
              {page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default BusinessContainer;
