import type {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { EnquiryValidationError } from "@/lib/enquiries/validation";
import {
  ENQUIRIES_COLLECTION,
  type Enquiry,
  type EnquiryInput,
} from "@/types/enquiry";

type EnquirySnapshot = DocumentSnapshot | QueryDocumentSnapshot;

function serializeTimestamp(value: unknown) {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

export function enquiriesCollection() {
  return getFirebaseAdminFirestore().collection(ENQUIRIES_COLLECTION);
}

export function enquiryDocument(id: string) {
  return enquiriesCollection().doc(id);
}

export function serializeEnquiry(snapshot: EnquirySnapshot): Enquiry {
  const data = snapshot.data();

  if (!data) {
    throw new EnquiryValidationError("Enquiry does not exist.");
  }

  return {
    id: snapshot.id,
    title: data.title,
    description: data.description,
    phone: data.phone ?? null,
    email: data.email ?? null,
    isRead: data.isRead === true,
    createdAt: serializeTimestamp(data.createdAt),
  } as Enquiry;
}

export async function createEnquiry(input: EnquiryInput) {
  const document = await enquiriesCollection().add({
    ...input,
    isRead: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  return serializeEnquiry(await document.get());
}
