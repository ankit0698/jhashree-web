import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { createSurveyApplication } from "@/lib/survey/server";
import { validateSurveyApplicationInput } from "@/lib/survey/validation";

type SurveyResponse =
  | { id: string; submitted: true }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SurveyResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const input = validateSurveyApplicationInput(request.body);
    const application = await createSurveyApplication(input);
    response.status(201).json({ id: application.id, submitted: true });
  } catch (error) {
    sendApiError(error, response);
  }
}
