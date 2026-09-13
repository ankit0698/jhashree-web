import Razorpay from "razorpay";

import { getRazorpayKeyId, getRazorpayKeySecret } from "@/lib/razorpay/env";

let client: Razorpay | null = null;

export function getRazorpayClient() {
  if (!client) {
    client = new Razorpay({
      key_id: getRazorpayKeyId(),
      key_secret: getRazorpayKeySecret(),
    });
  }

  return client;
}
