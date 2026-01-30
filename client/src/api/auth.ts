import { apiFetch, setToken, clearToken } from "./http";

export type LoginResponse = { token: string };
export type LoginRequest = { username: string; password: string };

export async function login(req: LoginRequest): Promise<void> {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(req),
  });
  setToken(res.token);
}

export type RegisterRequest = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};

// assumes your backend returns { token } on success
export async function register(req: RegisterRequest): Promise<void> {
  const res = await apiFetch<LoginResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
  });
  setToken(res.token);
}

export function logout() {
  clearToken();
}
