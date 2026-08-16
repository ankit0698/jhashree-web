import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FormEvent, ReactElement } from "react";
import { useEffect, useState } from "react";

import { firebaseAuth } from "@/lib/firebase/client";
import { MithilaBand, MithilaSun } from "@/components/ui/mithila-motifs";

function getSignInError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Unable to sign in. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect.";
    case "auth/user-disabled":
      return "This admin account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your internet connection.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled in Firebase.";
    case "auth/invalid-api-key":
      return "The Firebase API key is missing or invalid.";
    default:
      return "Firebase could not complete the sign-in. Check your configuration.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        void router.replace("/admin");
        return;
      }

      setIsCheckingSession(false);
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password,
      );
      await router.replace("/admin");
    } catch (signInError) {
      setError(getSignInError(signInError));
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--ink)] px-5 py-10">
        <MithilaBand className="absolute inset-x-0 top-0 h-3 bg-[var(--rust)] text-[var(--rust)]" />
        <section className="relative grid w-full max-w-4xl overflow-hidden border border-white/15 bg-[var(--paper-light)] shadow-[var(--shadow-deep)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[40rem] overflow-hidden bg-[var(--rust)] p-10 text-[var(--hero-foreground)] md:flex md:flex-col md:justify-between">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-15 [background-image:linear-gradient(45deg,var(--accent-soft)_1px,transparent_1px),linear-gradient(-45deg,var(--accent-soft)_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <MithilaSun className="pointer-events-none absolute -right-16 top-28 h-72 w-72 text-[var(--accent-soft)] opacity-25" />
            <Link href="/" className="relative flex items-center gap-3">
              <Image
                src="/assets/brand-logo.png"
                alt="Jhashree Productions"
                width={64}
                height={64}
                priority
                className="h-16 w-16 rounded-full border border-[var(--accent-soft)]/60 object-cover"
              />
              <span className="font-serif text-2xl">Jhashree Productions</span>
            </Link>
            <div className="relative">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.3em] text-[var(--accent-soft)]">
                Private studio
              </p>
              <p className="mt-4 font-serif text-5xl leading-[0.9]">
                Shape the work. Curate the story.
              </p>
            </div>
          </div>

          <div className="p-7 md:p-12">
          <div className="mb-8">
            <Link
              href="/"
              className="mb-7 flex w-fit items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] md:hidden"
            >
              <Image
                src="/assets/brand-logo.png"
                alt="Jhashree Productions"
                width={58}
                height={58}
                priority
                className="h-14 w-14 rounded-full border border-[var(--accent)] object-cover shadow-md"
              />
              <span className="text-left font-serif text-xl font-semibold leading-tight text-[var(--foreground-contrast)]">
                Jhashree
                <span className="block text-sm font-medium tracking-[0.16em] text-[var(--accent-deep)] uppercase">
                  Productions
                </span>
              </span>
            </Link>

            <p className="mb-3 text-[0.62rem] font-extrabold tracking-[0.26em] text-[var(--rust)] uppercase">
              Private access
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-none text-[var(--foreground-contrast)]">
              Welcome back.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Use an account created in Firebase Authentication.
            </p>
          </div>

          {isCheckingSession ? (
            <div className="flex min-h-52 items-center justify-center" role="status">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
              <span className="sr-only">Checking existing session</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  className="admin-input"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="admin-input"
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="admin-button admin-button-primary w-full py-3.5"
              >
                {isSubmitting ? "Signing in…" : "Sign in to dashboard"}
              </button>
            </form>
          )}

          <Link
            href="/"
            className="admin-button admin-button-ghost mx-auto mt-5 md:mx-0"
          >
            ← Return to website
          </Link>
          </div>
        </section>
      </main>
    </>
  );
}

AdminLoginPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
