import { apiFetch } from './fetcher';

export type CompanyProfile = {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  domain: string;
  sector: string;
  city: string;
  website?: string;
  description?: string;
  founded?: string;
  headquarters?: string;
  employees?: string;
  brandColor?: string;
  logo?: { publicId: string; url: string; bytes: number };
  logoUrl?: string;
  legalName?: string;
  siret?: string;
  vatNumber?: string;
  legalForm?: 'SARL' | 'SAS' | 'SA' | 'EURL' | 'Auto-entrepreneur' | 'Autre';
  status: 'pending' | 'validated' | 'rejected';
  budgetTotal: number;
  campaignsCount: number;
  createdAt: string;
};

export async function fetchMyCompany(): Promise<CompanyProfile> {
  const res = await apiFetch<{ company: CompanyProfile }>('/api/me/company');
  return res.company;
}

export type ProfileUpdateInput = {
  phone?: string;
  city?: string;
};

export type ProfileUpdateResponse = {
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    cityChangedAt?: string;
  };
};

export async function updateProfile(
  input: ProfileUpdateInput,
): Promise<ProfileUpdateResponse> {
  return apiFetch<ProfileUpdateResponse>('/api/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
