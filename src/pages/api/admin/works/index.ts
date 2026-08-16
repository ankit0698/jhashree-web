import type { NextApiRequest, NextApiResponse } from "next";

import { sendApiError } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/firebase/require-admin";
import {
  createTimestamps,
  prepareWorkForWrite,
  serializeWork,
  workDocument,
  worksCollection,
} from "@/lib/works/server";
import {
  validateWorkId,
  validateWorkInput,
  WorkValidationError,
} from "@/lib/works/validation";
import type { Work } from "@/types/work";

type WorksResponse =
  | { works: Work[] }
  | { work: Work }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<WorksResponse>,
) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await requireAdmin(request);

    if (request.method === "GET") {
      const snapshot = await worksCollection().orderBy("sortOrder", "asc").get();
      response.status(200).json({ works: snapshot.docs.map(serializeWork) });
      return;
    }

    const id = validateWorkId(request.body?.id);
    const document = workDocument(id);
    const existing = await document.get();

    if (existing.exists) {
      throw new WorkValidationError("A work with this ID already exists.");
    }

    const input = validateWorkInput(request.body?.work, id);
    const preparedWork = await prepareWorkForWrite(input);
    await document.create({
      ...preparedWork,
      ...createTimestamps(),
    });

    response.status(201).json({ work: serializeWork(await document.get()) });
  } catch (error) {
    sendApiError(error, response);
  }
}
