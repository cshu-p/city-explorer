import { apiFetch } from "./http";

export type Me = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
};

export async function getMe(): Promise<Me> {
  return apiFetch<Me>("/api/me");
}

export async function patchMe(patch: Partial<Pick<Me, "firstName" | "lastName">>): Promise<Me> {
  return apiFetch<Me>("/api/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
