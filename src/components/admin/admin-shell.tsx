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
      <main className="grid min-h-screen place-items-center bg-[var(--ink)]" role="status">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
        <span className="sr-only">Checking Firebase session</span>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="h-[3px] bg-[var(--rust)]" />
      <div className="border-b border-white/10 bg-[var(--ink)] px-4 py-4 text-[var(--hero-foreground)] md:px-8">
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/assets/brand-logo.png"
              alt="Jhashree Productions"
              width={46}
              height={46}
              className="h-11 w-11 rounded-full border border-[var(--accent)]/50 object-cover"
            />
            <div>
              <p className="font-serif text-xl font-semibold leading-none text-[var(--hero-foreground)]">
                Jhashree Productions
              </p>
              <p className="mt-1 text-[0.6rem] font-bold tracking-[0.22em] text-[var(--accent)] uppercase">
                Admin dashboard
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/survey"
              className={`admin-button ${
                router.pathname.startsWith("/admin/survey")
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                  : "border-white/15 bg-white/[0.05] text-[var(--hero-muted)] hover:border-[var(--accent)] hover:text-white"
              }`}
            >
              View survey
            </Link>
            <Link
              href="/"
              className="admin-button hidden border-white/15 bg-white/[0.05] text-[var(--hero-muted)] hover:border-[var(--accent)] hover:text-white md:inline-flex"
            >
              View website
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="admin-button border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)] hover:bg-[var(--accent-soft)]"
            >
              {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">{children}</div>
    </main>
  );
}
