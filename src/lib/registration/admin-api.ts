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

export async function downloadRegistrationsPdf(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/registrations/export", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as ErrorResponse;
    throw new Error(result.error || "Registrations PDF could not be downloaded.");
  }

  const blob = await response.blob();
  const stamp = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jhashree-event-registrations-${stamp}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
