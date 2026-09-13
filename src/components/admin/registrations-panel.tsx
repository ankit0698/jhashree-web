import type { User } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAdminRegistrations } from "@/lib/registration/admin-api";
import {
  AGE_GROUPS,
  ATTENDEE_TYPES,
  COMING_WITH_OPTIONS,
  HEARD_FROM_OPTIONS,
  INTEREST_OPTIONS,
  type AdminRegistration,
} from "@/types/registration";

function formatPaidAt(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function labelFrom<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
  other?: string | null,
) {
  if (value === "other" && other) return other;
  return options.find((item) => item.value === value)?.label ?? value;
}

function DetailField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | number | null | undefined;
  multiline?: boolean;
}) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div>
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--accent-deep)]">
        {label}
      </p>
      <p
        className={`mt-1.5 text-sm text-[var(--foreground-contrast)] ${
          multiline ? "whitespace-pre-wrap leading-6" : "leading-5"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function RegistrationDetail({
  registration,
}: {
  registration: AdminRegistration;
}) {
  const interestLabels = registration.interests
    .map(
      (value) =>
        INTEREST_OPTIONS.find((item) => item.value === value)?.label ?? value,
    )
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-800">
            {registration.status}
          </span>
          {registration.promo === "bogo_first_50" ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
              BOGO
            </span>
          ) : null}
          <span className="text-xs font-semibold text-[var(--muted)]">
            Paid {formatPaidAt(registration.paidAt)}
          </span>
        </div>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--foreground-contrast)]">
          {registration.fullName}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {registration.registrationCode}
          {registration.registrationCodeGuest
            ? ` · ${registration.registrationCodeGuest}`
            : ""}
        </p>
      </div>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField label="Ticket 1" value={registration.registrationCode} />
        <DetailField
          label="Ticket 2 (guest)"
          value={registration.registrationCodeGuest}
        />
        <DetailField
          label="Passes"
          value={`${registration.passesCount} ${
            registration.passesCount === 1 ? "person" : "people"
          }`}
        />
        <DetailField
          label="Amount paid"
          value={`₹${(registration.amountPaise / 100).toFixed(0)}`}
        />
        <DetailField
          label="BOGO slot"
          value={registration.bogoSlot}
        />
        <DetailField label="Promo" value={registration.promo} />
      </section>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField label="Contact number" value={registration.contactNumber} />
        <DetailField label="Email" value={registration.email} />
        <DetailField
          label="Age group"
          value={labelFrom(AGE_GROUPS, registration.ageGroup)}
        />
        <DetailField
          label="Attendee type"
          value={labelFrom(
            ATTENDEE_TYPES,
            registration.attendeeType,
            registration.attendeeTypeOther,
          )}
        />
        <DetailField
          label="Coming with"
          value={labelFrom(COMING_WITH_OPTIONS, registration.comingWith)}
        />
        <DetailField
          label="Heard from"
          value={labelFrom(
            HEARD_FROM_OPTIONS,
            registration.heardFrom,
            registration.heardFromOther,
          )}
        />
      </section>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField label="City / town" value={registration.city} />
        <DetailField label="District" value={registration.district} />
        <DetailField label="State" value={registration.state} />
        <DetailField label="Interests" value={interestLabels} multiline />
      </section>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField
          label="Razorpay order"
          value={registration.razorpayOrderId}
        />
        <DetailField
          label="Razorpay payment"
          value={registration.razorpayPaymentId}
        />
        <DetailField label="Source" value={registration.source} />
        <div>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--accent-deep)]">
            Tickets
          </p>
          <a
            href={`/rootsnreels/ticket/${registration.ticketToken}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-block text-sm font-semibold text-[var(--rust)]"
          >
            Open ticket page →
          </a>
        </div>
      </section>
    </div>
  );
}

