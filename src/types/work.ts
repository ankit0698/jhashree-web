export const WORKS_COLLECTION = "works";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export type WorkStatus = "draft" | "published";

export type YouTubeMedia = {
  source: "youtube";
  type: "video";
  videoId: string;
};

export type UploadedMedia = {
  source: "upload";
  type: "image" | "video";
  storagePath: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  originalName: string;
};

export type WorkMedia = YouTubeMedia | UploadedMedia;

export type WorkInput = {
  title: string;
  description: string;
  label: string;
  status: WorkStatus;
  sortOrder: number;
  instagramUrl: string | null;
  media: WorkMedia;
};

export type Work = WorkInput & {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export function isUploadedMedia(media: WorkMedia): media is UploadedMedia {
  return media.source === "upload";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
