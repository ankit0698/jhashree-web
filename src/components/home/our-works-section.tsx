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
      className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Our Works"
        title="Crafted with Care, Delivered with Impact."
        description=""
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
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
              className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(84,52,16,0.08)]"
            >
              <div
                className={`relative flex aspect-video items-center justify-center overflow-hidden ${previewClassName}`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,4,0.08)_0%,rgba(8,6,4,0.24)_100%)]" />
                <div className="absolute left-6 top-6 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 ring-1 ring-white/15 backdrop-blur">
                  {item.label}
                </div>
                <div className="absolute bottom-6 left-6 rounded-full bg-black/22 px-4 py-2 text-sm text-white/92 backdrop-blur">
                  Video placeholder
                </div>
                <PlayBadge />
              </div>

              <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
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
