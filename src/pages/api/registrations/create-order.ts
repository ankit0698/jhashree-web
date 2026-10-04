import type { NextApiRequest, NextApiResponse } from "next";

type CreateOrderResponse = { error: string };

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

  response.status(403).json({
    error:
      "Registration for Roots & Reels Season 2 is closed. New tickets are no longer available.",
  });
}
