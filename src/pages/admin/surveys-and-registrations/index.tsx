import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminSurveysAndRegistrationsPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Surveys & Registrations | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <div className="py-7 md:py-10">
          <Link href="/admin" className="admin-button admin-button-ghost -ml-3">
            <span aria-hidden="true">←</span>
            Back to works
          </Link>

          <section className="mt-6">
            <div className="relative overflow-hidden border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface)_0%,var(--surface-soft)_100%)] p-6 shadow-[var(--shadow-soft)] md:p-8">
              <p className="text-sm font-bold tracking-[0.18em] text-[var(--accent)] uppercase">
                Roots &amp; Reels Season 2
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold leading-none text-[var(--ink)] md:text-5xl">
                Surveys and registrations
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Choose creator applications or paid event ticket registrations.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link
                href="/admin/survey"
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--rust)]/40"
              >
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[var(--rust)]">
                  Creator applications
                </p>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--ink)]">
                  View Roots and Reels Survey
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Content creator application form responses.
                </p>
              </Link>

              <Link
                href="/admin/registrations"
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--rust)]/40"
              >
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[var(--rust)]">
                  Paid event passes
                </p>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--ink)]">
                  View Roots and Reels registration
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Sold tickets with serials, buyer details, and payment info.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </AdminShell>
    </>
  );
}

AdminSurveysAndRegistrationsPage.getLayout = function getLayout(
  page: ReactElement,
) {
  return page;
};
