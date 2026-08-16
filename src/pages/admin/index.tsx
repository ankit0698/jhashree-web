import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import AdminShell from "@/components/admin/admin-shell";
import DeleteWorkModal from "@/components/admin/delete-work-modal";
import MessagesCta from "@/components/admin/messages-cta";
import WorkPreview from "@/components/admin/work-preview";
import { useAdminSession } from "@/hooks/use-admin-session";
import {
  deleteAdminWork,
  getAdminWorks,
  updateAdminWorkStatus,
} from "@/lib/works/admin-api";
import { formatFileSize, type Work } from "@/types/work";

export default function AdminPage() {
  const { user, isCheckingSession } = useAdminSession();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const closeDeleteModal = useCallback(() => {
    setWorkToDelete(null);
    setDeleteError("");
  }, []);

  const loadWorks = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      setWorks(await getAdminWorks(user));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "The works could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    getAdminWorks(user)
      .then((loadedWorks) => {
        if (isActive) setWorks(loadedWorks);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The works could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  async function toggleStatus(work: Work) {
    if (!user) return;

    setUpdatingId(work.id);
    setError("");

    try {
      const updatedWork = await updateAdminWorkStatus(
        user,
        work.id,
        work.status === "published" ? "draft" : "published",
      );
      setWorks((currentWorks) =>
        currentWorks.map((item) =>
          item.id === updatedWork.id ? updatedWork : item,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "The status could not be changed.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteWork() {
    if (!user || !workToDelete) return;

    const work = workToDelete;

    setUpdatingId(work.id);
    setDeleteError("");

    try {
      await deleteAdminWork(user, work.id);
      setWorks((currentWorks) =>
        currentWorks.filter((item) => item.id !== work.id),
      );
      closeDeleteModal();
    } catch (deleteError) {
      setDeleteError(
        deleteError instanceof Error
          ? deleteError.message
          : "The work could not be deleted.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Manage Works | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <section className="py-7 md:py-10">
          <div className="relative overflow-hidden border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,250,242,0.98),rgba(242,228,204,0.88))] p-6 shadow-[var(--shadow-soft)] md:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--accent)]/12 blur-3xl"
            />
            <div className="relative flex flex-wrap items-end justify-between gap-7">
              <div>
                <p className="text-sm font-bold tracking-[0.18em] text-[var(--accent-deep)] uppercase">
                  Portfolio manager
                </p>
                <h1 className="mt-2 font-serif text-5xl font-semibold leading-none text-[var(--foreground-contrast)] md:text-6xl">
                  Our Works
                </h1>
                <span className="mt-5 inline-flex border-l-4 border-l-[var(--rust)] bg-white/75 px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-sm">
                  {works.length} {works.length === 1 ? "work" : "works"}
                </span>
              </div>

              <Link
                href="/admin/works/new"
                className="admin-button admin-button-primary min-w-44"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
                Add new work
              </Link>
            </div>
          </div>

          <MessagesCta user={user} />

          {error ? (
            <div
              role="alert"
              className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={loadWorks}
                className="admin-button admin-button-secondary admin-button-sm"
              >
                Try again
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid min-h-64 place-items-center" role="status">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
              <span className="sr-only">Loading works</span>
            </div>
          ) : works.length === 0 && !error ? (
            <div className="mt-6 grid min-h-80 place-items-center border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/85 px-6 py-12 text-center shadow-[var(--shadow-soft)]">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--accent-deep)] shadow-sm">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <path d="m7 15 3-3 2.5 2.5L15 12l2 2M12 8h.01" />
                  </svg>
                </span>
                <h2 className="mt-5 font-serif text-4xl font-semibold">
                  No works yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                  Add your first project. The Firestore collection will be
                  created automatically when you save it.
                </p>
                <Link
                  href="/admin/works/new"
                  className="admin-button admin-button-primary mt-7 min-w-40"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add first work
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {works.map((work) => {
                const isUpdating = updatingId === work.id;

                return (
                  <article
                    key={work.id}
                    className="grid overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:grid-cols-[13rem_1fr]"
                  >
                    <WorkPreview media={work.media} title={work.title} />

                    <div className="flex min-w-0 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wider uppercase ${
                            work.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {work.status}
                        </span>
                        <span className="text-xs font-semibold text-[var(--muted)]">
                          Order {work.sortOrder}
                        </span>
                      </div>

                      <h2 className="mt-3 truncate font-serif text-2xl font-semibold">
                        {work.title}
                      </h2>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {work.media.source === "youtube"
                          ? "YouTube video"
                          : `${work.media.type} · ${formatFileSize(work.media.sizeBytes)}`}
                      </p>

                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Link
                          href={`/admin/works/${work.id}/edit`}
                          className="admin-button admin-button-secondary admin-button-sm"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleStatus(work)}
                          disabled={isUpdating}
                          className="admin-button admin-button-primary admin-button-sm"
                        >
                          {isUpdating
                            ? "Updating…"
                            : work.status === "published"
                              ? "Move to draft"
                              : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setWorkToDelete(work);
                          }}
                          disabled={isUpdating}
                          className="admin-button admin-button-danger admin-button-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {workToDelete ? (
          <DeleteWorkModal
            workTitle={workToDelete.title}
            isDeleting={updatingId === workToDelete.id}
            error={deleteError}
            onCancel={closeDeleteModal}
            onConfirm={deleteWork}
          />
        ) : null}
      </AdminShell>
    </>
  );
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
