export type CreditPlan = {
  id: string;
  title: string;
  badge: string;
  description: string;
  credits: number;
  price: number;
  featured?: boolean;
};

export type PlanFormValues = Pick<CreditPlan, "title" | "badge" | "description" | "credits" | "price" | "featured">;

export type Purchase = {
  id: string;
  customer: string;
  email: string;
  userId?: string;
  role: "Broker" | "Tenant" | "Unknown";
  plan: string;
  credits: number;
  amount: number;
  date: string;
  paymentMethod: string;
  transactionId: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
};

export type CreditOverviewCards = {
  totalCreditPackEarnings: number;
  totalCreditsSold: number;
  totalCreditsUsed: number;
  activeCreditsInCirculation: number;
};
