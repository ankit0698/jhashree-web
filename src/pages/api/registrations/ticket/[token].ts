import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { getPaidRegistrationByTicketToken } from "@/lib/registration/server";
import { renderRootsReelsTicket } from "@/lib/tickets/render-pass";

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
    const tokenParam = request.query.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
    const whichParam = request.query.which;
    const whichRaw = Array.isArray(whichParam) ? whichParam[0] : whichParam;
    const which = whichRaw === "guest" ? "guest" : "primary";

    if (!token || typeof token !== "string" || token.length < 16) {
      response.status(400).json({ error: "Invalid ticket token." });
      return;
    }

    const registration = await getPaidRegistrationByTicketToken(token);
    if (!registration?.registration_code) {
      response.status(404).json({ error: "Ticket not found." });
      return;
    }

    const code =
      which === "guest"
        ? registration.registration_code_guest
        : registration.registration_code;

    if (!code) {
      response.status(404).json({ error: "Ticket not found." });
      return;
    }

    const ticket = await renderRootsReelsTicket(code);

    response.setHeader("Content-Type", "image/jpeg");
    response.setHeader(
      "Content-Disposition",
      `inline; filename="roots-reels-ticket-${code}.jpeg"`,
    );
    response.status(200).send(ticket);
  } catch (error) {
    console.error("[registration] ticket failed", error);
    sendApiError(error, response);
  }
}
