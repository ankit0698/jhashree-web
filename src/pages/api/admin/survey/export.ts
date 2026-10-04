import type { NextApiRequest, NextApiResponse } from "next";

import { buildSurveyApplicationsPdf } from "@/lib/admin/pdf-export";
import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import { listSurveyApplications } from "@/lib/survey/server";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
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
    const pdf = await buildSurveyApplicationsPdf(applications);
    const stamp = new Date().toISOString().slice(0, 10);

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="jhashree-survey-applications-${stamp}.pdf"`,
    );
    response.status(200).send(pdf);
  } catch (error) {
    sendApiError(error, response);
  }
}
