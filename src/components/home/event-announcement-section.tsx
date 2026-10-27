import Image from "next/image";
import Link from "next/link";

export default function EventAnnouncementSection() {
  return (
    <section
      id="lets-play-sama"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/[0.06] bg-[var(--section)] text-[var(--ink)]"
    >
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[var(--rust)]/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[var(--accent)]/[0.06] blur-3xl" />

      <div className="site-gutter relative z-10 mx-auto max-w-[90rem] py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center md:max-w-none md:text-left">
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.28em] text-[var(--rust)]">
            Jhashree presents
          </p>

          <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
            <div>
              <h2 className="font-serif text-[2.4rem] font-semibold leading-[0.95] tracking-[-0.03em] md:text-[3.4rem]">
                Let&apos;s Play
                <span className="mt-1 block text-[var(--accent-soft)]">
                  Sama
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-[0.95rem]">
                A celebration of Mithila&apos;s living tradition. Creators can
                apply to be part of the evening and the cultural campaign.
              </p>
              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--hero-muted)]">
                21 November 2026 · Madhubani Sadar
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 md:items-end">
              <Link
                href="/survey"
                className="site-button site-button-outline-light min-w-[12.5rem]"
              >
                Creator form
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 h-px w-12 bg-[var(--rust)] md:mt-6" />

        <figure className="mt-8 overflow-hidden rounded-[1.1rem] border border-white/[0.08] bg-[var(--canvas)] shadow-[var(--shadow-deep)] md:mt-10">
          <Link href="/survey" className="block">
            <Image
              src="/assets/sama_event_banner.PNG"
              alt="Let's Play Saama — a celebration of Mithila's living tradition. Regional Secondary School, Jeevach Chowk, Madhubani. Shiwani Bhagat, performer of the evening."
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, 90rem"
              className="h-auto w-full object-cover object-top"
            />
          </Link>
          <figcaption className="border-t border-white/[0.08] bg-[var(--canvas)] px-4 py-3 text-center text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[var(--hero-muted)] md:px-6">
            Organised by Jhashree Productions Pvt. Ltd.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
