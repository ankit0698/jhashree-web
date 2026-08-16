import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";

import {
  getAdminEnquiries,
  updateAdminEnquiryReadStatus,
} from "@/lib/enquiries/admin-api";
import type { Enquiry } from "@/types/enquiry";

function formatSubmittedAt(value: string | null) {
  if (!value) return "Just submitted";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function EnquiriesPanel({ user }: { user: User | null }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const unreadCount = enquiries.filter((enquiry) => !enquiry.isRead).length;

  const loadEnquiries = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      setEnquiries(await getAdminEnquiries(user));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "The enquiries could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    getAdminEnquiries(user)
      .then((loadedEnquiries) => {
        if (isActive) setEnquiries(loadedEnquiries);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The enquiries could not be loaded.",
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

  async function toggleReadStatus(enquiry: Enquiry) {
    if (!user) return;

    setUpdatingId(enquiry.id);
    setError("");

    try {
      const updatedEnquiry = await updateAdminEnquiryReadStatus(
        user,
        enquiry.id,
        !enquiry.isRead,
      );
      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((item) =>
          item.id === updatedEnquiry.id ? updatedEnquiry : item,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "The enquiry status could not be updated.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mt-8 border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
            Contact inbox
          </p>
          <h2 className="mt-1 font-serif text-4xl font-semibold leading-none text-[var(--foreground-contrast)]">
            Customer Enquiries
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--rust)] px-3 py-1.5 text-xs font-bold text-white">
            {unreadCount} unread · {enquiries.length} total
          </span>
          <button
            type="button"
            onClick={loadEnquiries}
            disabled={isLoading || !user}
            className="admin-button admin-button-secondary admin-button-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadEnquiries}
            className="admin-button admin-button-secondary admin-button-sm"
          >
            Try again
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-36 place-items-center" role="status">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
          <span className="sr-only">Loading enquiries</span>
        </div>
      ) : enquiries.length === 0 && !error ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--paper-light)] px-5 py-9 text-center">
          <h3 className="font-serif text-2xl font-semibold">No enquiries yet</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            New contact form submissions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {enquiries.map((enquiry) => {
            const isUpdating = updatingId === enquiry.id;

            return (
              <article
                key={enquiry.id}
                className={`flex flex-col rounded-xl border p-5 shadow-[0_10px_28px_rgba(55,38,22,0.05)] transition ${
                  enquiry.isRead
                    ? "border-[var(--border)] bg-[var(--paper-light)] opacity-80"
                    : "border-[var(--rust)]/30 bg-white shadow-[0_12px_34px_rgba(155,52,31,0.09)]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
                      enquiry.isRead
                        ? "bg-stone-200 text-stone-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {enquiry.isRead ? "Read" : "Unread"}
                  </span>
                  <time className="text-xs text-[var(--muted)]">
                    {formatSubmittedAt(enquiry.createdAt)}
                  </time>
                </div>

                <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-[var(--foreground-contrast)]">
                  {enquiry.title}
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted-strong)]">
                  {enquiry.description}
                </p>

                <div className="mt-auto border-t border-[var(--border)] pt-4">
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--accent-deep)]">
                    {enquiry.phone ? (
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="hover:underline"
                      >
                        {enquiry.phone}
                      </a>
                    ) : null}
                    {enquiry.email ? (
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="break-all hover:underline"
                      >
                        {enquiry.email}
                      </a>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReadStatus(enquiry)}
                    disabled={isUpdating}
                    className={`admin-button admin-button-sm mt-4 ${
                      enquiry.isRead
                        ? "admin-button-secondary"
                        : "admin-button-primary"
                    }`}
                  >
                    {isUpdating
                      ? "Updating…"
                      : enquiry.isRead
                        ? "Mark as unread"
                        : "Mark as read"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
