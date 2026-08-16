import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import {
  deleteUploadedMedia,
  prepareWorkForWrite,
  serializeWork,
  updateTimestamp,
  workDocument,
} from "@/lib/works/server";
import {
  validateStatus,
  validateWorkId,
  validateWorkInput,
  WorkValidationError,
} from "@/lib/works/validation";
import { isUploadedMedia, type Work } from "@/types/work";

type WorkResponse =
  | { work: Work }
  | { deleted: true }
  | { error: string };

async function removeFileWithoutFailingRequest(work: Work) {
  if (!isUploadedMedia(work.media)) {
    return;
  }

  try {
    await deleteUploadedMedia(work.media);
  } catch (error) {
    console.error("Could not remove media from Firebase Storage", error);
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<WorkResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (!["GET", "PUT", "PATCH", "DELETE"].includes(request.method ?? "")) {
    response.setHeader("Allow", "GET, PUT, PATCH, DELETE");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);
    const id = validateWorkId(request.query.id);
    const document = workDocument(id);
    const snapshot = await document.get();

    if (!snapshot.exists) {
      throw new WorkValidationError("Work not found.");
    }

    const existingWork = serializeWork(snapshot);

    if (request.method === "GET") {
      response.status(200).json({ work: existingWork });
      return;
    }

    if (request.method === "PATCH") {
      const status = validateStatus(request.body?.status);
      await document.update({ status, updatedAt: updateTimestamp() });
      response.status(200).json({ work: serializeWork(await document.get()) });
      return;
    }

    if (request.method === "DELETE") {
      await document.delete();
      await removeFileWithoutFailingRequest(existingWork);
      response.status(200).json({ deleted: true });
      return;
    }

    const input = validateWorkInput(request.body?.work, id);
    const preparedWork = await prepareWorkForWrite(input);
    await document.update({
      ...preparedWork,
      updatedAt: updateTimestamp(),
    });

    if (
      isUploadedMedia(existingWork.media) &&
      (!isUploadedMedia(preparedWork.media) ||
        existingWork.media.storagePath !== preparedWork.media.storagePath)
    ) {
      await removeFileWithoutFailingRequest(existingWork);
    }

    response.status(200).json({ work: serializeWork(await document.get()) });
  } catch (error) {
    sendApiError(error, response);
  }
}
