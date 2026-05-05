import { apiFetch } from './fetcher';

export type DocumentType =
  | 'license'
  | 'registration'
  | 'insurance'
  | 'rib'
  | 'vehicle_photos';

export type DocumentStatus = 'missing' | 'pending' | 'approved' | 'rejected';

export type DocumentSummary = {
  type: DocumentType;
  label: string;
  requiredCount: number;
  description: string;
  status: DocumentStatus;
  filesCount: number;
  rejectReason?: string;
  reviewedAt?: string;
  updatedAt?: string;
  documentId?: string;
};

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

export async function fetchDocuments(): Promise<DocumentSummary[]> {
  const res = await apiFetch<{ documents: DocumentSummary[] }>(
    '/api/me/documents',
  );
  return res.documents;
}

async function getSignature(
  documentType: DocumentType,
): Promise<SignedUploadParams> {
  return apiFetch<SignedUploadParams>('/api/uploads/sign', {
    method: 'POST',
    body: JSON.stringify({ scope: 'document', documentType }),
  });
}

type LocalAsset = {
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
  return 'raw'; // pdf etc.
}

/**
 * Uploads one local file to Cloudinary using a signature obtained from the
 * backend. Returns metadata suitable for the /api/me/documents POST body.
 */
async function uploadToCloudinary(
  asset: LocalAsset,
  signature: SignedUploadParams,
): Promise<UploadedFile> {
  const resourceType = inferResourceType(asset.mimeType);
  const url = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`;

  const form = new FormData();
  // RN expects the file shape { uri, name, type }. Cast through unknown.
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

/**
 * Submits a full document type: signs each upload, sends files to Cloudinary,
 * then posts metadata to /api/me/documents which replaces the existing record.
 */
export async function submitDocumentType(
  type: DocumentType,
  assets: LocalAsset[],
): Promise<DocumentSummary[]> {
  if (assets.length === 0) throw new Error('No files selected');

  const uploaded: UploadedFile[] = [];
  for (const asset of assets) {
    const signature = await getSignature(type);
    const file = await uploadToCloudinary(asset, signature);
    uploaded.push(file);
  }

  const res = await apiFetch<{ documents: DocumentSummary[] }>(
    '/api/me/documents',
    {
      method: 'POST',
      body: JSON.stringify({ type, files: uploaded }),
    },
  );
  return res.documents;
}
