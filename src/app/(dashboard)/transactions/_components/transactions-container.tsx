"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { type Transaction, useTransactions } from "./transactions-api";

const TransactionsContainer = () => {
  const [page, setPage] = useState(1);
  const transactions = useTransactions(page);
  const totalPages = transactions.data?.totalPages ?? 1;

  return (
    <section className="bg-[#F7F9FC] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[10px] border border-[#D7E0EB] bg-white">
        <header className="border-b border-[#D7E0EB] px-4 py-3">
          <h2 className="text-[16px] font-semibold text-[#172033]">Active Customer Subscriptions</h2>
        </header>

        {transactions.isLoading ? (
          <div className="p-4"><ApiLoadingSkeleton rows={5} /></div>
        ) : transactions.error ? (
          <div className="p-4"><ApiErrorState message={transactions.error.message} onRetry={() => transactions.refetch()} /></div>
        ) : !transactions.data?.transactions.length ? (
          <div className="p-4"><ApiEmptyState message="No completed credit purchase transactions are available." /></div>
        ) : (
          <>
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
                  {transactions.data.transactions.map((transaction) => <TransactionRow key={transaction.chargeId} transaction={transaction} />)}
                </tbody>
              </table>
            </div>

            <footer className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2 text-[10px] text-[#526174]">
              <span>{transactions.data.total} requests · Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55"><ChevronLeft className="h-3 w-3" />Prev</button>
                <span className="inline-flex h-[25px] min-w-[23px] items-center justify-center rounded-[3px] bg-[#EEF2F7] px-1.5 text-[10px] text-[#334155]">{page}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="inline-flex h-[25px] items-center gap-1 rounded-[3px] border border-[#DCE4EF] bg-white px-2 text-[10px] transition hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-55">Next<ChevronRight className="h-3 w-3" /></button>
              </div>
            </footer>
          </>
        )}
      </div>
    </section>
  );
};

const TransactionRow = ({ transaction }: { transaction: Transaction }) => (
  <tr className="h-[53px] border-b border-[#E3E8EF] last:border-b-0">
    <td className="px-4 py-2 text-[11px] font-medium text-[#2B70E8]">{transaction.chargeId}</td>
    <td className="px-3 py-2 text-center text-[11px] leading-[14px] text-[#1F2A3D]"><span className="block">{transaction.date}</span><span className="block">{transaction.time}</span></td>
    <td className="px-3 py-2 text-center text-[11px] text-[#1F2A3D]">{transaction.customer}</td>
    <td className="px-3 py-2 text-[11px] text-[#1F2A3D]">{transaction.price}</td>
    <td className="px-3 py-2 text-center text-[11px] text-[#1F2A3D]">{transaction.amount}</td>
    <td className="px-3 py-2 text-center"><StatusBadge status={transaction.status} /></td>
  </tr>
);

const StatusBadge = ({ status }: { status: Transaction["status"] }) => <span className={`rounded-[5px] px-2 py-1 text-[9px] font-medium ${status === "SUCCEEDED" ? "bg-[#EAFBF1] text-[#009B4C]" : status === "FAILED" ? "bg-[#FFF1F2] text-[#F23A43]" : "bg-[#FFF7E8] text-[#D97706]"}`}>{status}</span>;

export default TransactionsContainer;
