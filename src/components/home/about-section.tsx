import Image from "next/image";

import { highlights, stats } from "@/components/home/content";

function ValueIcon({ index }: { index: number }) {
  const paths = [
    "M5 18c4-1 7-4 8-8 2 3 4 5 7 6M5 18l2-6 5-5 5-2 2 4-2 5-5 5-7-1Z",
    "M12 3c2 3 5 4 8 4-1 3 0 6 2 8-4 0-7 2-10 6-3-4-6-6-10-6 2-2 3-5 2-8 3 0 6-1 8-4Z",
    "M12 3l2.7 5.5L21 9.4l-4.5 4.3 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.4l6.3-.9L12 3Z",
    "M4 13l5 5L20 7M4 7h5M15 18h5",
  ];

  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--rust)]/[0.08] text-[var(--rust)]">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={paths[index]}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--paper-light)] py-18 md:py-24"
    >
      <div className="site-gutter mx-auto grid max-w-[90rem] gap-9 md:grid-cols-[0.72fr_1.28fr_0.5fr] md:items-stretch md:gap-12">
        {/* LEFT IMAGE */}
        <div className="relative mx-auto w-full max-w-[26rem] md:mx-0 md:h-full">
          <div className="relative aspect-[3/4] overflow-hidden md:h-full md:aspect-auto">
            <Image
              src="/assets/madhubani-paintings/lady-original.webp"
              alt="Madhubani painting of a woman holding a lotus"
              fill
              sizes="(max-width: 767px) 90vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="md:py-6">
          <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.3em] text-[var(--rust)]">
            Who We Are
          </p>

          <h2 className="mt-4 max-w-[42rem] font-serif text-[2.75rem] font-semibold leading-[0.93] tracking-[-0.025em] text-[var(--ink)] md:text-[4.45rem]">
            Rooted in Mithila.
            <span className="block">Creating for the World.</span>
          </h2>

          <div className="mt-6 h-px w-12 bg-[var(--rust)]" />

          <p className="mt-6 max-w-[39rem] text-sm leading-7 text-[var(--muted-strong)] md:text-base md:leading-8">
            Based in the heart of Madhubani, Bihar — the land of art, culture
            and heritage, we blend tradition with innovation to deliver
            impactful visual experiences.
          </p>

          <div className="mt-9 grid gap-x-7 gap-y-6 md:grid-cols-2">
            {highlights.map((item, index) => (
              <article key={item.title} className="flex gap-3">
                <ValueIcon index={index} />

                <div>
                  <h3 className="font-serif text-lg font-semibold leading-tight text-[var(--ink)]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT STATS CARD */}
        <aside className="flex flex-col justify-center rounded-xl bg-[linear-gradient(155deg,#2a2822,#181714)] px-7 py-3 text-[var(--hero-foreground)] shadow-[var(--shadow-deep)] md:h-full md:px-6 md:py-5">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className="flex items-center gap-5 border-b border-white/10 py-6 last:border-0 md:flex-1 md:flex-col md:items-start md:justify-center md:gap-2"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--accent)]/50 text-[var(--accent)] md:mb-1">
                <span
                  className={`block h-2.5 w-2.5 ${
                    index === 1 ? "rotate-45" : "rounded-full"
                  } border border-current`}
                />
              </span>

              <div>
                <p className="font-serif text-4xl leading-none text-[#fff6e8] md:text-[2.6rem]">
                  {stat.value}
                </p>

                <p className="mt-2 max-w-24 text-[0.62rem] leading-4 text-[var(--hero-muted)]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
