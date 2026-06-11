import Image from "next/image";

import { brandCards, highlights } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-6 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-stretch">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_24px_60px_rgba(84,52,16,0.08)] sm:p-8">
          <SectionHeading
            eyebrow="Who We Are"
            title="A warmer, cleaner brand presence built from your existing visual language."
            description="Based in Madhubani, Jhashree Productions brings together storytelling, branding, media, and digital promotion. This version moves away from the dark web template feel and uses a cream, gold, and brown palette that better matches your uploaded posters and logo."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5"
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
              className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(84,52,16,0.08)] lg:flex-1"
            >
              <Image
                src={card.image}
                alt={card.alt}
                width={670}
                height={447}
                className="h-full w-full rounded-[1.4rem] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
