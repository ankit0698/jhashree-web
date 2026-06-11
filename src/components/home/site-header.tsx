import { useState } from "react";
import Image from "next/image";

import { navItems } from "@/components/home/content";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#180f09]/92 text-[var(--hero-foreground)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/assets/brand-logo.png"
            alt="Jhashree Productions logo"
            width={52}
            height={52}
            className="h-[3.25rem] w-[3.25rem] rounded-full border border-white/15 bg-white/8"
          />
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[var(--accent-soft)]">
              Madhubani, Bihar
            </p>
            <p className="text-base font-semibold tracking-[0.04em] text-[var(--hero-foreground)]">
              Jhashree Productions
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-[var(--hero-muted)] md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-[var(--accent-soft)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--foreground-contrast)] transition hover:border-[var(--accent-deep)] hover:bg-[var(--accent-deep)] md:inline-flex"
        >
          Start a project
        </a>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-[var(--hero-foreground)] transition hover:bg-white/12 md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:px-6 md:hidden">
          <nav className="rounded-[1.5rem] border border-white/10 bg-[#180f09]/92 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col items-center">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="w-full rounded-[1rem] px-4 py-3 text-center text-sm font-medium transition hover:bg-white/8"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--foreground-contrast)] transition hover:bg-[var(--accent-deep)]"
              >
                Start a project
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
