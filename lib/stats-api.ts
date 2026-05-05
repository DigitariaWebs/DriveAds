import { apiFetch } from './fetcher';

export type StatsPeriod = 'week' | 'month' | '3mo' | 'year';

export type LifetimeStats = {
  campaignsDone: number;
  totalKm: number;
  totalEarnings: number;
  rating: number;
};

export type PeriodStats = {
  period: StatsPeriod;
  windowStart: string;
  windowEnd: string;
  campaignsDone: number;
  earnings: number;
  km: number;
  activeCampaigns: number;
  growthPercent: number;
  monthlyEarnings: number;
  monthlyBreakdown: { month: string; amount: number; campaigns: number }[];
};

export type StatsResponse = {
  lifetime: LifetimeStats;
  period: PeriodStats;
};

export async function fetchMyStats(period: StatsPeriod): Promise<StatsResponse> {
  return apiFetch<StatsResponse>(`/api/me/stats?period=${period}`);
}
