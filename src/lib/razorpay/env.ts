import { requireEnvironmentVariable } from "@/lib/supabase/env";

export function getRazorpayKeyId() {
  return requireEnvironmentVariable("NEXT_PUBLIC_RAZORPAY_KEY_ID");
}

export function getRazorpayKeySecret() {
  return requireEnvironmentVariable("RAZORPAY_KEY_SECRET");
}
