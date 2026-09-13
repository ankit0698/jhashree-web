import type { User } from "firebase/auth";

import type { AdminRegistration } from "@/types/registration";

type ErrorResponse = {
  error?: string;
};

export async function getAdminRegistrations(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/registrations", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const result = (await response.json().catch(() => ({}))) as {
    registrations?: AdminRegistration[];
    total?: number;
  } & ErrorResponse;

  if (!response.ok) {
    throw new Error(result.error || "Registrations could not be loaded.");
  }

  return {
    registrations: result.registrations ?? [],
    total: result.total ?? result.registrations?.length ?? 0,
  };
}
