import { apiFetch } from './fetcher';

export type PerformancePeriod = '7d' | '30d' | '90d' | '365d';

export type PerformanceKpis = {
  impressionsTotal: number;
  reachTerminals: number;
  kmTotal: number;
  campaignDays: number;
};

export type CitySlice = { city: string; impressions: number };
export type CampaignSlice = {
  campaignId: string;
  brand: string;
  title: string;
  impressions: number;
  pct: number;
};

export type PerformanceResponse = {
  period: PerformancePeriod;
  windowStart: string;
  windowEnd: string;
  kpis: PerformanceKpis;
  impressionsTimeline: number[];
  cities: CitySlice[];
  campaigns: CampaignSlice[];
  generatedAt: string;
};

export async function fetchAdvertiserPerformance(
  period: PerformancePeriod = '30d',
): Promise<PerformanceResponse> {
  return apiFetch<PerformanceResponse>(`/api/me/performance?period=${period}`);
}
