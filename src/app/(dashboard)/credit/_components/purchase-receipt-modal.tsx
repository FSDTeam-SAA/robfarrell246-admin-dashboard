"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import type { Purchase } from "./credit-types";

type PurchaseReceiptModalProps = { purchase: Purchase | null; onClose: () => void };

const formatAmount = (amount: number) => `$${amount.toFixed(2)}`;

function downloadInvoice(purchase: Purchase) {
  const invoice = [
    "PURCHASE RECEIPT & INVOICE",
    "",
    `Transaction ID: ${purchase.transactionId}`,
    `Date & Time: ${purchase.date}`,
    "Payment Gateway: Stripe Payments",
    "",
    "CUSTOMER DETAILS",
    `Name: ${purchase.customer}`,
    `Email: ${purchase.email}`,
    `Role: ${purchase.role}`,
    "",
    "PURCHASE DETAILS",
    `Credit Plan: ${purchase.plan}`,
    `Credits Added: ${purchase.credits} CR`,
    `Amount: ${formatAmount(purchase.amount)}`,
    `Payment Method: ${purchase.paymentMethod}`,
    `Status: ${purchase.status}`,
  ].join("\n");
  const blob = new Blob([invoice], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${purchase.transactionId.replace(/[^a-z0-9_-]/gi, "-")}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

const ReceiptRow = ({ label, children, breakValue = false }: { label: string; children: React.ReactNode; breakValue?: boolean }) => <div className="grid grid-cols-[106px_minmax(0,1fr)] gap-3"><span>{label}</span><span className={`min-w-0 text-right font-medium text-[#26364D] ${breakValue ? "break-all text-[#2861E7]" : "break-words"}`}>{children}</span></div>;

const PurchaseReceiptModal = ({ purchase, onClose }: PurchaseReceiptModalProps) => (
  <Dialog open={purchase !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent overlayClassName="bg-[#526174]/35 backdrop-blur-[3px]" className="w-[calc(100vw-2rem)] max-w-[520px] gap-0 overflow-hidden rounded-[3px] border-0 bg-white p-0 shadow-[0_14px_42px_rgba(26,39,61,0.18)]">
      {purchase && <>
        <DialogHeader className="border-b border-[#D9E1EB] px-3.5 py-3 text-left"><DialogTitle className="flex items-center gap-2 pr-6 text-[13px] font-semibold text-[#1F2A3D]"><FileText className="h-4 w-4 shrink-0 text-[#2861E7]" />Purchase Receipt &amp; Invoice</DialogTitle></DialogHeader>
        <div className="max-h-[min(60vh,430px)] space-y-3 overflow-y-auto px-3.5 py-3 text-[10px] leading-[1.45] text-[#61738D]">
          <div className="space-y-1.5 rounded-[3px] bg-[#F5F8FC] px-2.5 py-2"><ReceiptRow label="Transaction ID:" breakValue>{purchase.transactionId}</ReceiptRow><ReceiptRow label="Date & Time:">{purchase.date}</ReceiptRow><ReceiptRow label="Payment Gateway:">Stripe Payments</ReceiptRow></div>
          <div><p className="mb-1 text-[#7C8DA4]">Customer Details</p><p className="break-words font-semibold text-[#26364D]">{purchase.customer}</p><p className="break-all">{purchase.email}</p><p className="mt-0.5 font-medium text-[#2666E8]">Role: {purchase.role}</p></div>
          <div className="space-y-1.5 border-y border-[#E2E8F0] py-2"><div className="flex items-start justify-between gap-3"><span className="min-w-0 break-words font-semibold text-[#26364D]">{purchase.plan} (+{purchase.credits} CR)</span><span className="shrink-0 font-semibold text-[#00A550]">{formatAmount(purchase.amount)}</span></div><ReceiptRow label="Payment Method:">{purchase.paymentMethod}</ReceiptRow><ReceiptRow label="Status:"><span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${purchase.status === "SUCCEEDED" ? "bg-[#EAFBF1] text-[#00A550]" : purchase.status === "FAILED" ? "bg-[#FFF1F2] text-[#F23A43]" : "bg-[#FFF7E8] text-[#D97706]"}`}>{purchase.status}</span></ReceiptRow></div>
        </div>
        <footer className="grid grid-cols-2 gap-2 border-t border-[#E2E8F0] bg-[#FAFBFC] px-3.5 py-2.5"><button type="button" onClick={onClose} className="h-[30px] min-w-0 bg-[#F1F4F8] text-[11px] text-[#26364D] hover:bg-[#E7ECF2]">Close</button><button type="button" onClick={() => downloadInvoice(purchase)} className="flex h-[30px] min-w-0 items-center justify-center gap-2 whitespace-nowrap bg-[#2861E7] px-2 text-[11px] font-medium text-white hover:bg-[#1F53CC]"><Download className="h-3.5 w-3.5 shrink-0" />Download Invoice</button></footer>
      </>}
    </DialogContent>
  </Dialog>
);

export default PurchaseReceiptModal;
