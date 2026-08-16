import type { User } from "firebase/auth";

import type { Work, WorkInput, WorkStatus } from "@/types/work";

type ErrorResponse = {
  error?: string;
};

async function adminRequest<T>(
  user: User,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const idToken = await user.getIdToken();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...init?.headers,
    },
  });

  const result = (await response.json().catch(() => ({}))) as T & ErrorResponse;

  if (!response.ok) {
    throw new Error(result.error || "The request could not be completed.");
  }

  return result;
}

export async function getAdminWorks(user: User) {
  const result = await adminRequest<{ works: Work[] }>(
    user,
    "/api/admin/works",
  );
  return result.works;
}

export async function getAdminWork(user: User, id: string) {
  const result = await adminRequest<{ work: Work }>(
    user,
    `/api/admin/works/${encodeURIComponent(id)}`,
  );
  return result.work;
}

export async function createAdminWork(
  user: User,
  id: string,
  work: WorkInput,
) {
  const result = await adminRequest<{ work: Work }>(user, "/api/admin/works", {
    method: "POST",
    body: JSON.stringify({ id, work }),
  });
  return result.work;
}

export async function updateAdminWork(
  user: User,
  id: string,
  work: WorkInput,
) {
  const result = await adminRequest<{ work: Work }>(
    user,
    `/api/admin/works/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify({ work }),
    },
  );
  return result.work;
}

export async function updateAdminWorkStatus(
  user: User,
  id: string,
  status: WorkStatus,
) {
  const result = await adminRequest<{ work: Work }>(
    user,
    `/api/admin/works/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  return result.work;
}

export async function deleteAdminWork(user: User, id: string) {
  await adminRequest<{ deleted: true }>(
    user,
    `/api/admin/works/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