export default function RegistrationsPanel({ user }: { user: User | null }) {
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const selectedRegistration = useMemo(
    () => registrations.find((item) => item.id === selectedId) ?? null,
    [registrations, selectedId],
  );

  const loadRegistrations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await getAdminRegistrations(user);
      setRegistrations(result.registrations);
      setTotal(result.total);
      setSelectedId((current) => {
        if (current && result.registrations.some((item) => item.id === current)) {
          return current;
        }
        return result.registrations[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Registrations could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    getAdminRegistrations(user)
      .then((result) => {
        if (!isActive) return;
        setRegistrations(result.registrations);
        setTotal(result.total);
        setSelectedId(result.registrations[0]?.id ?? null);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Registrations could not be loaded.",
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

  function selectRegistration(id: string) {
    setSelectedId(id);
    setShowDetailOnMobile(true);
  }

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,250,242,0.98),rgba(242,228,204,0.88))] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[var(--accent)]/12 blur-3xl"
        />
        <div className="relative">
          <p className="text-sm font-bold tracking-[0.18em] text-[var(--accent-deep)] uppercase">
            Roots &amp; Reels Season 2
          </p>
          <h1 className="mt-2 font-serif text-5xl font-semibold leading-none text-[var(--foreground-contrast)] md:text-6xl">
            Sold registrations
          </h1>
          <span className="mt-5 inline-flex border-l-4 border-l-[var(--rust)] bg-white/75 px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-sm">
            {total} paid {total === 1 ? "registration" : "registrations"}
          </span>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadRegistrations}
            className="admin-button admin-button-secondary admin-button-sm"
          >
            Try again
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-64 place-items-center" role="status">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
          <span className="sr-only">Loading registrations</span>
        </div>
      ) : registrations.length === 0 && !error ? (
        <div className="mt-6 grid min-h-72 place-items-center border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/85 px-6 py-12 text-center shadow-[var(--shadow-soft)]">
          <div>
            <h2 className="font-serif text-4xl font-semibold">No sales yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Paid tickets from{" "}
              <a href="/rootsnreels" className="font-semibold text-[var(--rust)]">
                /rootsnreels
              </a>{" "}
              will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[20rem_1fr]">
          <div
            className={`border border-[var(--border)] bg-[var(--surface-soft)] shadow-[var(--shadow-soft)] ${
              showDetailOnMobile ? "hidden lg:block" : "block"
            }`}
          >
            <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-soft)_70%,#d9cbb8)] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                All paid tickets
              </p>
            </div>
            <ul className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto p-2.5">
              {registrations.map((registration) => {
                const isSelected = registration.id === selectedId;
                return (
                  <li key={registration.id}>
                    <button
                      type="button"
                      onClick={() => selectRegistration(registration.id)}
                      className={`w-full rounded-lg border px-3.5 py-3.5 text-left transition ${
                        isSelected
                          ? "border-[var(--rust)]/35 bg-[color-mix(in_srgb,var(--rust)_12%,#e5d8c4)] shadow-sm"
                          : "border-black/[0.08] bg-[color-mix(in_srgb,#d4c4ae_55%,#cbb89f)] hover:border-black/15 hover:bg-[color-mix(in_srgb,#cfc0aa_40%,#c4b194)]"
                      }`}
                    >
                      <p className="truncate font-semibold text-[var(--foreground-contrast)]">
                        {registration.fullName}
                      </p>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">
                        {registration.registrationCode}
                        {registration.registrationCodeGuest
                          ? ` · ${registration.registrationCodeGuest}`
                          : ""}
                      </p>
                      <p className="mt-1 text-[0.68rem] text-[var(--muted)]">
                        {formatPaidAt(registration.paidAt)}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className={`border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] md:p-7 ${
              showDetailOnMobile ? "block" : "hidden lg:block"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowDetailOnMobile(false)}
              className="admin-button admin-button-ghost -ml-3 mb-4 lg:hidden"
            >
              <span aria-hidden="true">←</span>
              All paid tickets
            </button>

            {selectedRegistration ? (
              <RegistrationDetail registration={selectedRegistration} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Select a registration to view details.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
