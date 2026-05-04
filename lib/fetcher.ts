import { authClient } from "./api";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookie = authClient.getCookie();
  const headers = new Headers(init.headers ?? {});
  if (cookie) headers.set("Cookie", cookie);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${baseURL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}
