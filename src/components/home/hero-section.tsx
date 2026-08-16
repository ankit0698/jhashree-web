import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#fbf6ed_0%,#f2e6d5_100%)] text-[var(--ink)] md:min-h-[41rem]">
      {/* subtle paper lighting */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.58),transparent_30rem)]" />
      {/* DESKTOP FISH BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block">
        <Image
          src="/assets/madhubani-paintings/fish-new.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="
      select-none
      object-contain
      object-right-bottom
      origin-bottom-right
      scale-[1.08]
      opacity-90
    "
        />
      </div>

      {/* CONTENT */}
      <div className="site-gutter relative z-10 mx-auto max-w-[90rem] pb-4 pt-7 md:flex md:min-h-[41rem] md:items-center md:pb-20 md:pt-12">
        <div className="w-full max-w-[38rem] md:w-[48%]">
          <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.28em] text-[var(--rust)] md:text-[0.68rem]">
            Storytellers. Dreamers. Creators.
          </p>

          <h1 className="mt-3 max-w-[36rem] font-serif text-[2.4rem] font-semibold leading-[0.9] tracking-[-0.04em] md:mt-5 md:text-[clamp(3.45rem,6.1vw,6.1rem)] md:leading-[0.84]">
            We Bring
            <span className="block md:mt-2">
              Stories <em className="font-normal text-[var(--rust)]">to</em>{" "}
              Life
            </span>
          </h1>

          <p className="mt-4 max-w-[20rem] text-[0.72rem] leading-5 text-[var(--muted-strong)] md:mt-7 md:max-w-[34rem] md:text-base md:leading-8">
            A video production and social media management company rooted in
            culture, driven by creativity.
          </p>

          <div className="mt-5 flex flex-col items-start gap-3 md:mt-8 md:flex-row md:flex-wrap md:items-center md:gap-x-7 md:gap-y-4">
            <a href="#works" className="site-button site-button-rust">
              View Our Work
              <span
                aria-hidden="true"
                className="text-base transition group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE LOTUS ARTWORK */}
      <div className="pointer-events-none relative z-0 h-[320px] w-full md:hidden">
        <Image
          src="/assets/madhubani-paintings/lotus-border.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="select-none object-contain object-bottom"
        />
      </div>
    </section>
  );
}
