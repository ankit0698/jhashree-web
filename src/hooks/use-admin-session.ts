import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { firebaseAuth } from "@/lib/firebase/client";

export function useAdminSession() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (authenticatedUser) => {
      if (!authenticatedUser) {
        void router.replace("/admin/login");
        return;
      }

      setUser(authenticatedUser);
      setIsCheckingSession(false);
    });
  }, [router]);

  return { user, isCheckingSession };
}
