"use client";

import { useMemo, useState } from "react";
import { ApiEmptyState, ApiErrorState, ApiLoadingSkeleton } from "../../_components/api-feedback";
import { useSupportCards, useSupportTickets } from "./help-support-api";
import SupportFilters from "./support-filters";
import SupportSummary from "./support-summary";
import SupportTicketTable from "./support-ticket-table";
import TicketDetail from "./ticket-detail";
import { type SupportTicket, type TicketImpact, type TicketStatus } from "./help-support-types";

const EMPTY_TICKETS: SupportTicket[] = [];

const HelpSupportContainer = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TicketStatus | "All">("All");
  const [impact, setImpact] = useState<TicketImpact | "All">("All");
  const ticketsQuery = useSupportTickets();
  const cardsQuery = useSupportCards();
  const tickets = ticketsQuery.data?.tickets ?? EMPTY_TICKETS;
  const visibleTickets = useMemo(() => {
    const term = query.toLowerCase().trim();
    return tickets.filter((ticket) => (
      (status === "All" || ticket.status === status)
      && (impact === "All" || ticket.impact === impact)
      && (!term || `${ticket.ticketNumber} ${ticket.customer} ${ticket.subject} ${ticket.topic}`.toLowerCase().includes(term))
    ));
  }, [impact, query, status, tickets]);

  if (selectedTicketId) return <TicketDetail ticketId={selectedTicketId} onBack={() => setSelectedTicketId(null)} />;

  return (
    <section className="bg-[#F4F7FB] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        {ticketsQuery.isLoading ? <ApiLoadingSkeleton rows={6} /> : ticketsQuery.isError ? <ApiErrorState message={ticketsQuery.error.message} onRetry={() => ticketsQuery.refetch()} /> : tickets.length === 0 ? <ApiEmptyState message="No support tickets found." /> : <>
          <SupportSummary cards={cardsQuery.data} isLoading={cardsQuery.isLoading} error={cardsQuery.error} onRetry={() => cardsQuery.refetch()} />
          <div className="mt-3 overflow-hidden rounded-[6px]">
            <SupportFilters query={query} status={status} impact={impact} onQuery={setQuery} onStatus={setStatus} onImpact={setImpact} />
            <SupportTicketTable tickets={visibleTickets} onSelect={(ticket) => setSelectedTicketId(ticket.id)} />
          </div>
        </>}
      </div>
    </section>
  );
};

export default HelpSupportContainer;
