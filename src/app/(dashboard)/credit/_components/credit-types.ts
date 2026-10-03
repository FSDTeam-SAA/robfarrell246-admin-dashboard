export type CreditPlan = {
  id: string;
  title: string;
  badge: string;
  description: string;
  credits: number;
  price: number;
  purchases: number;
  active: boolean;
  featured?: boolean;
};

export type PlanFormValues = Pick<CreditPlan, "title" | "badge" | "description" | "credits" | "price" | "featured">;

export type Purchase = {
  id: string;
  customer: string;
  email: string;
  role: "Broker" | "Tenant";
  plan: string;
  credits: number;
  amount: number;
  date: string;
  paymentMethod: string;
  transactionId: string;
};
