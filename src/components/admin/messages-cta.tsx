import type { User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getAdminEnquiries } from "@/lib/enquiries/admin-api";

export default function MessagesCta({ user }: { user: User | null }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    getAdminEnquiries(user)
      .then((enquiries) => {
        if (isActive) {
          setUnreadCount(
            enquiries.filter((enquiry) => !enquiry.isRead).length,
          );
        }
      })
      .catch(() => {
        if (isActive) setUnreadCount(null);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  return (
    <section className="mt-8 overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
        <div className="flex min-w-0 items-center gap-4">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--accent)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16v12H8l-4 3V5Z" />
              <path d="m7 8 5 4 5-4" />
            </svg>

            {unreadCount !== null && unreadCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 grid min-h-6 min-w-6 place-items-center rounded-full border-2 border-[var(--surface)] bg-[var(--rust)] px-1 text-[0.65rem] font-bold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
                <span className="sr-only"> unread messages</span>
              </span>
            ) : null}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
                Contact inbox
              </p>

              {unreadCount !== null && unreadCount > 0 ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                  {unreadCount} unread
                </span>
              ) : null}
            </div>

            <h2 className="mt-1 font-serif text-3xl font-semibold leading-tight text-[var(--foreground-contrast)]">
              Messages
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              View customer enquiries and manage their read status.
            </p>
          </div>
        </div>

        <Link
          href="/admin/messages"
          className="admin-button admin-button-primary shrink-0 md:min-w-40"
        >
          Open messages
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
