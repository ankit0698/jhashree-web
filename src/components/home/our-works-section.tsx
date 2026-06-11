import { showcaseWorks } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

function PlayBadge() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="ml-1 h-0 w-0 border-b-[14px] border-l-[22px] border-t-[14px] border-b-transparent border-l-[rgba(44,28,13,0.9)] border-t-transparent" />
    </div>
  );
}

export default function OurWorksSection() {
  return (
    <section
      id="works"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <SectionHeading
        eyebrow="Our Works"
        title="Crafted with Care, Delivered with Impact."
        description=""
      />

      <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-2">
        {showcaseWorks.map((item) => {
          const previewClassName =
            item.theme === "green"
              ? "bg-[radial-gradient(circle_at_top,rgba(37,94,78,0.24),transparent_36%),linear-gradient(135deg,#0f241f_0%,#102f2b_42%,#1f4736_100%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(255,89,128,0.28),transparent_34%),linear-gradient(135deg,#1a1418_0%,#271923_44%,#36204e_100%)]";

          const accentClassName =
            item.theme === "green"
              ? "bg-[rgba(158,212,190,0.18)] text-[#dff7ee]"
              : "bg-[rgba(255,162,188,0.18)] text-[#ffe3f0]";

          return (
            <article
              key={item.title}
              className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,242,0.96),rgba(250,241,223,0.94))] shadow-[var(--shadow-soft)]"
            >
              <div
                className={`relative flex aspect-video items-center justify-center overflow-hidden ${previewClassName}`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,4,0.08)_0%,rgba(8,6,4,0.24)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 ring-1 ring-white/15 backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:py-2">
                  {item.label}
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-black/22 px-3 py-1.5 text-sm text-white/92 backdrop-blur sm:bottom-6 sm:left-6 sm:px-4 sm:py-2">
                  Video placeholder
                </div>
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.22))]" />
                <PlayBadge />
              </div>

              <div className="px-5 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-5">
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${accentClassName}`}
                >
                  Client Project
                </div>
                <h3 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
