import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import AdminShell from "@/components/admin/admin-shell";
import WorkForm from "@/components/admin/work-form";
import { useAdminSession } from "@/hooks/use-admin-session";
import { getAdminWork } from "@/lib/works/admin-api";
import type { Work } from "@/types/work";

export default function EditWorkPage() {
  const router = useRouter();
  const { user, isCheckingSession } = useAdminSession();
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = typeof router.query.id === "string" ? router.query.id : null;

    if (!user || !id) return;

    let isActive = true;

    getAdminWork(user, id)
      .then((loadedWork) => {
        if (isActive) setWork(loadedWork);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The work could not be loaded.",
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [router.query.id, user]);

  return (
    <>
      <Head>
        <title>Edit Work | Jhashree Productions</title>
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
            Edit work
          </h1>
          <p className="mb-8 mt-2 text-sm text-[var(--muted)]">
            Update its details, media, order, or publishing status.
          </p>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </p>
          ) : user && work ? (
            <WorkForm
              key={work.id}
              user={user}
              workId={work.id}
              existingWork={work}
            />
          ) : (
            <div className="grid min-h-52 place-items-center" role="status">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
              <span className="sr-only">Loading work</span>
            </div>
          )}
        </section>
      </AdminShell>
    </>
  );
}

EditWorkPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
