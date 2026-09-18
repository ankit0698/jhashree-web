import Image from "next/image";

import HeroAtmosphere from "@/components/home/hero-atmosphere";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--hero-background)] text-[var(--ink)] md:min-h-[93vh]">
      <HeroAtmosphere />

      {/* Mithila touch — soft Madhubani accent, not the main visual */}
      <div className="pointer-events-none absolute -bottom-6 -right-10 z-0 hidden h-[22rem] w-[34rem] opacity-[0.14] md:block">
        <Image
          src="/assets/madhubani-paintings/fish-new.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="34rem"
          className="select-none object-contain object-right-bottom"
        />
      </div>

      {/* CONTENT */}
      <div className="site-gutter relative z-10 mx-auto max-w-[90rem] pb-16 pt-10 md:flex md:min-h-[41rem] md:items-center md:pb-24 md:pt-16 md:px-12">
        <div className="w-full max-w-[42rem] md:w-[58%]">
          <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.28em] text-[var(--rust)] md:text-[0.68rem]">
            Jhashree Productions
          </p>

          <h1 className="mt-3 max-w-[40rem] font-serif text-[2.35rem] font-semibold leading-[0.92] tracking-[-0.04em] md:mt-5 md:text-[clamp(3.1rem,5.4vw,5.4rem)] md:leading-[0.88]">
            We Make Brands
            <span className="mt-1 block md:mt-2">Impossible to Ignore.</span>
          </h1>

          <p className="mt-4 max-w-[36rem] text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)] md:mt-6 md:text-[0.72rem] md:tracking-[0.16em]">
            Social Media Management · Content Creation · Video Production ·
            Brand Communication
          </p>

          <p className="mt-4 max-w-[34rem] text-[0.78rem] leading-6 text-[var(--hero-muted)] md:mt-5 md:text-lg md:leading-8">
            We build distinctive social media presence for ambitious businesses
            through strategy, content, design and high-quality production.
          </p>

          <div className="mt-6 flex flex-col items-start gap-3 md:mt-8 md:flex-row md:flex-wrap md:items-center md:gap-x-4 md:gap-y-4">
            <a href="#works" className="site-button site-button-rust">
              View Our Work
              <span
                aria-hidden="true"
                className="text-base transition group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a href="#contact" className="site-button site-button-outline-light">
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
