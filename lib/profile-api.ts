import { apiFetch } from './fetcher';

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
