import { createHmac, timingSafeEqual } from "node:crypto";

import { getRazorpayKeySecret } from "@/lib/razorpay/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  BOGO_LIMIT,
  EVENT_REGISTRATIONS_TABLE,
  PASS_CURRENCY,
  PASS_PRICE_PAISE,
  REGISTRATION_CODE_PREFIX,
  type AdminRegistration,
  type AgeGroup,
  type AttendeeType,
  type ComingWith,
  type HeardFrom,
  type Interest,
  type RegistrationConfirmation,
  type RegistrationInput,
  type RegistrationPromo,
  type RegistrationRow,
  type RegistrationStatus,
} from "@/types/registration";

type RegistrationDbRow = RegistrationRow & {
  id: string;
  created_at: string | null;
  updated_at: string | null;
};

export class RegistrationPaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationPaymentError";
  }
}

function formatRegistrationCode(serial: number) {
  return `${REGISTRATION_CODE_PREFIX}-${String(serial).padStart(3, "0")}`;
}

function toConfirmation(row: RegistrationDbRow): RegistrationConfirmation {
  if (!row.registration_code) {
    throw new RegistrationPaymentError("Registration code is missing.");
  }

  return {
    id: row.id,
    registrationCode: row.registration_code,
    registrationCodeGuest: row.registration_code_guest,
    ticketToken: row.ticket_token,
    passesCount: row.passes_count,
    promo: row.promo,
    amountPaise: row.amount_paise,
    fullName: row.full_name,
    email: row.email,
    contactNumber: row.contact_number,
  };
}

export async function countPaidBogoSlots() {
  const supabase = getSupabaseAdminClient();
  const { count, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("status", "paid")
    .eq("promo", "bogo_first_50");

  if (error) {
    console.error("[registration] bogo count failed", error);
    throw new Error("Could not check pass availability.");
  }

  return count ?? 0;
}

export async function getPassOffer() {
  const used = await countPaidBogoSlots();
  const bogoAvailable = used < BOGO_LIMIT;

  return {
    amountPaise: PASS_PRICE_PAISE,
    currency: PASS_CURRENCY,
    bogoAvailable,
    bogoRemaining: Math.max(BOGO_LIMIT - used, 0),
    passesCount: bogoAvailable ? 2 : 1,
    promo: (bogoAvailable ? "bogo_first_50" : "none") as RegistrationPromo,
  };
}

export async function createPendingRegistration(
  input: RegistrationInput,
  razorpayOrderId: string,
) {
  const offer = await getPassOffer();
  const supabase = getSupabaseAdminClient();

  const row: Omit<RegistrationRow, "ticket_token"> & {
    ticket_token?: string;
  } = {
    full_name: input.fullName,
    contact_number: input.contactNumber,
    email: input.email,
    age_group: input.ageGroup,
    city: input.city,
    district: input.district,
    state: input.state,
    attendee_type: input.attendeeType,
    attendee_type_other: input.attendeeTypeOther,
    coming_with: input.comingWith,
    interests: input.interests,
    heard_from: input.heardFrom,
    heard_from_other: input.heardFromOther,
    amount_paise: offer.amountPaise,
    currency: offer.currency,
    passes_count: offer.passesCount,
    promo: offer.promo,
    bogo_slot: null,
    status: "pending",
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: null,
    razorpay_signature: null,
    paid_at: null,
    registration_code: null,
    registration_code_guest: null,
    source: "web",
  };

  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .insert(row)
    .select("id, passes_count, promo, amount_paise, currency, ticket_token")
    .single();

  if (error || !data) {
    console.error("[registration] create pending failed", error);
    throw new Error("Registration could not be started.");
  }

  return {
    id: data.id as string,
    passesCount: data.passes_count as number,
    promo: data.promo as RegistrationPromo,
    amountPaise: data.amount_paise as number,
    currency: data.currency as string,
    ticketToken: data.ticket_token as string,
    bogoAvailable: offer.bogoAvailable,
    bogoRemaining: offer.bogoRemaining,
  };
}

export function verifyRazorpaySignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const payload = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
  const expected = createHmac("sha256", getRazorpayKeySecret())
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(input.razorpaySignature, "utf8");

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    throw new RegistrationPaymentError("Payment signature is invalid.");
  }
}

async function getRegistrationById(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[registration] fetch failed", error);
    throw new Error("Registration could not be loaded.");
  }

  return data as RegistrationDbRow | null;
}

