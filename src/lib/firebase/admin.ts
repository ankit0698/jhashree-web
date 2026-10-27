import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function requireEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApp();
  }

  return initializeApp({
    credential: cert({
      projectId: requireEnvironmentVariable("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnvironmentVariable("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnvironmentVariable("FIREBASE_PRIVATE_KEY").replace(
        /\\n/g,
        "\n",
      ),
    }),
    storageBucket: requireEnvironmentVariable("FIREBASE_STORAGE_BUCKET"),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}
