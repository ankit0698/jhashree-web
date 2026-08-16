import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  type UploadedMedia,
  type WorkInput,
  type WorkStatus,
  type YouTubeMedia,
} from "@/types/work";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const WORK_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export class WorkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  value: unknown,
  field: string,
  maximumLength: number,
) {
  if (typeof value !== "string") {
    throw new WorkValidationError(`${field} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new WorkValidationError(`${field} is required.`);
  }

  if (normalized.length > maximumLength) {
    throw new WorkValidationError(
      `${field} must be ${maximumLength} characters or fewer.`,
    );
  }

  return normalized;
}

function parseInstagramUrl(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const urlValue = readString(value, "Instagram URL", 500);

  try {
    const url = new URL(urlValue);
    const hostname = url.hostname.toLowerCase();

    if (
      url.protocol !== "https:" ||
      (hostname !== "instagram.com" && !hostname.endsWith(".instagram.com"))
    ) {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new WorkValidationError("Enter a valid Instagram URL.");
  }
}

function parseYouTubeMedia(media: Record<string, unknown>): YouTubeMedia {
  const videoId = readString(media.videoId, "YouTube video", 32);

  if (!YOUTUBE_ID_PATTERN.test(videoId)) {
    throw new WorkValidationError("Enter a valid YouTube video URL.");
  }

  return {
    source: "youtube",
    type: "video",
    videoId,
  };
}

function parseUploadedMedia(
  media: Record<string, unknown>,
  workId: string,
): UploadedMedia {
  const type = media.type;

  if (type !== "image" && type !== "video") {
    throw new WorkValidationError("Choose image or video for the uploaded media.");
  }

  const storagePath = readString(media.storagePath, "Storage path", 1000);
  const expectedPrefix = `${WORK_ID_PATTERN.test(workId) ? `works/${workId}/media/` : ""}`;

  if (!expectedPrefix || !storagePath.startsWith(expectedPrefix) || storagePath.includes("..")) {
    throw new WorkValidationError("The uploaded file has an invalid Storage path.");
  }

  const urlValue = readString(media.url, "Media URL", 3000);

  try {
    const url = new URL(urlValue);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "firebasestorage.googleapis.com"
    ) {
      throw new Error();
    }

    const encodedObjectPath = url.pathname.split("/o/")[1];

    if (!encodedObjectPath || decodeURIComponent(encodedObjectPath) !== storagePath) {
      throw new Error();
    }
  } catch {
    throw new WorkValidationError("The uploaded file URL is invalid.");
  }

  const contentType = readString(media.contentType, "Media content type", 200);
  const originalName = readString(media.originalName, "Original filename", 255);
  const sizeBytes = Number(media.sizeBytes);
  const maximumSize = type === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const allowedTypes =
    type === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;

  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > maximumSize) {
    throw new WorkValidationError(
      type === "image"
        ? "Images must be 10 MB or smaller."
        : "Videos must be 100 MB or smaller.",
    );
  }

  if (!allowedTypes.includes(contentType)) {
    throw new WorkValidationError(`The selected ${type} format is not supported.`);
  }

  return {
    source: "upload",
    type,
    storagePath,
    url: urlValue,
    contentType,
    sizeBytes,
    originalName,
  };
}

export function validateWorkId(value: unknown) {
  if (typeof value !== "string" || !WORK_ID_PATTERN.test(value)) {
    throw new WorkValidationError("Invalid work ID.");
  }

  return value;
}

export function validateWorkInput(value: unknown, workId: string): WorkInput {
  if (!isRecord(value)) {
    throw new WorkValidationError("Invalid work data.");
  }

  const title = readString(value.title, "Title", 120);
  const description = readString(value.description, "Description", 5000);
  const label = readString(value.label, "Label", 60);
  const status = value.status;
  const sortOrder = Number(value.sortOrder);

  if (status !== "draft" && status !== "published") {
    throw new WorkValidationError("Status must be draft or published.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 1_000_000) {
    throw new WorkValidationError("Sort order must be a whole number from 0 to 1,000,000.");
  }

  if (!isRecord(value.media)) {
    throw new WorkValidationError("Choose media for this work.");
  }

  const media =
    value.media.source === "youtube"
      ? parseYouTubeMedia(value.media)
      : value.media.source === "upload"
        ? parseUploadedMedia(value.media, workId)
        : (() => {
            throw new WorkValidationError("Choose YouTube or an uploaded file.");
          })();

  return {
    title,
    description,
    label,
    status: status as WorkStatus,
    sortOrder,
    instagramUrl: parseInstagramUrl(value.instagramUrl),
    media,
  };
}

export function validateStatus(value: unknown): WorkStatus {
  if (value !== "draft" && value !== "published") {
    throw new WorkValidationError("Status must be draft or published.");
  }

  return value;
}

export function extractYouTubeVideoId(value: string) {
  const trimmedValue = value.trim();

  if (YOUTUBE_ID_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  try {
    const url = new URL(trimmedValue);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else {
        const segments = url.pathname.split("/").filter(Boolean);
        videoId = ["embed", "shorts", "live"].includes(segments[0] ?? "")
          ? (segments[1] ?? "")
          : "";
      }
    }

    return YOUTUBE_ID_PATTERN.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}
