import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import { listSamaCreatorApplications } from "@/lib/sama/server";
import type { SamaCreatorApplication } from "@/types/sama";

type SamaAdminResponse =
  | { applications: SamaCreatorApplication[]; total: number }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SamaAdminResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const applications = await listSamaCreatorApplications();
    response.status(200).json({
      applications,
      total: applications.length,
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
