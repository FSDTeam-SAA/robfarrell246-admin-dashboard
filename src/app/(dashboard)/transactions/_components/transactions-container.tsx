"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Transaction = {
  chargeId: string;
  date: string;
  time: string;
  customer: string;
  price: string;
  amount: string;
};

const transactionPages: Transaction[][] = [
  [
    { chargeId: "ch_3N928F9aI80", date: "2026-03-01", time: "15:44", customer: "sarah.j@lincolnprop.com", price: "Pro Plan Monthly", amount: "$320" },
    { chargeId: "ch_3N928F9aI81", date: "2026-03-01", time: "13:10", customer: "m.vance@vancerealty.com", price: "100 Credits Top-Up", amount: "$150" },
    { chargeId: "ch_3N928F9aI82", date: "2026-02-28", time: "18:22", customer: "elena@sweetgreen.com", price: "Growth Plan Monthly", amount: "$499" },
  ],
  [
    { chargeId: "ch_3N928F9aI83", date: "2026-02-27", time: "10:16", customer: "d.chen@matchacraft.com", price: "Starter Plan Monthly", amount: "$199" },
    { chargeId: "ch_3N928F9aI84", date: "2026-02-26", time: "16:50", customer: "nora@harborretail.com", price: "50 Credits Top-Up", amount: "$75" },
    { chargeId: "ch_3N928F9aI85", date: "2026-02-26", time: "09:35", customer: "james@citysquare.com", price: "Pro Plan Monthly", amount: "$320" },
  ],
];

const TransactionsContainer = () => {
  const [page, setPage] = useState(1);
  const transactions = transactionPages[page - 1];

  return (
    <section className="bg-[#F7F9FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[10px] border border-[#D7E0EB] bg-white">
        <header className="border-b border-[#D7E0EB] px-4 py-3">
          <h2 className="text-[16px] font-semibold text-[#172033]">Active Customer Subscriptions</h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead className="bg-[#E1E7F0] text-[11px] font-medium text-[#48566C]">
              <tr className="h-[41px]">
                <th className="w-[23%] px-4 font-medium">Charge ID</th>
                <th className="w-[17%] px-3 text-center font-medium">Date</th>
                <th className="w-[23%] px-3 text-center font-medium">Customer</th>
                <th className="w-[18%] px-3 font-medium">Price</th>
                <th className="w-[12%] px-3 text-center font-medium">Gross Amount</th>
                <th className="w-[12%] px-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.chargeId} className="h-[53px] border-b border-[#E3E8EF] last:border-b-0">
                  <td className="px-4 py-2 text-[11px] font-medium text-[#2B70E8]">{transaction.chargeId}</td>
                  <td className="px-3 py-2 text-center text-[11px] leading-[14px] text-[#1F2A3D]"><span className="block">{transaction.date}</span><span className="block">{transaction.time}</span></td>
                  <td className="px-3 py-2 text-center text-[11px] text-[#1F2A3D]">{transaction.customer}</td>
                  <td className="px-3 py-2 text-[11px] text-[#1F2A3D]">{transaction.price}</td>
                  <td className="px-3 py-2 text-center text-[11px] text-[#1F2A3D]">{transaction.amount}</td>
                  <td className="px-3 py-2 text-center"><span className="rounded-[5px] bg-[#EAFBF1] px-2 py-1 text-[9px] font-medium text-[#009B4C]">SUCCEEDED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2 text-[10px] text-[#526174]">
          <span>12 requests · Page {page} of 2</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage(1)} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button>
            <span className="inline-flex h-[25px] min-w-[23px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px] text-[#334155]">{page}</span>
            <button type="button" onClick={() => setPage(2)} disabled={page === 2} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default TransactionsContainer;
