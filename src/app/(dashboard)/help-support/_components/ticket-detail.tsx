"use client";

import { ArrowLeft, ChevronDown, MessageCircle, Paperclip, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { useReplyToTicket, useSupportTicket, useUpdateTicketStatus } from "./help-support-api";
import { impactOptions, statusOptions, type TicketStatus } from "./help-support-types";

const SelectField = ({ label, value, options, onChange, disabled = false }: { label: string; value: string; options: string[]; onChange: (value: string) => void; disabled?: boolean }) => <label className="block"><span className="mb-1.5 block text-[11px] text-[#344054]">{label}</span><span className="relative block"><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-[33px] w-full appearance-none rounded-[3px] border border-[#9AA9BD] bg-white px-2.5 pr-8 text-[10px] text-[#26364D] outline-none focus:border-[#2861E7] disabled:cursor-not-allowed disabled:bg-[#F0F4F9]"><option>{value}</option>{options.filter((option) => option !== value).map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#526174]" /></span></label>;

const ConversationCard = ({ name, role, message, createdAt, accent }: { name: string; role: string; message: string; createdAt?: string; accent: string }) => <article className="rounded-[10px] bg-white p-3"><div className="flex items-start gap-2"><span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${accent} text-[10px] font-bold text-white`}>{name.charAt(0)}</span><div><h3 className="text-[14px] font-semibold leading-4 text-[#151D30]">{name} <span className="ml-1 rounded bg-[#DDE7F2] px-1.5 py-0.5 text-[9px] font-medium text-[#64748B]">{role}</span></h3>{createdAt && <p className="mt-1 text-[9px] text-[#728096]">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(createdAt))}</p>}</div></div><p className="mt-3 border-t border-[#D7E0EB] pt-3 text-[11px] leading-[15px] text-[#5D6B82]">{message}</p></article>;

const TicketDetail = ({ ticketId, onBack }: { ticketId: string; onBack: () => void }) => {
  const ticketQuery = useSupportTicket(ticketId);
  const updateStatus = useUpdateTicketStatus(ticketId);
  const replyMutation = useReplyToTicket(ticketId);
  const [status, setStatus] = useState<TicketStatus>("Open");
  const [reply, setReply] = useState("");
  const ticket = ticketQuery.data;

  useEffect(() => {
    if (ticket) setStatus(ticket.status);
  }, [ticket]);

  if (ticketQuery.isLoading) return <section className="bg-[#F4F7FB] p-4 sm:p-6"><div className="mx-auto max-w-[1600px]"><ApiLoadingSkeleton rows={6} /></div></section>;
  if (ticketQuery.isError) return <section className="bg-[#F4F7FB] p-4 sm:p-6"><div className="mx-auto max-w-[1600px]"><ApiErrorState message={ticketQuery.error.message} onRetry={() => ticketQuery.refetch()} /></div></section>;
  if (!ticket) return <section className="bg-[#F4F7FB] p-4 sm:p-6"><div className="mx-auto max-w-[1600px]"><ApiEmptyState message="Support ticket not found." /></div></section>;

  const save = () => updateStatus.mutate(status, {
    onSuccess: () => toast.success("Ticket status updated"),
    onError: (error) => toast.error(error.message),
  });
  const submitReply = () => {
    if (!reply.trim()) return;
    replyMutation.mutate(reply.trim(), {
      onSuccess: () => { setReply(""); toast.success("Reply sent"); },
      onError: (error) => toast.error(error.message),
    });
  };

  return <section className="bg-[#F4F7FB] p-4 sm:p-6"><div className="mx-auto max-w-[1600px]"><div className="mb-3 flex items-center gap-3 text-[10px] text-[#526174]"><button type="button" onClick={onBack} aria-label="Back to Help & Support" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#718097] text-[#526174] hover:bg-white"><ArrowLeft className="h-4 w-4" /></button><span>Help &amp; Support</span><span className="text-[#A0ACBC]">›</span><span className="font-semibold text-[#2861E7]">#{ticket.ticketNumber}</span></div><article className="rounded-[10px] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-4"><div className="flex flex-wrap gap-2"><span className="rounded bg-[#EDF4FF] px-1.5 py-0.5 text-[9px] text-[#2861E7]">#{ticket.ticketNumber}</span><span className="rounded bg-[#FFF6E5] px-1.5 py-0.5 text-[9px] text-[#E98500]">● {ticket.status}</span><span className="rounded bg-[#DDE7F2] px-1.5 py-0.5 text-[9px] text-[#526174]">{ticket.topic}</span><span className="rounded bg-[#EAF0F7] px-1.5 py-0.5 text-[9px] text-[#64748B]">{ticket.impact} Priority</span></div><h2 className="mt-4 border-b border-[#D7E0EB] pb-2.5 text-[15px] font-semibold text-[#151D30]">{ticket.subject}</h2><dl className="grid grid-cols-1 gap-4 pt-4 text-[10px] sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-[#64748B]">Submitted By</dt><dd className="mt-1 font-medium text-[#27364B]">{ticket.customer}</dd><dd className="mt-1 text-[9px] text-[#728096]">{ticket.email}</dd></div><div><dt className="text-[#64748B]">Created On</dt><dd className="mt-1 font-medium text-[#27364B]">{ticket.createdAt}</dd></div><div><dt className="text-[#64748B]">Assigned Agent</dt><dd className="mt-1 font-medium text-[#27364B]">{ticket.assignee.replace("Unassigned (Support Pool)", "Support Pool")}</dd></div><div><dt className="text-[#64748B]">Related Project</dt><dd className="mt-1 font-medium text-[#27364B]">{ticket.project}</dd></div></dl></article><div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]"><div className="space-y-3"><ConversationCard name={ticket.customer} role={ticket.role} message={ticket.message} accent="bg-[#C94129]" />{ticket.replies.map((item) => <ConversationCard key={item.id} name={item.name} role={item.role} message={item.message} createdAt={item.createdAt} accent="bg-[#2D6EEA]" />)}<article className="rounded-[10px] bg-white p-3"><h3 className="flex items-center gap-2 border-b border-[#D7E0EB] pb-3 text-[14px] font-semibold text-[#151D30]"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#718097]"><MessageCircle className="h-4 w-4 text-[#526174]" /></span>Post a Reply</h3><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Please describe what happened, the steps to reproduce, or the specific question you have regarding the data..." className="mt-3 h-[77px] w-full resize-none rounded-[3px] border border-[#9AA9BD] p-2.5 text-[10px] text-[#26364D] outline-none placeholder:text-[#9AA8BA] focus:border-[#2861E7]" /><div className="mt-3 flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-[10px] text-[#64748B]"><Paperclip className="h-4 w-4" />Attachment unavailable</span><button type="button" disabled={replyMutation.isPending} onClick={submitReply} className="inline-flex h-[35px] items-center gap-2 bg-[#2861E7] px-4 text-[10px] font-medium text-white hover:bg-[#1F53CC] disabled:opacity-60">{replyMutation.isPending ? "Sending..." : "Submit Reply"} <Send className="h-3.5 w-3.5" /></button></div></article></div><aside className="h-fit rounded-[10px] bg-white p-3"><h3 className="flex items-center gap-2 border-b border-[#D7E0EB] pb-3 text-[14px] font-semibold text-[#151D30]"><span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#718097]"><MessageCircle className="h-4 w-4 text-[#526174]" /></span>Admin Ticket Controls</h3><div className="space-y-3 pt-3"><SelectField label="Workflow Status" value={status} options={statusOptions} onChange={(value) => setStatus(value as TicketStatus)} /><SelectField label="Assign Specialist (API unavailable)" value={ticket.assignee} options={[]} onChange={() => undefined} disabled /><SelectField label="Priority Impact (API unavailable)" value={ticket.impact} options={impactOptions} onChange={() => undefined} disabled /></div><div className="mt-3 border-t border-[#9AA9BD] pt-3"><button type="button" disabled={updateStatus.isPending} onClick={save} className="h-[35px] w-full bg-[#F1F4F8] text-[10px] text-[#151D30] hover:bg-[#E5EBF2] disabled:opacity-60">{updateStatus.isPending ? "Saving..." : "Save Ticket Changes"}</button></div></aside></div></div></section>;
};

export default TicketDetail;
