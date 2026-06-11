import Image from "next/image";

import { stats } from "@/components/home/content";

export default function HeroSection() {
  return (
    <section className="relative min-h-[44rem] overflow-hidden bg-[var(--hero-background)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/assets/hero-image.jpg"
          alt="Jhashree Productions hero artwork"
          width={5184}
          height={3456}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="absolute inset-0">
        <div className="absolute right-8 top-28 hidden lg:block">
          <div className="h-40 w-40 rounded-full border border-[rgba(242,210,138,0.18)] bg-[radial-gradient(circle,rgba(242,210,138,0.08),transparent_70%)] blur-sm" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,11,8,0.92)_0%,rgba(17,11,8,0.84)_44%,rgba(17,11,8,0.66)_72%,rgba(17,11,8,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,161,46,0.18),transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(18,101,80,0.14),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(17,11,8,0.72))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 md:pb-20 md:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="max-w-4xl">
          <div className="mt-8 space-y-5">
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight text-[var(--hero-foreground)] sm:text-6xl lg:text-7xl">
              Crafted stories, polished branding, and a visual identity with a
              signature of its own.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--hero-muted)] sm:text-lg">
              Jhashree Productions blends cultural authenticity with modern
              content strategy to create campaigns, videos, and visual
              identities that audiences remember.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#works"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--foreground-contrast)] shadow-[0_18px_45px_rgba(216,155,47,0.28)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
            >
              Explore our work
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-[var(--hero-foreground)] backdrop-blur transition hover:bg-white/16"
            >
              View services
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-[1.75rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,249,239,0.12),rgba(255,249,239,0.05))] p-4 shadow-[0_20px_44px_rgba(0,0,0,0.24)] backdrop-blur sm:p-5"
              >
                <p className="text-3xl font-semibold text-[var(--accent)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--hero-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
