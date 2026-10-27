import type { User } from "firebase/auth";

import type { SamaCreatorApplication } from "@/types/sama";

type ErrorResponse = {
  error?: string;
};

export async function getAdminSamaApplications(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/sama", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const result = (await response.json().catch(() => ({}))) as {
    applications?: SamaCreatorApplication[];
    total?: number;
  } & ErrorResponse;

  if (!response.ok) {
    throw new Error(result.error || "Let's Play Sama responses could not be loaded.");
  }

  return {
    applications: result.applications ?? [],
    total: result.total ?? result.applications?.length ?? 0,
  };
}

export async function downloadSamaApplicationsPdf(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/sama/export", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as ErrorResponse;
    throw new Error(result.error || "Let's Play Sama PDF could not be downloaded.");
  }

  const blob = await response.blob();
  const stamp = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jhashree-lets-play-sama-${stamp}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
