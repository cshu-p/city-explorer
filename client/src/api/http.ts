const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3007";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });


  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let data: any = null;
  if (text && contentType.includes("application/json")) {
    data = JSON.parse(text);
  }

  if (!res.ok) {
    const msg =
      data?.message ??
      (text?.startsWith("<!DOCTYPE")
        ? `Request failed: ${res.status} (received HTML, likely wrong API_BASE or route)`
        : `Request failed: ${res.status}`);
    throw new Error(msg);
  }

  return data as T;
}
