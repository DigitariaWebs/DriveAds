import { apiFetch } from './fetcher';

export type StockStatus = 'ok' | 'low' | 'critical';

export type Scent = {
  id: string;
  sku: string;
  name: string;
  defaultCapacityMl: number;
  color?: string;
};

export type Cartridge = {
  slot: number;
  scentId?: string;
  scentName?: string;
  scentSku?: string;
  scentColor?: string;
  capacityMl: number;
  levelPercent: number;
  spraysSinceRefill: number;
  lastRefillAt?: string;
  status: StockStatus;
};

export type StockOrderLine = {
  scentId: string;
  scentName?: string;
  qty: number;
};

export type StockOrder = {
  id: string;
  partnerId: string;
  terminalId: string;
  lines: StockOrderLine[];
  status: 'pending' | 'fulfilled' | 'cancelled';
  notes?: string;
  createdAt: string;
  fulfilledAt?: string;
  cancelledAt?: string;
};

export type RefillLog = {
  id: string;
  terminalId: string;
  slot: number;
  scentId: string;
  scentName?: string;
  levelBefore: number;
  levelAfter: number;
  capacityMl: number;
  refilledAt: string;
  refilledBy: string;
  orderId?: string;
};

export async function fetchScents(): Promise<Scent[]> {
  const res = await apiFetch<{ scents: Scent[] }>('/api/me/scents');
  return res.scents;
}

export async function fetchTerminalStock(terminalId: string): Promise<Cartridge[]> {
  const res = await apiFetch<{ cartridges: Cartridge[] }>(
    `/api/me/terminals/${terminalId}/stock`,
  );
  return res.cartridges;
}

export async function fetchTerminalRefills(terminalId: string): Promise<RefillLog[]> {
  const res = await apiFetch<{ refills: RefillLog[] }>(
    `/api/me/terminals/${terminalId}/refills`,
  );
  return res.refills;
}

export async function fetchMyStockOrders(opts?: {
  terminalId?: string;
  status?: StockOrder['status'];
}): Promise<StockOrder[]> {
  const params = new URLSearchParams();
  if (opts?.terminalId) params.set('terminalId', opts.terminalId);
  if (opts?.status) params.set('status', opts.status);
  const qs = params.toString();
  const res = await apiFetch<{ orders: StockOrder[] }>(
    `/api/me/stock-orders${qs ? `?${qs}` : ''}`,
  );
  return res.orders;
}

export async function createStockOrder(input: {
  terminalId: string;
  lines: { scentId: string; qty: number }[];
  notes?: string;
}): Promise<StockOrder> {
  const res = await apiFetch<{ order: StockOrder }>('/api/me/stock-orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.order;
}

export async function cancelStockOrder(orderId: string): Promise<StockOrder> {
  const res = await apiFetch<{ order: StockOrder }>(
    `/api/me/stock-orders/${orderId}`,
    { method: 'DELETE' },
  );
  return res.order;
}
