import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { getPassOffer } from "@/lib/registration/server";
import { getRazorpayKeyId } from "@/lib/razorpay/env";

type OfferResponse =
  | {
      amount: number;
      currency: string;
      keyId: string;
      passesCount: number;
      promo: string;
      bogoAvailable: boolean;
      bogoRemaining: number;
    }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<OfferResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const offer = await getPassOffer();
    response.status(200).json({
      amount: offer.amountPaise,
      currency: offer.currency,
      keyId: getRazorpayKeyId(),
      passesCount: offer.passesCount,
      promo: offer.promo,
      bogoAvailable: offer.bogoAvailable,
      bogoRemaining: offer.bogoRemaining,
    });
  } catch (error) {
    sendApiError(error, response);
  }
}
