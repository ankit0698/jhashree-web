import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { createEnquiry } from "@/lib/enquiries/server";
import { validateEnquiryInput } from "@/lib/enquiries/validation";

type EnquiryResponse =
  | { id: string; submitted: true }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<EnquiryResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const input = validateEnquiryInput(request.body);
    const enquiry = await createEnquiry(input);
    response.status(201).json({ id: enquiry.id, submitted: true });
  } catch (error) {
    sendApiError(error, response);
  }
}
