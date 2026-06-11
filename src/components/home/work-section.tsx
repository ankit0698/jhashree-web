import Image from "next/image";

import { featuredWork } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function WorkSection() {
  return (
    <section
      id="catalogue"
      className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Catalogue"
        title="Browse the current service and pricing catalogue."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {featuredWork.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(84,52,16,0.08)]"
          >
            <div className="p-4 sm:p-5">
              <Image
                src={item.image}
                alt={item.alt}
                width={1024}
                height={1536}
                className="w-full rounded-[1.5rem] object-cover"
              />
            </div>
            <div className="px-6 pb-6 pt-1 sm:px-8 sm:pb-8">
              <h3 className="font-serif text-3xl text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-8 text-[var(--muted)]">
                {item.blurb}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
