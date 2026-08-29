import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import { listSurveyApplications } from "@/lib/survey/server";
import type { SurveyApplication } from "@/types/survey";

type SurveyAdminResponse =
  | { applications: SurveyApplication[]; total: number }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SurveyAdminResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const applications = await listSurveyApplications();
    response.status(200).json({
      applications,
      total: applications.length,
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
