export type TicketStatus = "Open" | "In Review" | "Resolved" | "Closed";
export type TicketImpact = "Low" | "Normal" | "High";

export type SupportReply = {
  id: string;
  name: string;
  role: string;
  message: string;
  createdAt?: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  customer: string;
  email: string;
  role: "Landlord" | "Tenant" | "Unknown";
  subject: string;
  message: string;
  project: string;
  topic: string;
  impact: TicketImpact;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  replies: SupportReply[];
  attachmentUrl?: string;
};

type BackendTicket = {
  _id: string;
  ticketNumber: string;
  user?: { name?: string; email?: string; role?: string };
  subject: string;
  description: string;
  topic: string;
  customTopic?: string;
  priority: "LOW" | "NORMAL" | "HIGH";
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  createdAt: string;
  attachmentUrl?: string;
  replies?: Array<{
    _id?: string;
    sender?: { name?: string; role?: string };
    senderRole?: string;
    message: string;
    createdAt?: string;
  }>;
};

const statusLabels: Record<BackendTicket["status"], TicketStatus> = {
  OPEN: "Open",
  IN_REVIEW: "In Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const impactLabels: Record<BackendTicket["priority"], TicketImpact> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
};

export const statusToApi: Record<TicketStatus, BackendTicket["status"]> = {
  Open: "OPEN",
  "In Review": "IN_REVIEW",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
};

export const statusOptions: TicketStatus[] = ["Open", "In Review", "Resolved", "Closed"];
export const impactOptions: TicketImpact[] = ["Low", "Normal", "High"];

export function toSupportTicket(ticket: BackendTicket): SupportTicket {
  return {
    id: ticket._id,
    ticketNumber: ticket.ticketNumber,
    customer: ticket.user?.name || "Unknown user",
    email: ticket.user?.email || "—",
    role: ticket.user?.role === "LANDLORD" ? "Landlord" : ticket.user?.role === "TENANT" ? "Tenant" : "Unknown",
    subject: ticket.subject,
    message: ticket.description,
    project: "—",
    topic: ticket.customTopic?.trim() || ticket.topic.replaceAll("_", " "),
    impact: impactLabels[ticket.priority],
    status: statusLabels[ticket.status],
    assignee: "Unassigned (Support Pool)",
    createdAt: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ticket.createdAt)),
    attachmentUrl: ticket.attachmentUrl,
    replies: (ticket.replies || []).map((reply, index) => ({
      id: reply._id || `${ticket._id}-${index}`,
      name: reply.sender?.name || "Support Team",
      role: reply.sender?.role || reply.senderRole || "Support",
      message: reply.message,
      createdAt: reply.createdAt,
    })),
  };
}
