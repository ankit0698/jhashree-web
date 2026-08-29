import Image from "next/image";
import type { ReactElement } from "react";

import SiteFooter from "@/components/home/site-footer";
import Layout from "@/components/layout";
import SurveyForm from "@/components/survey/survey-form";
import SurveyHeader from "@/components/survey/survey-header";

export default function SurveyPage() {
  return (
    <div className="relative overflow-x-clip">
      <SurveyHeader />

      <main>
        <section className="relative overflow-hidden bg-[var(--paper-light)] pb-10 pt-8 md:pb-14 md:pt-12">
          <div className="pointer-events-none absolute -right-16 -top-10 hidden h-[28rem] w-[28rem] opacity-[0.08] md:block">
            <Image
              src="/assets/madhubani-paintings/bird.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="28rem"
              className="select-none object-contain mix-blend-multiply"
            />
          </div>

          <div className="pointer-events-none absolute -bottom-24 -left-20 hidden h-[24rem] w-[24rem] opacity-[0.09] md:block">
            <Image
              src="/assets/madhubani-paintings/lotus-border.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="24rem"
              className="select-none object-contain object-left-bottom mix-blend-multiply"
            />
          </div>

          <div className="site-gutter relative z-10 mx-auto max-w-[52rem]">
            <div className="mb-8 text-center md:mb-10">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.34em] text-[var(--rust)]">
                Roots &amp; Reels · Season 2
              </p>

              <h1 className="mt-3 font-serif text-[2.45rem] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] md:text-[3.4rem]">
                Content Creator
                <span className="mt-1 block italic text-[var(--rust)]">
                  Application Form
                </span>
              </h1>

              <div className="mx-auto mt-5 flex w-24 items-center gap-2.5 text-[var(--accent)]">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
                <span className="h-1.5 w-1.5 rotate-45 border border-current" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
              </div>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-[0.95rem]">
                Welcome to Roots &amp; Reels Season 2, hosted by Jhashree
                Productions Private Limited in Madhubani, Bihar. Showcase your
                creative voice, pitch directly to brands, and build long-term
                commercial partnerships.
              </p>

              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-strong)]">
                Madhubani, Bihar
              </p>
            </div>

            <figure className="mb-8 overflow-hidden rounded-[1.25rem] border border-black/[0.08] bg-[var(--ink)] shadow-[0_22px_60px_rgba(34,25,18,0.12)] md:mb-10">
              <Image
                src="/assets/Roots-and-Reels.png"
                alt="Roots & Reels Season 2 — Creator × Brand Connect in Madhubani, Bihar. For creators, brands, artists, and audiences."
                width={1920}
                height={1080}
                priority
                sizes="(max-width: 768px) 100vw, 52rem"
                className="h-auto w-full object-cover object-top"
              />
              <figcaption className="border-t border-white/[0.08] bg-[var(--ink)] px-4 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--hero-muted)] md:px-6">
                Creator × Brand Connect · Where local talent meets local
                business
              </figcaption>
            </figure>

            <SurveyForm />
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

SurveyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      title="Roots & Reels Season 2 Application | Jhashree Productions"
      description="Apply as a content creator for Roots & Reels Season 2 by Jhashree Productions in Madhubani, Bihar."
    >
      {page}
    </Layout>
  );
};
