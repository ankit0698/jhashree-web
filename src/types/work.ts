export const WORKS_COLLECTION = "works";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_WORK_IMAGES = 8;
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

export type InstagramMedia = {
  source: "instagram";
  type: "video";
  url: string;
};

type UploadedFile = {
  storagePath: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  originalName: string;
};

export type UploadedImageMedia = UploadedFile & {
  source: "upload";
  type: "image";
};

export type UploadedVideoMedia = UploadedFile & {
  source: "upload";
  type: "video";
};

export type UploadedMedia = UploadedImageMedia | UploadedVideoMedia;

export type UploadedImageCollectionMedia = {
  source: "upload";
  type: "image-collection";
  images: UploadedImageMedia[];
};

export type UploadedWorkMedia = UploadedMedia | UploadedImageCollectionMedia;

export type WorkMedia = YouTubeMedia | InstagramMedia | UploadedWorkMedia;

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

export function isUploadedMedia(media: WorkMedia): media is UploadedWorkMedia {
  return media.source === "upload";
}

export function getUploadedMediaFiles(media: UploadedWorkMedia) {
  return media.type === "image-collection" ? media.images : [media];
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
