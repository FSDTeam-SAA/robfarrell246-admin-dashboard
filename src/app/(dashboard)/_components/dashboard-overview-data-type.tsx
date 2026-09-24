export interface DashboardData {
  totalUsers: number;
  totalSubmissions: number;
  totalPayments: number;
  totalRevenue: number;
  totalClients?: number;
  activeRequests?: number;
  completedThisMonth?: number;
  revenueTracked?: number;
  pendingBookings?: number;
  employeesExpiring?: number;
}

export interface DashboardOverviewsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardData;
}
