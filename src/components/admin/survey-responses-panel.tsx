import type { User } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAdminSurveyApplications } from "@/lib/survey/admin-api";
import {
  SURVEY_NICHES,
  SURVEY_PLATFORMS,
  type SurveyApplication,
} from "@/types/survey";

function formatSubmittedAt(value: string | null) {
  if (!value) return "Just submitted";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function nicheLabel(application: SurveyApplication) {
  if (application.primaryNiche === "other" && application.primaryNicheOther) {
    return application.primaryNicheOther;
  }

  return (
    SURVEY_NICHES.find((item) => item.value === application.primaryNiche)
      ?.label ?? application.primaryNiche
  );
}

function platformLabel(value: SurveyApplication["primaryPlatform"]) {
  return (
    SURVEY_PLATFORMS.find((item) => item.value === value)?.label ?? value
  );
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
  if (value === null || value === undefined || value === "") {
    return null;
  }

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

function ApplicationDetail({ application }: { application: SurveyApplication }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
            {application.status}
          </span>
          <span className="text-xs font-semibold text-[var(--muted)]">
            {formatSubmittedAt(application.createdAt)}
          </span>
        </div>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--foreground-contrast)]">
          {application.fullName}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {nicheLabel(application)} · {platformLabel(application.primaryPlatform)}
        </p>
      </div>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField label="Contact number" value={application.contactNumber} />
        <DetailField label="Email" value={application.email} />
        <DetailField label="Primary niche" value={nicheLabel(application)} />
        <DetailField
          label="Primary platform"
          value={platformLabel(application.primaryPlatform)}
        />
      </section>

      <section className="grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
        <DetailField label="Instagram handle" value={application.instagramHandle} />
        <DetailField
          label="Instagram followers"
          value={application.instagramFollowers}
        />
        <DetailField label="YouTube channel" value={application.youtubeChannel} />
        <DetailField
          label="YouTube subscribers"
          value={application.youtubeSubscribers}
        />
        <DetailField
          label="Facebook page"
          value={application.facebookPage}
          multiline
        />
      </section>

      <section className="grid gap-5 border-t border-[var(--border)] pt-5">
        <DetailField
          label="What makes your content unique?"
          value={application.contentUnique}
          multiline
        />
        <DetailField
          label="How brands can benefit"
          value={application.brandBenefit}
          multiline
        />
        <DetailField
          label="Brand integration style"
          value={application.brandIntegrationStyle}
          multiline
        />
      </section>

      <section className="grid gap-5 border-t border-[var(--border)] pt-5">
        <DetailField
          label="Previous sponsored work"
          value={application.hasSponsoredWork ? "Yes" : "No"}
        />
        <DetailField
          label="Sample promo links"
          value={application.samplePromoLinks}
          multiline
        />
        <DetailField
          label="Why Roots & Reels Season 2?"
          value={application.whyParticipate}
          multiline
        />
      </section>
    </div>
  );
}

export default function SurveyResponsesPanel({ user }: { user: User | null }) {
  const [applications, setApplications] = useState<SurveyApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const selectedApplication = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId],
  );

  const loadApplications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await getAdminSurveyApplications(user);
      setApplications(result.applications);
      setTotal(result.total);
      setSelectedId((current) => {
        if (current && result.applications.some((item) => item.id === current)) {
          return current;
        }
        return result.applications[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Survey responses could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    getAdminSurveyApplications(user)
      .then((result) => {
        if (!isActive) return;
        setApplications(result.applications);
        setTotal(result.total);
        setSelectedId(result.applications[0]?.id ?? null);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Survey responses could not be loaded.",
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

  function selectApplication(id: string) {
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
            Survey responses
          </h1>
          <span className="mt-5 inline-flex border-l-4 border-l-[var(--rust)] bg-white/75 px-3 py-1.5 text-xs font-bold text-[var(--muted)] shadow-sm">
            {total} {total === 1 ? "response" : "responses"} total
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
            onClick={loadApplications}
            className="admin-button admin-button-secondary admin-button-sm"
          >
            Try again
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-64 place-items-center" role="status">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--accent-deep)]" />
          <span className="sr-only">Loading survey responses</span>
        </div>
      ) : applications.length === 0 && !error ? (
        <div className="mt-6 grid min-h-72 place-items-center border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/85 px-6 py-12 text-center shadow-[var(--shadow-soft)]">
          <div>
            <h2 className="font-serif text-4xl font-semibold">No responses yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Applications submitted from{" "}
              <a href="/survey" className="font-semibold text-[var(--rust)]">
                /survey
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
                All responses
              </p>
            </div>
            <ul className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto p-2.5">
              {applications.map((application) => {
                const isSelected = application.id === selectedId;

                return (
                  <li key={application.id}>
                    <button
                      type="button"
                      onClick={() => selectApplication(application.id)}
                      className={`w-full rounded-lg border px-3.5 py-3.5 text-left transition ${
                        isSelected
                          ? "border-[var(--rust)]/35 bg-[color-mix(in_srgb,var(--rust)_12%,#e5d8c4)] shadow-sm"
                          : "border-black/[0.08] bg-[color-mix(in_srgb,#d4c4ae_55%,#cbb89f)] hover:border-black/15 hover:bg-[color-mix(in_srgb,#cfc0aa_40%,#c4b194)]"
                      }`}
                    >
                      <p className="truncate font-semibold text-[var(--foreground-contrast)]">
                        {application.fullName}
                      </p>
                      <p className="mt-1 truncate text-xs text-[var(--muted)]">
                        {nicheLabel(application)}
                      </p>
                      <p className="mt-1 text-[0.68rem] text-[var(--muted)]">
                        {formatSubmittedAt(application.createdAt)}
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
              All responses
            </button>

            {selectedApplication ? (
              <ApplicationDetail application={selectedApplication} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Select a response to view details.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
