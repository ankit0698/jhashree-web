import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import {
  enquiriesCollection,
  serializeEnquiry,
} from "@/lib/enquiries/server";
import { requireAdmin } from "@/lib/firebase/require-admin";
import type { Enquiry } from "@/types/enquiry";

type EnquiriesResponse = { enquiries: Enquiry[] } | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<EnquiriesResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const snapshot = await enquiriesCollection()
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    response.status(200).json({
      enquiries: snapshot.docs.map(serializeEnquiry),
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
