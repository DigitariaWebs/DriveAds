import { Campaign } from '../constants/Types';
import { apiFetch } from './fetcher';

type CampaignDTO = {
  id: string;
  companyId: string;
  brand: string;
  domain: string;
  title: string;
  description: string;
  city: string;
  zones: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  reward: number;
  status: 'draft' | 'upcoming' | 'active' | 'completed';
  progress: number;
  kmDone: number;
  kmTotal: number;
  driversNeeded: number;
  driversAssigned: number;
  assignedDriverIds: string[];
  trackingMode: 'gps' | 'manual';
  heroImageUrl?: string;
};

// Backend status `upcoming` with capacity → mobile UX status `available`
// (matches existing mobile type that the UI screens already key off of).
function toMobileCampaign(dto: CampaignDTO, driverId?: string | null): Campaign {
  let status: Campaign['status'];
  const isMine = driverId ? dto.assignedDriverIds.includes(driverId) : false;
  if (dto.status === 'completed') status = 'completed';
  else if (dto.status === 'active') status = 'active';
  else if (dto.status === 'upcoming') {
    const hasCapacity = dto.driversAssigned < dto.driversNeeded;
    status = hasCapacity && !isMine ? 'available' : 'upcoming';
  } else {
    status = 'upcoming'; // draft never reaches mobile, but fallback safe
  }

  return {
    id: dto.id,
    companyId: dto.companyId,
    brand: dto.brand,
    domain: dto.domain,
    title: dto.title,
    description: dto.description,
    city: dto.city,
    zones: dto.zones,
    startDate: dto.startDate,
    endDate: dto.endDate,
    durationDays: dto.durationDays,
    reward: dto.reward,
    status,
    progress: dto.progress,
    kmDone: dto.kmDone,
    kmTotal: dto.kmTotal,
    driversNeeded: dto.driversNeeded,
    driversAssigned: dto.driversAssigned,
    assignedDriverIds: dto.assignedDriverIds,
    trackingMode: dto.trackingMode,
  };
}

export async function fetchCampaigns(driverId?: string | null): Promise<Campaign[]> {
  const res = await apiFetch<{ campaigns: CampaignDTO[] }>('/api/campaigns');
  return res.campaigns.map((c) => toMobileCampaign(c, driverId));
}

export async function fetchCampaignDetail(
  id: string,
  driverId?: string | null,
): Promise<Campaign> {
  const res = await apiFetch<{ campaign: CampaignDTO }>(`/api/campaigns/${id}`);
  return toMobileCampaign(res.campaign, driverId);
}

export async function fetchMyCampaigns(driverId?: string | null): Promise<{
  active: Campaign[];
  upcoming: Campaign[];
  completed: Campaign[];
}> {
  const res = await apiFetch<{
    active: CampaignDTO[];
    upcoming: CampaignDTO[];
    completed: CampaignDTO[];
  }>('/api/campaigns/mine');
  return {
    active: res.active.map((c) => toMobileCampaign(c, driverId)),
    upcoming: res.upcoming.map((c) => toMobileCampaign(c, driverId)),
    completed: res.completed.map((c) => toMobileCampaign(c, driverId)),
  };
}

export async function acceptCampaignApi(
  id: string,
  driverId?: string | null,
): Promise<Campaign> {
  const res = await apiFetch<{ campaign: CampaignDTO }>(
    `/api/campaigns/${id}/accept`,
    { method: 'POST' },
  );
  return toMobileCampaign(res.campaign, driverId);
}
