import { apiFetch } from './fetcher';

export type SignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId?: string;
};

export type UploadedFile = {
  publicId: string;
  url: string;
  resourceType: 'image' | 'raw' | 'video';
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
};

export type LocalAsset = {
  uri: string;
  name?: string;
  mimeType?: string;
};

function inferResourceType(
  mimeType?: string,
): 'image' | 'raw' | 'video' {
  if (!mimeType) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  return 'raw';
}

/**
 * Generic Cloudinary direct upload using a signature obtained from the backend.
 * Use scope='asset' for non-document uploads (e.g. vehicle showcase photos).
 */
export async function uploadAsset(
  asset: LocalAsset,
  scope: 'asset' | 'visual' = 'asset',
): Promise<UploadedFile> {
  const signature = await apiFetch<SignedUploadParams>('/api/uploads/sign', {
    method: 'POST',
    body: JSON.stringify({ scope }),
  });

  const resourceType = inferResourceType(asset.mimeType);
  const url = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`;

  const form = new FormData();
  form.append('file', {
    uri: asset.uri,
    name: asset.name ?? 'upload',
    type: asset.mimeType ?? 'application/octet-stream',
  } as unknown as Blob);
  form.append('api_key', signature.apiKey);
  form.append('timestamp', String(signature.timestamp));
  form.append('signature', signature.signature);
  form.append('folder', signature.folder);
  if (signature.publicId) form.append('public_id', signature.publicId);

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const body = (await res.json()) as {
    public_id: string;
    secure_url: string;
    resource_type: 'image' | 'raw' | 'video';
    format?: string;
    bytes: number;
    width?: number;
    height?: number;
  };
  return {
    publicId: body.public_id,
    url: body.secure_url,
    resourceType: body.resource_type,
    format: body.format,
    bytes: body.bytes,
    width: body.width,
    height: body.height,
  };
}
