import Image from "next/image";

import { featuredWork } from "@/components/home/content";

export default function WorkSection() {
  return (
    <section
      id="catalogue"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--paper-light)] text-[var(--ink)]"
    >
      <div className="site-gutter relative mx-auto max-w-[100rem] py-14 md:py-16">
        <p className="text-[0.61rem] font-extrabold uppercase tracking-[0.28em] text-[var(--rust)]">
          Our Packages
        </p>

        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-end">
          <h2 className="font-serif text-[2.6rem] leading-[0.92] tracking-[-0.02em] md:text-[3.4rem]">
            Clear Options,
            <span className="block">Made for Your Story</span>
          </h2>
        </div>

        <div className="mt-5 h-px w-10 bg-[var(--accent)]" />

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {featuredWork.map((item, index) => (
            <article
              key={item.title}
              className="group grid gap-6 rounded-xl border border-black/[0.08] bg-[var(--surface)] p-4 shadow-[0_18px_45px_rgba(52,35,20,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:shadow-[0_22px_55px_rgba(52,35,20,0.13)] md:grid-cols-[16rem_1fr] md:p-5"
            >
              <a
                href={item.image}
                target="_blank"
                rel="noreferrer"
                className="relative mx-auto block aspect-[2/3] w-full max-w-[18rem] overflow-hidden rounded-lg border border-black/10 bg-[#171612] p-1.5 md:max-w-none"
                aria-label={`Open full ${item.title} catalogue`}
              >
                <div className="relative h-full overflow-hidden rounded-md">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 18rem, 16rem"
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                  />
                  <span className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
                </div>
              </a>

              <div className="flex flex-col justify-center pb-1 pt-1">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(145deg,#c76035,#9f321f)] text-[0.64rem] font-bold tracking-[0.08em] text-[#fff4df] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.02] text-[var(--ink)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[0.69rem] leading-[1.55] text-[var(--muted)]">
                  {item.blurb}
                </p>

                <a
                  href={item.image}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-2 text-[0.61rem] font-extrabold uppercase tracking-[0.16em] text-[var(--rust)] transition group-hover:text-[var(--accent-deep)]"
                >
                  Open Catalogue
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
