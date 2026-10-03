"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CreditPlan, PlanFormValues } from "./credit-types";

type CreateCreditPlanModalProps = {
  plan: CreditPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: PlanFormValues) => void;
};

const emptyForm: PlanFormValues = {
  title: "",
  badge: "",
  description: "",
  credits: 50,
  price: 45,
  featured: false,
};

const CreateCreditPlanModal = ({ plan, isOpen, onClose, onSave }: CreateCreditPlanModalProps) => {
  const [form, setForm] = useState<PlanFormValues>(emptyForm);

  useEffect(() => {
    setForm(plan ? {
      title: plan.title,
      badge: plan.badge,
      description: plan.description,
      credits: plan.credits,
      price: plan.price,
      featured: Boolean(plan.featured),
    } : emptyForm);
  }, [plan, isOpen]);

  const setValue = <K extends keyof PlanFormValues>(key: K, value: PlanFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, title: form.title.trim(), badge: form.badge.trim(), description: form.description.trim() });
  };

  const unitPrice = form.credits > 0 ? (form.price / form.credits).toFixed(2) : "0.00";
  const isEditing = Boolean(plan);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent overlayClassName="bg-[#526174]/35 backdrop-blur-[3px]" className="w-[calc(100%-2rem)] max-w-[680px] gap-0 overflow-hidden rounded-[3px] border-0 bg-white p-0 shadow-[0_14px_42px_rgba(26,39,61,0.18)]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 text-[#7B8798] hover:text-[#344054]" aria-label="Close dialog"><X className="h-4 w-4" /></button>
        <DialogHeader className="px-4 pb-3 pt-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-[#1E293B]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2861E7] text-white"><Coins className="h-3 w-3" strokeWidth={2.5} /></span>{isEditing ? "Edit Credit Plan" : "Create New Credit Plan"}</DialogTitle>
          <DialogDescription className="ml-7 mt-1 text-[11px] leading-4 text-[#8A9AB2]">This package will immediately display in the Top-Up modal for broker and tenant dashboards.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 px-4 pb-5 sm:grid-cols-2">
            <Field label="Offer Name / Plan Title *" hint="Shown on the package card and in user dashboards"><input required value={form.title} onChange={(event) => setValue("title", event.target.value)} placeholder="Enter the plan name..." className="form-input" /></Field>
            <Field label="Discount Badge / Promo Label" hint="Appears as an uppercase pill badge"><input value={form.badge} onChange={(event) => setValue("badge", event.target.value)} placeholder="Write a brief overview" className="form-input" /></Field>
            <Field label="Credit Volume *"><div className="relative"><input required min="1" type="number" value={form.credits} onChange={(event) => setValue("credits", Number(event.target.value))} className="form-input pr-8" /><Coins className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-[#334155]" /></div></Field>
            <Field label="Price ($ USD) *" hint={`Unit economics: $${unitPrice} / credit`}><div className="relative"><input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setValue("price", Number(event.target.value))} className="form-input pr-8" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#334155]">$</span></div></Field>
            <div className="sm:col-span-2"><Field label="Description & Value Pitch"><textarea value={form.description} onChange={(event) => setValue("description", event.target.value)} placeholder="standard" className="form-input min-h-[82px] resize-none py-3" /></Field></div>
            <label className="flex items-center gap-2 text-[11px] text-[#2666E8]"><input type="checkbox" checked={form.featured} onChange={(event) => setValue("featured", event.target.checked)} className="h-3.5 w-3.5 rounded border-[#CED8E6] accent-[#2861E7]" />Featured / Most Popular</label>
          </div>
          <footer className="grid grid-cols-2 gap-4 bg-[#FAFBFC] px-4 py-4"><button type="button" onClick={onClose} className="h-[35px] bg-[#F4F6F9] text-[12px] text-[#5D6B82] transition hover:bg-[#EBEFF4]">Cancel</button><button type="submit" className="h-[35px] bg-[#2861E7] text-[12px] font-medium text-white transition hover:bg-[#1F53CC]">{isEditing ? "Save Changes" : "Save & Publish Plan"}</button></footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block text-[12px] font-medium text-[#344054]"><span className="mb-1.5 block">{label}</span>{children}{hint && <span className="mt-1 block text-[10px] font-normal text-[#8A9AB2]">{hint}</span>}</label>
);

export default CreateCreditPlanModal;
