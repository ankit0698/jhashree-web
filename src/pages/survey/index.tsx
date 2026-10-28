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
                Jhashree Productions presents
              </p>

              <h1 className="mt-3 font-serif text-[2.45rem] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] md:text-[3.4rem]">
                Let&apos;s Play Sama
                <span className="mt-1 block italic text-[var(--rust)]">
                  Creator form
                </span>
              </h1>

              <div className="mx-auto mt-5 flex w-24 items-center gap-2.5 text-[var(--accent)]">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
                <span className="h-1.5 w-1.5 rotate-45 border border-current" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
              </div>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-[0.95rem]">
                A celebration of Mithila&apos;s living tradition, organised by
                Jhashree Productions Pvt. Ltd. with partner organisations and
                market leaders. Tell us about the content you make.
              </p>

              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-strong)]">
                21 November 2026 · Madhubani Sadar
              </p>
            </div>

            <figure className="mb-8 overflow-hidden rounded-[1.25rem] border border-black/[0.08] bg-[var(--canvas)] shadow-[0_22px_60px_rgba(34,25,18,0.12)] md:mb-10">
              <Image
                src="/assets/IMG_0638.PNG"
                alt="Jhashree Productions — We are coming with something historical. Follow for updates @jhashree.vibe.vision."
                width={3919}
                height={3919}
                priority
                sizes="(max-width: 768px) 100vw, 52rem"
                className="h-auto w-full object-cover object-top"
              />
              <figcaption className="border-t border-white/[0.08] bg-[var(--canvas)] px-4 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--hero-muted)] md:px-6">
                Let&apos;s Play Sama · 21 November 2026 · Madhubani Sadar
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
      title="Let's Play Sama Creator Form | Jhashree Productions"
      description="Apply as a creator for Let's Play Sama, 21 November 2026 in Madhubani Sadar, organised by Jhashree Productions."
    >
      {page}
    </Layout>
  );
};
