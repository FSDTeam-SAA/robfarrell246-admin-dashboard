"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, X } from "lucide-react";
import type { Purchase } from "./credit-types";

type PurchaseReceiptModalProps = { purchase: Purchase | null; onClose: () => void };

const PurchaseReceiptModal = ({ purchase, onClose }: PurchaseReceiptModalProps) => (
  <Dialog open={purchase !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent overlayClassName="bg-[#526174]/35 backdrop-blur-[3px]" className="w-[calc(100%-2rem)] max-w-[432px] gap-0 overflow-hidden rounded-[3px] border-0 bg-white p-0 shadow-[0_14px_42px_rgba(26,39,61,0.18)]">
      {purchase && <>
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 text-[#708099] hover:text-[#344054]" aria-label="Close receipt"><X className="h-3.5 w-3.5" /></button>
        <DialogHeader className="border-b border-[#D9E1EB] px-3.5 py-3 text-left"><DialogTitle className="flex items-center gap-2 text-[13px] font-semibold text-[#1F2A3D]"><FileText className="h-4 w-4 text-[#2861E7]" />Purchase Receipt & Invoice</DialogTitle></DialogHeader>
        <div className="space-y-3 px-3.5 py-3 text-[10px] leading-[1.45] text-[#61738D]">
          <div className="rounded-[3px] bg-[#F5F8FC] px-2.5 py-2"><div className="flex justify-between"><span>Transaction ID:</span><span className="text-[#2861E7]">{purchase.transactionId}</span></div><div className="mt-1 flex justify-between"><span>Date & Time:</span><span className="text-[#25364D]">{purchase.date}</span></div><div className="mt-1 flex justify-between"><span>Payment Gateway:</span><span className="text-[#25364D]">Stripe Payments</span></div></div>
          <div><p className="mb-1 text-[#7C8DA4]">Customer Details</p><p className="font-semibold text-[#26364D]">{purchase.customer}</p><p>{purchase.email}</p><p className="mt-0.5 font-medium text-[#2666E8]">Role: {purchase.role}</p></div>
          <div className="border-y border-[#E2E8F0] py-2"><div className="flex items-start justify-between gap-3"><span className="font-semibold text-[#26364D]">{purchase.plan} (+{purchase.credits} CR)</span><span className="font-semibold text-[#00A550]">${purchase.amount.toFixed(2)}</span></div><div className="mt-1 flex justify-between"><span>Payment Method:</span><span className="text-[#26364D]">{purchase.paymentMethod}</span></div><div className="mt-1 flex justify-between"><span>Status:</span><span className="rounded bg-[#EAFBF1] px-1.5 py-0.5 text-[9px] font-medium text-[#00A550]">SUCCEEDED</span></div></div>
        </div>
        <footer className="grid grid-cols-2 gap-2 border-t border-[#E2E8F0] bg-[#FAFBFC] px-3.5 py-2.5"><button type="button" onClick={onClose} className="h-[30px] bg-[#F1F4F8] text-[11px] text-[#26364D] hover:bg-[#E7ECF2]">Close</button><button type="button" onClick={() => window.print()} className="flex h-[30px] items-center justify-center gap-2 bg-[#2861E7] text-[11px] font-medium text-white hover:bg-[#1F53CC]"><Download className="h-3.5 w-3.5" />Download Invoice</button></footer>
      </>}
    </DialogContent>
  </Dialog>
);

export default PurchaseReceiptModal;
