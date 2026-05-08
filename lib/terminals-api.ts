import { apiFetch } from './fetcher';

export type TerminalStatus = 'online' | 'offline' | 'maintenance';
export type ScreenStatus = 'active' | 'idle' | 'fault';
export type VenueType =
  | 'bar'
  | 'restaurant'
  | 'hotel'
  | 'nightclub'
  | 'gym'
  | 'other';

export type Terminal = {
  id: string;
  partnerId: string;
  code: string;
  name: string;
  venueType: VenueType;
  address: string;
  city: string;
  coords: { lat: number; lng: number };
  status: TerminalStatus;
  spraysToday: number;
  screenStatus: ScreenStatus;
  lastHeartbeatAt?: string;
  installedAt: string;
  decommissionedAt?: string;
  activeMaintenance?: MaintenanceWindow;
  uptimePercent?: number;
};

export type MaintenanceWindow = {
  id: string;
  terminalId: string;
  startsAt: string;
  endsAt: string;
  reason: string;
  status: 'scheduled' | 'active' | 'done' | 'cancelled';
};

export type TerminalEvent = {
  id: string;
  terminalId: string;
  type: 'online' | 'offline' | 'maintenance_start' | 'maintenance_end';
  at: string;
};

export type TerminalListResponse = { terminals: Terminal[] };

export type TerminalDetailResponse = {
  terminal: Terminal;
  upcomingMaintenance: MaintenanceWindow[];
  recentEvents: TerminalEvent[];
};

export async function fetchMyTerminals(): Promise<Terminal[]> {
  const res = await apiFetch<TerminalListResponse>('/api/me/terminals');
  return res.terminals;
}

export async function fetchMyTerminal(id: string): Promise<TerminalDetailResponse> {
  return apiFetch<TerminalDetailResponse>(`/api/me/terminals/${id}`);
}
