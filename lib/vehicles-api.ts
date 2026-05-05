import { apiFetch } from './fetcher';

export type VehicleType = 'Berline' | 'SUV' | 'Utilitaire' | 'Autre';

export type VehicleInspection = {
  expiresAt?: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  fileUrl?: string;
  daysUntilExpiry?: number;
};

export type VehiclePhoto = {
  publicId: string;
  url: string;
  resourceType: 'image' | 'raw' | 'video';
  bytes: number;
  uploadedAt: string;
};

export type Vehicle = {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  type: VehicleType;
  isActive: boolean;
  inspection?: VehicleInspection;
  photos: VehiclePhoto[];
  createdAt: string;
  updatedAt: string;
};

export type VehiclesResponse = {
  vehicles: Vehicle[];
  max: number;
};

export async function fetchVehicles(): Promise<VehiclesResponse> {
  return apiFetch<VehiclesResponse>('/api/me/vehicles');
}

export type CreateVehicleInput = {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  type: VehicleType;
  inspectionExpiresAt?: string;
};

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const res = await apiFetch<{ vehicle: Vehicle }>('/api/me/vehicles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.vehicle;
}

export type UpdateVehicleInput = Partial<CreateVehicleInput> & {
  inspectionExpiresAt?: string | null;
};

export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput,
): Promise<Vehicle> {
  const res = await apiFetch<{ vehicle: Vehicle }>(`/api/me/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return res.vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiFetch(`/api/me/vehicles/${id}`, { method: 'DELETE' });
}

export async function activateVehicle(id: string): Promise<Vehicle[]> {
  const res = await apiFetch<{ vehicles: Vehicle[] }>(
    `/api/me/vehicles/${id}/activate`,
    { method: 'POST' },
  );
  return res.vehicles;
}

type AddPhotoFile = {
  publicId: string;
  url: string;
  resourceType: 'image' | 'raw' | 'video';
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
};

export async function addVehiclePhotos(
  id: string,
  files: AddPhotoFile[],
): Promise<Vehicle> {
  const res = await apiFetch<{ vehicle: Vehicle }>(
    `/api/me/vehicles/${id}/photos`,
    {
      method: 'POST',
      body: JSON.stringify({ files }),
    },
  );
  return res.vehicle;
}

export async function deleteVehiclePhoto(
  id: string,
  publicId: string,
): Promise<Vehicle> {
  const res = await apiFetch<{ vehicle: Vehicle }>(
    `/api/me/vehicles/${id}/photos`,
    {
      method: 'DELETE',
      body: JSON.stringify({ publicId }),
    },
  );
  return res.vehicle;
}
