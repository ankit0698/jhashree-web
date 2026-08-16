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

      <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-[-8rem] h-80 w-80 rounded-full bg-[var(--accent)]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[var(--accent-green)]/10 blur-3xl"
        />

        <section className="relative w-full max-w-md rounded-[2rem] border border-[var(--border-strong)] bg-[var(--surface)]/95 p-7 shadow-[var(--shadow-deep)] backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mx-auto mb-5 flex w-fit items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
            >
              <Image
                src="/assets/brand-logo.png"
                alt="Jhashree Productions"
                width={58}
                height={58}
                priority
                className="h-14 w-14 rounded-full object-cover shadow-md"
              />
              <span className="text-left font-serif text-xl font-semibold leading-tight text-[var(--foreground-contrast)]">
                Jhashree
                <span className="block text-sm font-medium tracking-[0.16em] text-[var(--accent-deep)] uppercase">
                  Productions
                </span>
              </span>
            </Link>

            <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[var(--accent-deep)] uppercase">
              Private access
            </p>
            <h1 className="font-serif text-4xl font-semibold text-[var(--foreground-contrast)]">
              Admin sign in
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
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3.5 text-[var(--foreground-contrast)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
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
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-white px-4 py-3.5 text-[var(--foreground-contrast)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
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
            className="admin-button admin-button-ghost mx-auto mt-5"
          >
            ← Return to website
          </Link>
        </section>
      </main>
    </>
  );
}

AdminLoginPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
