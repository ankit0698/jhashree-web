import type { NextApiRequest, NextApiResponse } from "next";

import { buildRegistrationsPdf } from "@/lib/admin/pdf-export";
import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import { listAllRegistrations } from "@/lib/registration/server";

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
    const registrations = await listAllRegistrations();
    const pdf = await buildRegistrationsPdf(registrations);
    const stamp = new Date().toISOString().slice(0, 10);

    response.setHeader("Content-Type", "application/pdf");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="jhashree-event-registrations-${stamp}.pdf"`,
    );
    response.status(200).send(pdf);
  } catch (error) {
    sendApiError(error, response);
  }
}
