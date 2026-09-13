import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { getRazorpayKeyId } from "@/lib/razorpay/env";
import { createPendingRegistration } from "@/lib/registration/server";
import { validateRegistrationInput } from "@/lib/registration/validation";
import { PASS_CURRENCY, PASS_PRICE_PAISE } from "@/types/registration";

type CreateOrderResponse =
  | {
      registrationId: string;
      orderId: string;
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
  response: NextApiResponse<CreateOrderResponse>,
) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const input = validateRegistrationInput(request.body);
    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount: PASS_PRICE_PAISE,
      currency: PASS_CURRENCY,
      receipt: `rr2_${Date.now()}`,
      notes: { event: "roots_reels_s2" },
    });

    const registration = await createPendingRegistration(input, order.id);

    response.status(201).json({
      registrationId: registration.id,
      orderId: order.id,
      amount: registration.amountPaise,
      currency: registration.currency,
      keyId: getRazorpayKeyId(),
      passesCount: registration.passesCount,
      promo: registration.promo,
      bogoAvailable: registration.bogoAvailable,
      bogoRemaining: registration.bogoRemaining,
    });
  } catch (error) {
    console.error("[registration] create-order failed", error);
    sendApiError(error, response);
  }
}
