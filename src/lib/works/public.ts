import { collection, getDocs, query, where } from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import { validateWorkInput } from "@/lib/works/validation";
import { WORKS_COLLECTION, type Work } from "@/types/work";

function timestampToString(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return null;
}

export async function getPublishedWorks(): Promise<Work[]> {
  const snapshot = await getDocs(
    query(
      collection(firestore, WORKS_COLLECTION),
      where("status", "==", "published"),
    ),
  );

  return snapshot.docs
    .flatMap((document) => {
      try {
        const data = document.data();
        const work = validateWorkInput(data, document.id);

        return [
          {
            id: document.id,
            ...work,
            createdAt: timestampToString(data.createdAt),
            updatedAt: timestampToString(data.updatedAt),
          },
        ];
      } catch (error) {
        console.error(`Skipping invalid work document ${document.id}`, error);
        return [];
      }
    })
    .sort((first, second) => first.sortOrder - second.sortOrder);
}
