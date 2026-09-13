import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import Layout from "@/components/layout";
import SurveyHeader from "@/components/survey/survey-header";

type TicketMeta = {
  registrationCode: string;
  registrationCodeGuest: string | null;
  passesCount: number;
  fullName: string;
};

function TicketCard({
  label,
  code,
  imageSrc,
  downloadName,
}: {
  label: string;
  code: string;
  imageSrc: string;
  downloadName: string;
}) {
  return (
    <article className="rounded-[1.25rem] border border-black/[0.08] bg-white/75 p-4 shadow-[0_16px_40px_rgba(34,25,18,0.08)] md:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.54rem] font-bold uppercase tracking-[0.2em] text-[var(--rust)]">
            {label}
          </p>
          <p className="mt-1 font-semibold text-[var(--ink)]">{code}</p>
        </div>
        <a
          href={imageSrc}
          download={downloadName}
          className="inline-flex items-center justify-center rounded-full bg-[var(--rust)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Download
        </a>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={`Roots and Reels ticket ${code}`}
        className="w-full rounded-lg border border-black/10"
      />
    </article>
  );
}

export default function RootsReelsTicketPage() {
  const router = useRouter();
  const token =
    typeof router.query.token === "string" ? router.query.token : "";
  const [meta, setMeta] = useState<TicketMeta | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !token) return;

    setLoading(true);
    void fetch(`/api/registrations/ticket-meta/${encodeURIComponent(token)}`)
      .then(async (response) => {
        const result = (await response.json()) as TicketMeta & { error?: string };
        if (!response.ok) {
          throw new Error(result.error || "Ticket not found.");
        }
        setMeta(result);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Ticket not found.");
      })
      .finally(() => setLoading(false));
  }, [router.isReady, token]);

  return (
    <div className="min-h-screen bg-[var(--paper-light)]">
      <SurveyHeader />
      <main className="site-gutter mx-auto max-w-[52rem] py-8 md:py-12">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
          Your tickets
        </p>
        <h1 className="mt-2 font-serif text-[2rem] text-[var(--ink)] md:text-[2.4rem]">
          Roots &amp; Reels — Season 2
        </h1>

        {loading ? (
          <p className="mt-8 text-sm text-[var(--muted)]">Loading tickets…</p>
        ) : null}

        {error ? (
          <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {meta ? (
          <div className="mt-8 space-y-6">
            <p className="text-sm text-[var(--muted)]">
              Hi {meta.fullName}.{" "}
              {meta.registrationCodeGuest
                ? "Your BUY 1 GET 1 FREE pass includes two entry tickets."
                : "Here is your entry ticket."}
            </p>

            <TicketCard
              label="Ticket 1"
              code={meta.registrationCode}
              imageSrc={`/api/registrations/ticket/${encodeURIComponent(token)}?which=primary`}
              downloadName={`roots-reels-ticket-${meta.registrationCode}.jpeg`}
            />

            {meta.registrationCodeGuest ? (
              <TicketCard
                label="Ticket 2"
                code={meta.registrationCodeGuest}
                imageSrc={`/api/registrations/ticket/${encodeURIComponent(token)}?which=guest`}
                downloadName={`roots-reels-ticket-${meta.registrationCodeGuest}.jpeg`}
              />
            ) : null}
          </div>
        ) : null}

        <Link
          href="/rootsnreels"
          className="mt-8 inline-block text-sm font-semibold text-[var(--rust)]"
        >
          ← Back to registration
        </Link>
      </main>
    </div>
  );
}

RootsReelsTicketPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      title="Your Roots & Reels Tickets | Jhashree Productions"
      description="View and download your Roots & Reels Season 2 entry tickets."
    >
      {page}
    </Layout>
  );
};
