import Image from "next/image";

import { brandCards, highlights } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,242,0.96),rgba(250,241,223,0.94))] p-5 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 bg-[radial-gradient(circle,rgba(216,155,47,0.16),transparent_72%)]" />
          <div className="pointer-events-none absolute -bottom-18 -left-10 opacity-30">
            <Image
              src="/assets/flowers.png"
              alt=""
              aria-hidden="true"
              width={360}
              height={360}
              className="h-auto w-56 sm:w-72"
            />
          </div>
          <SectionHeading
            eyebrow="Who We Are"
            title="A warmer, cleaner brand presence built from your existing visual language."
            description="Based in Madhubani, Jhashree Productions brings together storytelling, branding, media, and digital promotion. This version moves away from the dark web template feel and uses a cream, gold, and brown palette that better matches your uploaded posters and logo."
          />

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[rgba(155,90,27,0.12)] bg-[linear-gradient(180deg,rgba(242,228,204,0.72),rgba(255,250,242,0.9))] p-4 shadow-[0_10px_26px_rgba(84,52,16,0.05)] sm:p-5"
              >
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:h-full">
          {brandCards.map((card) => (
            <div
              key={card.image}
              className="group relative     transition hover:-translate-y-1 lg:flex-1"
            >
              <div className="pointer-events-none absolute inset-x-6 top-4 h-10 rounded-full bg-[linear-gradient(90deg,rgba(216,155,47,0.16),transparent)] blur-xl" />
              <Image
                src={card.image}
                alt={card.alt}
                width={670}
                height={447}
                className="h-full w-full rounded-[1.4rem] object-contain transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
