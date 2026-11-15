export interface DashboardCardMetric {
  value: number;
  newThisMonth?: number;
  thisMonth?: number;
  momPercent?: number;
}

export interface DashboardCardsData {
  totalUsers: DashboardCardMetric;
  activeSubscribers: DashboardCardMetric;
  monthlyRevenue: DashboardCardMetric;
  creditsConsumed: DashboardCardMetric;
}

export interface DashboardCardsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardCardsData;
}
