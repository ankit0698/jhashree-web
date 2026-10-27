import type { EnquiryInput } from "@/types/enquiry";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENQUIRY_ID_PATTERN = /^[A-Za-z0-9]{1,128}$/;

export class EnquiryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnquiryValidationError";
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
    throw new EnquiryValidationError(`${field} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new EnquiryValidationError(`${field} is required.`);
  }

  if (normalized.length > maximumLength) {
    throw new EnquiryValidationError(
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
    throw new EnquiryValidationError(`${field} is invalid.`);
  }

  const normalized = value.trim();

  if (!normalized) return null;

  if (normalized.length > maximumLength) {
    throw new EnquiryValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }

  return normalized;
}

export function validateEnquiryInput(value: unknown): EnquiryInput {
  if (!isRecord(value)) {
    throw new EnquiryValidationError("Invalid enquiry data.");
  }

  const title = readRequiredString(value.title, "Query title", 160);
  const description = readRequiredString(
    value.description,
    "Description",
    5000,
  );
  const phone = readOptionalString(value.phone, "Contact number", 30);
  const email = readOptionalString(value.email, "Email", 254);

  if (!phone && !email) {
    throw new EnquiryValidationError(
      "Enter a contact number or an email address.",
    );
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    throw new EnquiryValidationError("Enter a valid contact number.");
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    throw new EnquiryValidationError("Enter a valid email address.");
  }

  return { title, description, phone, email };
}

export function validateEnquiryId(value: unknown) {
  if (typeof value !== "string" || !ENQUIRY_ID_PATTERN.test(value)) {
    throw new EnquiryValidationError("Invalid enquiry ID.");
  }

  return value;
}

export function validateEnquiryReadFlag(value: unknown) {
  if (typeof value !== "boolean") {
    throw new EnquiryValidationError("Read status must be true or false.");
  }

  return value;
}
