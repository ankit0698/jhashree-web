import Image from "next/image";

import { featuredWork } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function WorkSection() {
  return (
    <section
      id="catalogue"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <SectionHeading
        eyebrow="Catalogue"
        title="Browse the current service and pricing catalogue."
        description=""
      />

      <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-2">
        {featuredWork.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,242,0.96),rgba(250,241,223,0.92))] shadow-[var(--shadow-soft)]"
          >
            <div className="p-3 sm:p-5">
              <Image
                src={item.image}
                alt={item.alt}
                width={1024}
                height={1536}
                className="w-full rounded-[1.5rem] border border-[rgba(155,90,27,0.08)] object-cover shadow-[0_20px_36px_rgba(84,52,16,0.08)]"
              />
            </div>
            <div className="px-5 pb-5 pt-1 sm:px-8 sm:pb-8">
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
