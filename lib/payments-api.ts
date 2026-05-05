import { apiFetch } from './fetcher';

export type TransactionType =
  | 'campaign_completion'
  | 'withdrawal_debit'
  | 'withdrawal_refund'
  | 'adjustment';

export type TransactionTier = 'pending' | 'available';

export type Transaction = {
  id: string;
  type: TransactionType;
  amountCents: number;
  tier: TransactionTier;
  availableAt: string;
  createdAt: string;
  campaignId?: string;
  withdrawalId?: string;
  description: string;
  meta?: Record<string, unknown>;
};

export type WalletResponse = {
  balances: {
    availableBalanceCents: number;
    pendingBalanceCents: number;
    withdrawnTotalCents: number;
  };
  config: {
    withdrawalMinCents: number;
    pendingHoldDays: number;
  };
  transactions: Transaction[];
};

export type TransactionDetail = {
  transaction: Transaction;
  timeline: { label: string; date: string }[];
  context: {
    campaign?: {
      id: string;
      title: string;
      brand: string;
      endDate: string;
    };
    withdrawal?: {
      id: string;
      status: 'pending' | 'paid' | 'rejected';
      processedAt?: string;
      payoutReference?: string;
      rejectReason?: string;
    };
  };
};

export type StatementSummary = {
  period: string;
  monthLabel: string;
  incomeCents: number;
  withdrawnCents: number;
  netCents: number;
  periods: { period: string; label: string }[];
  transactions: Transaction[];
};

export async function fetchWallet(): Promise<WalletResponse> {
  return apiFetch<WalletResponse>('/api/me/wallet');
}

export async function fetchTransactionDetail(
  id: string,
): Promise<TransactionDetail> {
  return apiFetch<TransactionDetail>(`/api/me/transactions/${id}`);
}

export async function requestWithdrawal(
  amountCents: number,
): Promise<{ id: string; amountCents: number; status: string }> {
  const res = await apiFetch<{
    withdrawal: { id: string; amountCents: number; status: string };
  }>('/api/me/withdrawals', {
    method: 'POST',
    body: JSON.stringify({ amountCents }),
  });
  return res.withdrawal;
}

export async function fetchStatement(
  period?: string,
): Promise<StatementSummary> {
  const qs = period ? `?period=${period}` : '';
  return apiFetch<StatementSummary>(`/api/me/statements${qs}`);
}

export async function updateBankAccount(args: {
  iban: string;
  bankName?: string;
  accountHolder?: string;
}): Promise<void> {
  await apiFetch('/api/me/bank-account', {
    method: 'PUT',
    body: JSON.stringify(args),
  });
}
