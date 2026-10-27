import type { SamaCreatorApplicationInput } from "@/types/sama";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SamaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SamaValidationError";
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
    throw new SamaValidationError(`${field} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new SamaValidationError(`${field} is required.`);
  }

  if (normalized.length > maximumLength) {
    throw new SamaValidationError(
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
    throw new SamaValidationError(`${field} is invalid.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maximumLength) {
    throw new SamaValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }

  return normalized;
}

function readRequiredNonNegativeInteger(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    throw new SamaValidationError(`${field} is required.`);
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.trim().replace(/,/g, ""))
        : NaN;

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new SamaValidationError(
      `${field} must be a whole number of 0 or more.`,
    );
  }

  if (parsed > 1_000_000_000) {
    throw new SamaValidationError(`${field} is too large.`);
  }

  return parsed;
}

function readOptionalNonNegativeInteger(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return readRequiredNonNegativeInteger(value, field);
}

function readBoolean(value: unknown, field: string) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "yes") {
    return true;
  }

  if (value === "false" || value === "no") {
    return false;
  }

  throw new SamaValidationError(`${field} is required.`);
}

export function validateSamaCreatorApplicationInput(
  value: unknown,
): SamaCreatorApplicationInput {
  if (!isRecord(value)) {
    throw new SamaValidationError("Invalid application data.");
  }

  const fullName = readRequiredString(value.fullName, "Name", 160);
  const contactNumber = readRequiredString(
    value.contactNumber,
    "Contact",
    30,
  );
  const email = readRequiredString(value.email, "Email", 254);
  const address = readRequiredString(value.address, "Address", 500);
  const contentType = readRequiredString(
    value.contentType,
    "Content type",
    500,
  );

  if (!PHONE_PATTERN.test(contactNumber)) {
    throw new SamaValidationError("Enter a valid contact number.");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new SamaValidationError("Enter a valid email address.");
  }

  const instagramUsername = readRequiredString(
    value.instagramUsername,
    "Instagram username",
    120,
  ).replace(/^@+/, "");
  const facebookLink = readOptionalString(
    value.facebookLink,
    "Facebook link/username",
    500,
  );
  const facebookFollowers = readOptionalNonNegativeInteger(
    value.facebookFollowers,
    "Facebook followers",
  );
  const youtubeLink = readOptionalString(
    value.youtubeLink,
    "YouTube link/username",
    500,
  );
  const youtubeSubscribers = readOptionalNonNegativeInteger(
    value.youtubeSubscribers,
    "YouTube subscribers",
  );

  if (!facebookLink && facebookFollowers !== null) {
    throw new SamaValidationError(
      "Add a Facebook link or username if you enter a follower count.",
    );
  }

  if (!youtubeLink && youtubeSubscribers !== null) {
    throw new SamaValidationError(
      "Add a YouTube link or username if you enter a subscriber count.",
    );
  }

  const wantsToPromoteCulture = readBoolean(
    value.wantsToPromoteCulture,
    "Whether you want to promote your culture",
  );
  const promoteCultureHow = readOptionalString(
    value.promoteCultureHow,
    "How you would promote your culture",
    5000,
  );
  const promoteCultureWhy = readOptionalString(
    value.promoteCultureWhy,
    "Why you would not promote your culture",
    5000,
  );

  if (wantsToPromoteCulture && !promoteCultureHow) {
    throw new SamaValidationError("Tell us how you would promote your culture.");
  }

  if (!wantsToPromoteCulture && !promoteCultureWhy) {
    throw new SamaValidationError(
      "Tell us why you would not promote your culture.",
    );
  }

  return {
    fullName,
    contactNumber,
    email,
    address,
    contentType,
    instagramUsername,
    instagramFollowers: readRequiredNonNegativeInteger(
      value.instagramFollowers,
      "Instagram followers",
    ),
    facebookLink,
    facebookFollowers: facebookLink ? facebookFollowers : null,
    youtubeLink,
    youtubeSubscribers: youtubeLink ? youtubeSubscribers : null,
    wantsToPromoteCulture,
    promoteCultureHow: wantsToPromoteCulture ? promoteCultureHow : null,
    promoteCultureWhy: wantsToPromoteCulture ? null : promoteCultureWhy,
    knowsSamaChakewa: readBoolean(
      value.knowsSamaChakewa,
      "Whether you know about Sama Chakewa",
    ),
    wantsToJoinEvent: readBoolean(
      value.wantsToJoinEvent,
      "Whether you want to join the Sama Chakewa event",
    ),
    interestedInCampaign: readBoolean(
      value.interestedInCampaign,
      "Whether you want to join the cultural promotion campaign",
    ),
  };
}
