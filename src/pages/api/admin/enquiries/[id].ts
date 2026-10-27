import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { enquiryDocument, serializeEnquiry } from "@/lib/enquiries/server";
import {
  EnquiryValidationError,
  validateEnquiryId,
  validateEnquiryReadFlag,
} from "@/lib/enquiries/validation";
import { requireAdmin } from "@/lib/firebase/require-admin";
import type { Enquiry } from "@/types/enquiry";

type EnquiryResponse = { enquiry: Enquiry } | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<EnquiryResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "PATCH") {
    response.setHeader("Allow", "PATCH");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const id = validateEnquiryId(request.query.id);
    const isRead = validateEnquiryReadFlag(request.body?.isRead);
    const document = enquiryDocument(id);
    const snapshot = await document.get();

    if (!snapshot.exists) {
      throw new EnquiryValidationError("Enquiry not found.");
    }

    await document.update({ isRead });
    response.status(200).json({
      enquiry: serializeEnquiry(await document.get()),
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
