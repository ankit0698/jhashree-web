import type { User } from "firebase/auth";

import type { Enquiry } from "@/types/enquiry";

type ErrorResponse = {
  error?: string;
};

export async function getAdminEnquiries(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/enquiries", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const result = (await response.json().catch(() => ({}))) as {
    enquiries?: Enquiry[];
  } & ErrorResponse;

  if (!response.ok) {
    throw new Error(result.error || "The enquiries could not be loaded.");
  }

  return result.enquiries ?? [];
}

export async function updateAdminEnquiryReadStatus(
  user: User,
  id: string,
  isRead: boolean,
) {
  const idToken = await user.getIdToken();
  const response = await fetch(
    `/api/admin/enquiries/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ isRead }),
    },
  );
  const result = (await response.json().catch(() => ({}))) as {
    enquiry?: Enquiry;
  } & ErrorResponse;

  if (!response.ok || !result.enquiry) {
    throw new Error(result.error || "The enquiry status could not be updated.");
  }

  return result.enquiry;
}
