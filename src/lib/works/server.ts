import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import {
  getFirebaseAdminFirestore,
  getFirebaseAdminStorage,
} from "@/lib/firebase/admin";
import { WorkValidationError } from "@/lib/works/validation";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  WORKS_COLLECTION,
  getUploadedMediaFiles,
  isUploadedMedia,
  type UploadedMedia,
  type UploadedWorkMedia,
  type Work,
  type WorkInput,
} from "@/types/work";

type WorkSnapshot = DocumentSnapshot | QueryDocumentSnapshot;

function serializeTimestamp(value: unknown) {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

export function serializeWork(snapshot: WorkSnapshot): Work {
  const data = snapshot.data();

  if (!data) {
    throw new WorkValidationError("Work does not exist.");
  }

  return {
    id: snapshot.id,
    title: data.title,
    description: data.description,
    label: data.label,
    status: data.status,
    sortOrder: data.sortOrder,
    instagramUrl: data.instagramUrl ?? null,
    media: data.media,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  } as Work;
}

async function verifyUploadedFile(
  media: UploadedMedia,
): Promise<UploadedMedia> {
  const file = getFirebaseAdminStorage().bucket().file(media.storagePath);

  let metadata;

  try {
    [metadata] = await file.getMetadata();
  } catch {
    throw new WorkValidationError("The uploaded file could not be found in Firebase Storage.");
  }

  const contentType = metadata.contentType ?? "";
  const sizeBytes = Number(metadata.size ?? 0);
  const maximumSize = media.type === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const allowedTypes =
    media.type === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;

  if (!allowedTypes.includes(contentType)) {
    throw new WorkValidationError(`The stored ${media.type} format is not supported.`);
  }

  if (!sizeBytes || sizeBytes > maximumSize) {
    throw new WorkValidationError(
      media.type === "image"
        ? "Images must be 10 MB or smaller."
        : "Videos must be 100 MB or smaller.",
    );
  }

  return {
    ...media,
    contentType,
    sizeBytes,
  };
}

export async function verifyUploadedMedia(
  media: UploadedWorkMedia,
): Promise<UploadedWorkMedia> {
  if (media.type !== "image-collection") {
    return verifyUploadedFile(media);
  }

  return {
    ...media,
    images: await Promise.all(
      media.images.map(async (image) => {
        const verifiedImage = await verifyUploadedFile(image);

        if (verifiedImage.type !== "image") {
          throw new WorkValidationError(
            "Image collections can contain image files only.",
          );
        }

        return verifiedImage;
      }),
    ),
  };
}

export async function prepareWorkForWrite(input: WorkInput) {
  return {
    ...input,
    media: isUploadedMedia(input.media)
      ? await verifyUploadedMedia(input.media)
      : input.media,
  };
}

export function workDocument(id: string) {
  return getFirebaseAdminFirestore().collection(WORKS_COLLECTION).doc(id);
}

export function worksCollection() {
  return getFirebaseAdminFirestore().collection(WORKS_COLLECTION);
}

export function createTimestamps() {
  const timestamp = FieldValue.serverTimestamp();

  return {
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateTimestamp() {
  return FieldValue.serverTimestamp();
}

export async function deleteUploadedMedia(
  media: UploadedWorkMedia,
  storagePathsToKeep = new Set<string>(),
) {
  const bucket = getFirebaseAdminStorage().bucket();

  await Promise.all(
    getUploadedMediaFiles(media)
      .filter((file) => !storagePathsToKeep.has(file.storagePath))
      .map((file) =>
        bucket.file(file.storagePath).delete({ ignoreNotFound: true }),
      ),
  );
}
