import {
  AGE_GROUPS,
  ATTENDEE_TYPES,
  COMING_WITH_OPTIONS,
  HEARD_FROM_OPTIONS,
  INTEREST_OPTIONS,
  type AgeGroup,
  type AttendeeType,
  type ComingWith,
  type HeardFrom,
  type Interest,
  type RegistrationInput,
} from "@/types/registration";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AGE_VALUES = new Set<string>(AGE_GROUPS.map((item) => item.value));
const ATTENDEE_VALUES = new Set<string>(ATTENDEE_TYPES.map((item) => item.value));
const COMING_VALUES = new Set<string>(
  COMING_WITH_OPTIONS.map((item) => item.value),
);
const INTEREST_VALUES = new Set<string>(
  INTEREST_OPTIONS.map((item) => item.value),
);
const HEARD_VALUES = new Set<string>(HEARD_FROM_OPTIONS.map((item) => item.value));

export class RegistrationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(
  value: unknown,
  field: string,
  maximumLength: number,
) {
  if (typeof value !== "string") {
    throw new RegistrationValidationError(`${field} is required.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new RegistrationValidationError(`${field} is required.`);
  }
  if (normalized.length > maximumLength) {
    throw new RegistrationValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }
  return normalized;
}

function readOptionalString(
  value: unknown,
  field: string,
  maximumLength: number,
) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new RegistrationValidationError(`${field} is invalid.`);
  }
  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length > maximumLength) {
    throw new RegistrationValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }
  return normalized;
}

export function validateRegistrationInput(value: unknown): RegistrationInput {
  if (!isRecord(value)) {
    throw new RegistrationValidationError("Invalid registration data.");
  }

  const fullName = readRequiredString(value.fullName, "Full name", 160);
  const contactNumber = readRequiredString(
    value.contactNumber,
    "Contact number",
    30,
  );
  const email = readRequiredString(value.email, "Email address", 254);

  if (!PHONE_PATTERN.test(contactNumber)) {
    throw new RegistrationValidationError("Enter a valid WhatsApp number.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new RegistrationValidationError("Enter a valid email address.");
  }

  if (typeof value.ageGroup !== "string" || !AGE_VALUES.has(value.ageGroup)) {
    throw new RegistrationValidationError("Select an age group.");
  }

  const city = readRequiredString(value.city, "City / town", 120);
  const district = readRequiredString(value.district, "District", 120);
  const state = readRequiredString(value.state, "State", 120);

  if (
    typeof value.attendeeType !== "string" ||
    !ATTENDEE_VALUES.has(value.attendeeType)
  ) {
    throw new RegistrationValidationError("Select what best describes you.");
  }
  const attendeeType = value.attendeeType as AttendeeType;
  const attendeeTypeOther = readOptionalString(
    value.attendeeTypeOther,
    "Other description",
    120,
  );
  if (attendeeType === "other" && !attendeeTypeOther) {
    throw new RegistrationValidationError("Please specify what describes you.");
  }

  if (
    typeof value.comingWith !== "string" ||
    !COMING_VALUES.has(value.comingWith)
  ) {
    throw new RegistrationValidationError("Select who you are coming with.");
  }

  if (!Array.isArray(value.interests) || value.interests.length === 0) {
    throw new RegistrationValidationError("Select at least one interest.");
  }

  const interests: Interest[] = [];
  for (const item of value.interests) {
    if (typeof item !== "string" || !INTEREST_VALUES.has(item)) {
      throw new RegistrationValidationError("One or more interests are invalid.");
    }
    if (!interests.includes(item as Interest)) {
      interests.push(item as Interest);
    }
  }

  if (
    typeof value.heardFrom !== "string" ||
    !HEARD_VALUES.has(value.heardFrom)
  ) {
    throw new RegistrationValidationError("Select how you heard about us.");
  }
  const heardFrom = value.heardFrom as HeardFrom;
  const heardFromOther = readOptionalString(
    value.heardFromOther,
    "Other source",
    120,
  );
  if (heardFrom === "other" && !heardFromOther) {
    throw new RegistrationValidationError("Please specify how you heard about us.");
  }

  return {
    fullName,
    contactNumber,
    email,
    ageGroup: value.ageGroup as AgeGroup,
    city,
    district,
    state,
    attendeeType,
    attendeeTypeOther: attendeeType === "other" ? attendeeTypeOther : null,
    comingWith: value.comingWith as ComingWith,
    interests,
    heardFrom,
    heardFromOther: heardFrom === "other" ? heardFromOther : null,
  };
}

export function validatePaymentVerification(value: unknown) {
  if (!isRecord(value)) {
    throw new RegistrationValidationError("Invalid payment data.");
  }

  const registrationId = readRequiredString(
    value.registrationId,
    "Registration",
    80,
  );
  const razorpayOrderId = readRequiredString(
    value.razorpayOrderId,
    "Order id",
    120,
  );
  const razorpayPaymentId = readRequiredString(
    value.razorpayPaymentId,
    "Payment id",
    120,
  );
  const razorpaySignature = readRequiredString(
    value.razorpaySignature,
    "Signature",
    256,
  );

  return {
    registrationId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  };
}
