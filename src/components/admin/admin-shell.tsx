import { signOut, type User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useState } from "react";

import { firebaseAuth } from "@/lib/firebase/client";

type AdminShellProps = {
  user: User | null;
  isCheckingSession: boolean;
  children: ReactNode;
};

export default function AdminShell({
  user,
  isCheckingSession,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut(firebaseAuth);
    await router.replace("/admin/login");
  }

  if (isCheckingSession || !user) {
    return (
      <main className="grid min-h-screen place-items-center" role="status">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
        <span className="sr-only">Checking Firebase session</span>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:px-7">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/assets/brand-logo.png"
              alt="Jhashree Productions"
              width={46}
              height={46}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-serif text-xl font-semibold leading-none">
                Jhashree Productions
              </p>
              <p className="mt-1 text-xs font-bold tracking-[0.16em] text-[var(--accent-deep)] uppercase">
                Admin dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="admin-button admin-button-ghost hidden sm:inline-flex"
            >
              View website
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="admin-button admin-button-secondary"
            >
              {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