async function nextRegistrationSerial() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .select("registration_code, registration_code_guest")
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[registration] serial lookup failed", error);
    throw new Error("Could not assign registration code.");
  }

  let max = 0;
  for (const row of data ?? []) {
    for (const code of [
      row.registration_code as string | null,
      row.registration_code_guest as string | null,
    ]) {
      if (!code?.startsWith(`${REGISTRATION_CODE_PREFIX}-`)) continue;
      const serial = Number(code.slice(REGISTRATION_CODE_PREFIX.length + 1));
      if (Number.isInteger(serial) && serial > max) max = serial;
    }
  }

  return max + 1;
}

export async function markRegistrationPaid(input: {
  registrationId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<RegistrationConfirmation> {
  verifyRazorpaySignature(input);

  const existing = await getRegistrationById(input.registrationId);
  if (!existing) {
    throw new RegistrationPaymentError("Registration not found.");
  }

  if (existing.razorpay_order_id !== input.razorpayOrderId) {
    throw new RegistrationPaymentError("Order does not match this registration.");
  }

  if (existing.status === "paid" && existing.registration_code) {
    if (
      existing.razorpay_payment_id &&
      existing.razorpay_payment_id !== input.razorpayPaymentId
    ) {
      throw new RegistrationPaymentError("Registration already paid.");
    }
    return toConfirmation(existing);
  }

  if (existing.status !== "pending") {
    throw new RegistrationPaymentError("Registration is not awaiting payment.");
  }

  const usedBogo = await countPaidBogoSlots();
  const bogoAvailable = usedBogo < BOGO_LIMIT;
  const passesCount = bogoAvailable ? 2 : 1;
  const promo: RegistrationPromo = bogoAvailable ? "bogo_first_50" : "none";
  const bogoSlot = bogoAvailable ? usedBogo + 1 : null;
  const nextSerial = await nextRegistrationSerial();
  const registrationCode = formatRegistrationCode(nextSerial);
  const registrationCodeGuest = bogoAvailable
    ? formatRegistrationCode(nextSerial + 1)
    : null;
  const paidAt = new Date().toISOString();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .update({
      status: "paid" satisfies RegistrationStatus,
      passes_count: passesCount,
      promo,
      bogo_slot: bogoSlot,
      registration_code: registrationCode,
      registration_code_guest: registrationCodeGuest,
      razorpay_payment_id: input.razorpayPaymentId,
      razorpay_signature: input.razorpaySignature,
      paid_at: paidAt,
      amount_paise: PASS_PRICE_PAISE,
      currency: PASS_CURRENCY,
    })
    .eq("id", input.registrationId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[registration] mark paid failed", error);
    if (error.code === "23505") {
      throw new RegistrationPaymentError(
        "Could not reserve pass slot. Please retry verification.",
      );
    }
    throw new Error("Payment could not be confirmed.");
  }

  if (!data) {
    const again = await getRegistrationById(input.registrationId);
    if (again?.status === "paid" && again.registration_code) {
      return toConfirmation(again);
    }
    throw new RegistrationPaymentError("Payment could not be confirmed.");
  }

  return toConfirmation(data as RegistrationDbRow);
}

export async function getPaidRegistrationByTicketToken(token: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .select("*")
    .eq("ticket_token", token)
    .eq("status", "paid")
    .maybeSingle();

  if (error) {
    console.error("[registration] ticket lookup failed", error);
    throw new Error("Ticket could not be loaded.");
  }

  return data as RegistrationDbRow | null;
}

function serializeAdminRegistration(row: RegistrationDbRow): AdminRegistration {
  return {
    id: row.id,
    fullName: row.full_name,
    contactNumber: row.contact_number,
    email: row.email,
    ageGroup: row.age_group as AgeGroup,
    city: row.city,
    district: row.district,
    state: row.state,
    attendeeType: row.attendee_type as AttendeeType,
    attendeeTypeOther: row.attendee_type_other,
    comingWith: row.coming_with as ComingWith,
    interests: row.interests as Interest[],
    heardFrom: row.heard_from as HeardFrom,
    heardFromOther: row.heard_from_other,
    amountPaise: row.amount_paise,
    currency: row.currency,
    passesCount: row.passes_count,
    promo: row.promo,
    bogoSlot: row.bogo_slot,
    status: row.status,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    paidAt: row.paid_at,
    registrationCode: row.registration_code,
    registrationCodeGuest: row.registration_code_guest,
    ticketToken: row.ticket_token,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPaidRegistrations(): Promise<AdminRegistration[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(EVENT_REGISTRATIONS_TABLE)
    .select("*")
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  if (error) {
    console.error("[registration] list paid failed", error);
    throw new Error("Registrations could not be loaded.");
  }

  return (data as RegistrationDbRow[]).map(serializeAdminRegistration);
}
