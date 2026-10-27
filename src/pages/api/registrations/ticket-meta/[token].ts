import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { getPaidRegistrationByTicketToken } from "@/lib/registration/server";

type TicketMetaResponse =
  | {
      registrationCode: string;
      registrationCodeGuest: string | null;
      passesCount: number;
      fullName: string;
    }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<TicketMetaResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const tokenParam = request.query.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    if (!token || typeof token !== "string" || token.length < 16) {
      response.status(400).json({ error: "Invalid ticket token." });
      return;
    }

    const registration = await getPaidRegistrationByTicketToken(token);
    if (!registration?.registration_code) {
      response.status(404).json({ error: "Ticket not found." });
      return;
    }

    response.status(200).json({
      registrationCode: registration.registration_code,
      registrationCodeGuest: registration.registration_code_guest,
      passesCount: registration.passes_count,
      fullName: registration.full_name,
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
