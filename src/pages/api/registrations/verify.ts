import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { markRegistrationPaid } from "@/lib/registration/server";
import { validatePaymentVerification } from "@/lib/registration/validation";
import type { RegistrationConfirmation } from "@/types/registration";

type VerifyResponse =
  | { confirmation: RegistrationConfirmation }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<VerifyResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const input = validatePaymentVerification(request.body);
    const confirmation = await markRegistrationPaid(input);
    response.status(200).json({ confirmation });
  } catch (error) {
    console.error("[registration] verify failed", error);
    sendApiError(error, response);
  }
}
