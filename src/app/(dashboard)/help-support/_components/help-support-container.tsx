"use client";

import { useMemo, useState } from "react";
import SupportFilters from "./support-filters";
import SupportSummary from "./support-summary";
import SupportTicketTable from "./support-ticket-table";
import TicketDetail from "./ticket-detail";
import { supportTickets, type TicketImpact, type TicketStatus } from "./help-support-types";

const HelpSupportContainer = () => {
  const [tickets, setTickets] = useState(supportTickets); const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null); const [query, setQuery] = useState(""); const [status, setStatus] = useState<TicketStatus | "All">("All"); const [impact, setImpact] = useState<TicketImpact | "All">("All"); const [assignee, setAssignee] = useState("All");
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);
  const visibleTickets = useMemo(() => { const term = query.toLowerCase().trim(); return tickets.filter((ticket) => (status === "All" || ticket.status === status) && (impact === "All" || ticket.impact === impact) && (assignee === "All" || ticket.assignee === assignee) && (!term || `${ticket.id} ${ticket.customer} ${ticket.subject} ${ticket.topic}`.toLowerCase().includes(term))); }, [assignee, impact, query, status, tickets]);
  if (selectedTicket) return <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicketId(null)} onUpdate={(updatedTicket) => { setTickets((current) => current.map((ticket) => ticket.id === updatedTicket.id ? updatedTicket : ticket)); setSelectedTicketId(null); }} />;
  return <section className="bg-[#F4F7FB] p-4 sm:p-6"><div className="mx-auto max-w-[1600px]"><SupportSummary tickets={tickets.length} /><div className="mt-3 overflow-hidden rounded-[6px]"><SupportFilters query={query} status={status} impact={impact} assignee={assignee} onQuery={setQuery} onStatus={setStatus} onImpact={setImpact} onAssignee={setAssignee} /><SupportTicketTable tickets={visibleTickets} onSelect={(ticket) => setSelectedTicketId(ticket.id)} /></div></div></section>;
};

export default HelpSupportContainer;
