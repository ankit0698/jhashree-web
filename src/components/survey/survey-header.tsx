import Image from "next/image";
import Link from "next/link";

export default function SurveyHeader() {
  return (
    <header className="sticky top-0 z-[60] border-b border-black/[0.06] bg-[var(--paper-light)]/95 text-[var(--ink)] shadow-[0_5px_20px_rgba(44,30,18,0.06)] backdrop-blur-xl">
      <div className="site-gutter mx-auto flex min-h-[5.25rem] max-w-[90rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3"
          aria-label="Jhashree Productions home"
        >
          <Image
            src="/assets/brand-logo.png"
            alt="Jhashree Productions logo"
            width={58}
            height={58}
            priority
            className="h-12 w-12 shrink-0 rounded-full object-cover shadow-[0_5px_18px_rgba(79,42,18,0.12)] transition duration-300 group-hover:rotate-2 md:h-14 md:w-14"
          />
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-bold uppercase leading-none tracking-[0.04em] md:text-xl">
              Jhashree
            </p>
            <p className="mt-1 truncate font-bold uppercase tracking-[0.25em] text-[var(--muted)] text-xs md:text-[0.52rem]">
              Creative Productions
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--rust)]"
        >
          Back to home
        </Link>
      </div>
    </header>
  );
}
