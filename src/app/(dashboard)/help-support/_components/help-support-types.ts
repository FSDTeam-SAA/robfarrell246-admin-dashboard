export type TicketStatus = "Open" | "In Review" | "Waiting for User" | "Resolved" | "Closed";
export type TicketImpact = "Low" | "Normal" | "High";

export type SupportTicket = {
  id: string; customer: string; email: string; role: "Broker" | "Tenant"; subject: string; message: string; project: string; topic: string; impact: TicketImpact; status: TicketStatus; assignee: string; createdAt: string;
};

export const statusOptions: TicketStatus[] = ["Open", "In Review", "Waiting for User", "Resolved", "Closed"];
export const impactOptions: TicketImpact[] = ["Low", "Normal", "High"];
export const assigneeOptions = ["Unassigned (Support Pool)", "Elena Rostova (Lead Underwriter)", "Marcus Chen (Spatial Tech)"];

export const supportTickets: SupportTicket[] = [
  { id: "SUP-10148", customer: "Sarah Jenkins, CCIM", email: "sarah.jenkins@austinretailpartners.com", role: "Broker", subject: "Report export formatting", message: "The report PDF is cutting off the Competition Map on page 4 when exported with expansive resolution. Could you look into adjusting the page break margins so the legend does not get clipped?", project: "123 Market Street Site 104", topic: "Report / Export", impact: "Normal", status: "In Review", assignee: "Unassigned (Support Pool)", createdAt: "Sep 15, 2026, 03:42 PM" },
  { id: "SUP-10149", customer: "Sarah Jenkins, CCIM", email: "sarah.jenkins@austinretailpartners.com", role: "Broker", subject: "Competition map data", message: "Wanted to verify if we can filter the competition map by brand category before exporting the report.", project: "123 Market Street Site 104", topic: "Competition Mapping", impact: "Low", status: "Resolved", assignee: "Unassigned (Support Pool)", createdAt: "Sep 14, 2026, 11:20 AM" },
  { id: "SUP-10150", customer: "Marcus Vance", email: "marcus@vancehospitality.com", role: "Tenant", subject: "Fit Score calculation for space", message: "Evaluating 123 Market Street for our next location. Can you clarify how the Fit Score is calculated?", project: "123 Market Street Site 104", topic: "Fit Score", impact: "Normal", status: "Waiting for User", assignee: "Unassigned (Support Pool)", createdAt: "Sep 13, 2026, 09:15 AM" },
];
