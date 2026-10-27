import {
  SURVEY_NICHES,
  SURVEY_PLATFORMS,
  type SurveyApplicationInput,
  type SurveyNiche,
  type SurveyPlatform,
} from "@/types/survey";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NICHE_VALUES = new Set<string>(SURVEY_NICHES.map((item) => item.value));
const PLATFORM_VALUES = new Set<string>(
  SURVEY_PLATFORMS.map((item) => item.value),
);

export class SurveyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SurveyValidationError";
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
    throw new SurveyValidationError(`${field} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new SurveyValidationError(`${field} is required.`);
  }

  if (normalized.length > maximumLength) {
    throw new SurveyValidationError(
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
    throw new SurveyValidationError(`${field} is invalid.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maximumLength) {
    throw new SurveyValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }

  return normalized;
}

function readOptionalNonNegativeInteger(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.trim().replace(/,/g, ""))
        : NaN;

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new SurveyValidationError(`${field} must be a whole number of 0 or more.`);
  }

  if (parsed > 1_000_000_000) {
    throw new SurveyValidationError(`${field} is too large.`);
  }

  return parsed;
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

  throw new SurveyValidationError(`${field} is required.`);
}

export function validateSurveyApplicationInput(
  value: unknown,
): SurveyApplicationInput {
  if (!isRecord(value)) {
    throw new SurveyValidationError("Invalid application data.");
  }

  const fullName = readRequiredString(value.fullName, "Full name", 160);
  const contactNumber = readRequiredString(
    value.contactNumber,
    "Contact number",
    30,
  );
  const email = readRequiredString(value.email, "Email address", 254);

  if (!PHONE_PATTERN.test(contactNumber)) {
    throw new SurveyValidationError("Enter a valid WhatsApp contact number.");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new SurveyValidationError("Enter a valid email address.");
  }

  if (
    typeof value.primaryNiche !== "string" ||
    !NICHE_VALUES.has(value.primaryNiche)
  ) {
    throw new SurveyValidationError("Select a primary niche / category.");
  }

  const primaryNiche = value.primaryNiche as SurveyNiche;
  const primaryNicheOther = readOptionalString(
    value.primaryNicheOther,
    "Other niche",
    120,
  );

  if (primaryNiche === "other" && !primaryNicheOther) {
    throw new SurveyValidationError("Please specify your niche.");
  }

  if (
    typeof value.primaryPlatform !== "string" ||
    !PLATFORM_VALUES.has(value.primaryPlatform)
  ) {
    throw new SurveyValidationError("Select a primary content platform.");
  }

  const primaryPlatform = value.primaryPlatform as SurveyPlatform;

  const contentUnique = readRequiredString(
    value.contentUnique,
    "What makes your content unique",
    5000,
  );
  const brandBenefit = readRequiredString(
    value.brandBenefit,
    "How brands can benefit",
    5000,
  );
  const brandIntegrationStyle = readRequiredString(
    value.brandIntegrationStyle,
    "Brand integration style",
    5000,
  );
  const hasSponsoredWork = readBoolean(
    value.hasSponsoredWork,
    "Previous sponsored work",
  );
  const samplePromoLinks = readOptionalString(
    value.samplePromoLinks,
    "Sample brand promotion links",
    5000,
  );

  if (hasSponsoredWork && !samplePromoLinks) {
    throw new SurveyValidationError(
      "Paste at least one sample brand promotion link.",
    );
  }

  const whyParticipate = readRequiredString(
    value.whyParticipate,
    "Why you want to participate",
    5000,
  );

  return {
    fullName,
    contactNumber,
    email,
    primaryNiche,
    primaryNicheOther: primaryNiche === "other" ? primaryNicheOther : null,
    primaryPlatform,
    instagramHandle: readOptionalString(
      value.instagramHandle,
      "Instagram handle",
      120,
    ),
    instagramFollowers: readOptionalNonNegativeInteger(
      value.instagramFollowers,
      "Instagram follower count",
    ),
    youtubeChannel: readOptionalString(
      value.youtubeChannel,
      "YouTube channel",
      500,
    ),
    youtubeSubscribers: readOptionalNonNegativeInteger(
      value.youtubeSubscribers,
      "YouTube subscriber count",
    ),
    facebookPage: readOptionalString(
      value.facebookPage,
      "Facebook page",
      500,
    ),
    contentUnique,
    brandBenefit,
    brandIntegrationStyle,
    hasSponsoredWork,
    samplePromoLinks: hasSponsoredWork ? samplePromoLinks : samplePromoLinks,
    whyParticipate,
  };
}
