import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import WorkForm from "@/components/admin/work-form";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function NewWorkPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Add Work | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <section className="py-10 sm:py-14">
          <Link
            href="/admin"
            className="admin-button admin-button-ghost -ml-3"
          >
            ← All works
          </Link>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-[var(--foreground-contrast)]">
            Add new work
          </h1>
          <p className="mb-8 mt-2 text-sm text-[var(--muted)]">
            Create it as a draft or publish it immediately.
          </p>

          {user ? (
            <WorkForm user={user} />
          ) : (
            <div className="grid min-h-52 place-items-center" role="status">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
              <span className="sr-only">Preparing form</span>
            </div>
          )}
        </section>
      </AdminShell>
    </>
  );
}

NewWorkPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
