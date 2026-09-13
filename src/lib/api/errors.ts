import type { NextApiResponse } from "next";

import { EnquiryValidationError } from "@/lib/enquiries/validation";
import { AdminAuthenticationError } from "@/lib/firebase/require-admin";
import { RegistrationPaymentError } from "@/lib/registration/server";
import { RegistrationValidationError } from "@/lib/registration/validation";
import { SurveyValidationError } from "@/lib/survey/validation";
import { TicketRenderError } from "@/lib/tickets/render-pass";
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

  if (error instanceof TicketRenderError) {
    console.error("[ticket]", error.message);
    response.status(500).json({ error: error.message });
    return;
  }

  if (error instanceof RegistrationPaymentError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (
    error instanceof WorkValidationError ||
    error instanceof EnquiryValidationError ||
    error instanceof SurveyValidationError ||
    error instanceof RegistrationValidationError
  ) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (
    error instanceof Error &&
    error.message.startsWith("Missing required environment variable:")
  ) {
    const isSupabase = error.message.includes("SUPABASE");
    const isRazorpay = error.message.includes("RAZORPAY");
    response.status(500).json({
      error: isSupabase
        ? "Supabase is not configured on the server."
        : isRazorpay
          ? "Razorpay is not configured on the server."
          : "Firebase Admin is not configured on the server.",
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    error: "The server could not complete this request.",
  });
}
