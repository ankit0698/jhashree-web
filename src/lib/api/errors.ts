import type { NextApiResponse } from "next";

import { AdminAuthenticationError } from "@/lib/firebase/require-admin";
import { WorkValidationError } from "@/lib/works/validation";

type ApiErrorResponse = {
  error: string;
};

export function sendApiError(
  error: unknown,
  response: NextApiResponse<ApiErrorResponse>,
) {
  if (error instanceof AdminAuthenticationError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof WorkValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (
    error instanceof Error &&
    error.message.startsWith("Missing required environment variable:")
  ) {
    response.status(500).json({
      error: "Firebase Admin is not configured on the server.",
    });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "The server could not complete this request." });
}
