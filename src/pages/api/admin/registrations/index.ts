import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import { listPaidRegistrations } from "@/lib/registration/server";
import type { AdminRegistration } from "@/types/registration";

type RegistrationsAdminResponse =
  | { registrations: AdminRegistration[]; total: number }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegistrationsAdminResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const registrations = await listPaidRegistrations();
    response.status(200).json({
      registrations,
      total: registrations.length,
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
