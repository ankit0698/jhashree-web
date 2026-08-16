import type { DecodedIdToken } from "firebase-admin/auth";
import type { NextApiRequest } from "next";

import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export class AdminAuthenticationError extends Error {
  readonly statusCode = 401;

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AdminAuthenticationError";
  }
}

/**
 * Verifies an API request made by one of the Firebase Auth users you created.
 * Send the browser user's ID token as `Authorization: Bearer <token>`.
 */
export async function requireAdmin(
  request: NextApiRequest,
): Promise<DecodedIdToken> {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AdminAuthenticationError();
  }

  const idToken = authorization.slice("Bearer ".length).trim();

  if (!idToken) {
    throw new AdminAuthenticationError();
  }

  // Initialize outside the token-verification catch so missing or malformed
  // server credentials are reported as configuration errors, not bad tokens.
  const adminAuth = getFirebaseAdminAuth();

  try {
    // checkRevoked also rejects disabled users. Every Firebase Auth user is an
    // admin in this small, invite-only application.
    return await adminAuth.verifyIdToken(idToken, true);
  } catch {
    throw new AdminAuthenticationError("Invalid or expired authentication token");
  }
}
