import Image from "next/image";
import type { ReactElement } from "react";

import SiteFooter from "@/components/home/site-footer";
import Layout from "@/components/layout";
import RegistrationForm from "@/components/registration/registration-form";
import SurveyHeader from "@/components/survey/survey-header";

export default function RootsAndReelsRegisterPage() {
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

          <div className="site-gutter relative z-10 mx-auto max-w-[52rem]">
            <div className="mb-8 text-center md:mb-10">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.34em] text-[var(--rust)]">
                Roots &amp; Reels · Season 2
              </p>

              <h1 className="mt-3 font-serif text-[2.45rem] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] md:text-[3.4rem]">
                Register for
                <span className="mt-1 block italic text-[var(--rust)]">
                  the experience
                </span>
              </h1>

              <div className="mx-auto mt-5 flex w-24 items-center gap-2.5 text-[var(--accent)]">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
                <span className="h-1.5 w-1.5 rotate-45 border border-current" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
              </div>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-[0.95rem]">
                One pass. Two people. One day full of creators, brands, music,
                content &amp; fun.
              </p>

              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-strong)]">
                4 Oct 2026 · 10:00 AM · Mithila Vatika · ₹299
              </p>
            </div>

            <RegistrationForm />
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

RootsAndReelsRegisterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      title="Roots & Reels Season 2 Registration | Jhashree Productions"
      description="Register for Roots & Reels Season 2 at Mithila Vatika, Madhubani. ₹299 pass with BUY 1 GET 1 FREE for the first 50."
    >
      {page}
    </Layout>
  );
};
