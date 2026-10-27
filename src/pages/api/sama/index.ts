import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { createSamaCreatorApplication } from "@/lib/sama/server";
import { validateSamaCreatorApplicationInput } from "@/lib/sama/validation";

type SamaResponse = { id: string; submitted: true } | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SamaResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const input = validateSamaCreatorApplicationInput(request.body);
    const application = await createSamaCreatorApplication(input);
    response.status(201).json({ id: application.id, submitted: true });
  } catch (error) {
    sendApiError(error, response);
  }
}
