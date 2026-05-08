import { apiFetch } from './fetcher';

export type AdScheduleStatus =
  | 'live'
  | 'scheduled'
  | 'paused'
  | 'expired'
  | 'cancelled';

export type AdSchedule = {
  id: string;
  terminalId: string;
  campaignId: string;
  partnerId: string;
  companyId: string;
  startHour: number;
  endHour: number;
  intervalSeconds: number;
  status: AdScheduleStatus;
  liveStatus: AdScheduleStatus;
  inWindowNow: boolean;
  pausedAt?: string;
  pauseReason?: string;
  createdAt: string;
  updatedAt: string;
  campaignTitle?: string;
  campaignBrand?: string;
  campaignBrandColor?: string;
  campaignType?: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
  terminalName?: string;
  terminalCode?: string;
};

export type AdImpressionDaily = {
  terminalId: string;
  campaignId: string;
  date: string;
  impressions: number;
};

export type AdIssueKind =
  | 'not_playing'
  | 'wrong_content'
  | 'audio_issue'
  | 'screen_issue'
  | 'other';

export type AdIssueStatus = 'open' | 'resolved' | 'dismissed';

export type AdIssueReport = {
  id: string;
  partnerId: string;
  terminalId: string;
  scheduleId: string;
  campaignId: string;
  kind: AdIssueKind;
  description: string;
  status: AdIssueStatus;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  campaignTitle?: string;
  terminalName?: string;
};

export async function fetchMyAdSchedules(opts?: {
  terminalId?: string;
}): Promise<AdSchedule[]> {
  const qs = opts?.terminalId ? `?terminalId=${opts.terminalId}` : '';
  const res = await apiFetch<{ schedules: AdSchedule[] }>(
    `/api/me/ad-schedules${qs}`,
  );
  return res.schedules;
}

export async function fetchMyAdImpressions(opts?: {
  days?: number;
  terminalId?: string;
}): Promise<AdImpressionDaily[]> {
  const params = new URLSearchParams();
  if (opts?.days) params.set('days', String(opts.days));
  if (opts?.terminalId) params.set('terminalId', opts.terminalId);
  const qs = params.toString();
  const res = await apiFetch<{ rows: AdImpressionDaily[] }>(
    `/api/me/ad-impressions${qs ? `?${qs}` : ''}`,
  );
  return res.rows;
}

export async function fetchMyAdIssues(opts?: {
  status?: AdIssueStatus;
}): Promise<AdIssueReport[]> {
  const qs = opts?.status ? `?status=${opts.status}` : '';
  const res = await apiFetch<{ issues: AdIssueReport[] }>(
    `/api/me/ad-issues${qs}`,
  );
  return res.issues;
}

export async function reportAdIssue(input: {
  scheduleId: string;
  kind: AdIssueKind;
  description: string;
}): Promise<AdIssueReport> {
  const res = await apiFetch<{ issue: AdIssueReport }>('/api/me/ad-issues', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.issue;
}
