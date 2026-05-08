import { apiFetch } from './fetcher';

export type DailyRevenueRow = {
  date: string;
  spraysCount: number;
  impressions: number;
  sprayCents: number;
  adCents: number;
  totalCents: number;
};

export type MonthlyTerminalLine = {
  terminalId: string;
  terminalCode?: string;
  terminalName?: string;
  spraysCount: number;
  impressions: number;
  sprayCents: number;
  adCents: number;
  totalCents: number;
};

export type MonthlySummary = {
  month: string;
  sealed: boolean;
  spraysCount: number;
  impressions: number;
  sprayRateCents: number;
  cpmCents: number;
  sprayCents: number;
  adCents: number;
  totalCents: number;
  perTerminal: MonthlyTerminalLine[];
};

export type PartnerPayout = {
  id: string;
  partnerId: string;
  month: string;
  totalCents: number;
  status: 'scheduled' | 'paid' | 'failed';
  scheduledFor: string;
  paidAt?: string;
  payoutReference?: string;
  createdAt: string;
};

export type RevenueSummary = {
  currentMonth: MonthlySummary;
  monthlyTargetCents: number | null;
  rates: { sprayRateCents: number; cpmCents: number };
  nextScheduled: PartnerPayout | null;
  lastPaid: PartnerPayout | null;
};

export async function fetchRevenueSummary(): Promise<RevenueSummary> {
  return apiFetch<RevenueSummary>('/api/me/revenue/summary');
}

export async function fetchRevenueHistory(days = 30): Promise<DailyRevenueRow[]> {
  const res = await apiFetch<{ rows: DailyRevenueRow[] }>(
    `/api/me/revenue/history?days=${days}`,
  );
  return res.rows;
}

export async function fetchPartnerPayouts(opts?: {
  status?: PartnerPayout['status'];
}): Promise<PartnerPayout[]> {
  const qs = opts?.status ? `?status=${opts.status}` : '';
  const res = await apiFetch<{ payouts: PartnerPayout[] }>(
    `/api/me/revenue/payouts${qs}`,
  );
  return res.payouts;
}
