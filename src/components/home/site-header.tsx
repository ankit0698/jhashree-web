import Image from "next/image";
import { useEffect, useState } from "react";

import { navItems } from "@/components/home/content";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");

  useEffect(() => {
    let animationFrame = 0;

    function updateActiveSection() {
      const marker = window.scrollY + 120;
      let currentHref = navItems[0]?.href ?? "#top";

      navItems.forEach((item) => {
        const section = document.querySelector<HTMLElement>(item.href);

        if (section && section.offsetTop <= marker) {
          currentHref = item.href;
        }
      });

      setActiveHref(currentHref);
    }

    function handleViewportChange() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-[60] border-b border-black/[0.06] bg-[var(--paper-light)]/95 text-[var(--ink)] shadow-[0_5px_20px_rgba(44,30,18,0.06)] backdrop-blur-xl">
      <div className="site-gutter mx-auto flex min-h-[5.25rem] max-w-[90rem] items-center justify-between gap-6">
        <a
          href="#top"
          onClick={closeMenu}
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
        </a>

        <nav className="hidden items-center gap-8 text-base font-semibold md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveHref(item.href)}
              aria-current={activeHref === item.href ? "page" : undefined}
              className={`relative py-3 transition hover:text-[var(--rust)] ${
                activeHref === item.href
                  ? "text-[var(--rust)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-[var(--rust)]"
                  : "text-[var(--ink)]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="site-button site-button-rust hidden min-h-11 px-6 text-base md:inline-flex"
        >
          Let&apos;s Talk
        </a>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 bg-transparent transition hover:border-[var(--rust)] hover:text-[var(--rust)] md:hidden"
        >
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="site-gutter border-t border-black/[0.07] pb-5 pt-3 md:hidden"
        >
          <nav className="rounded-xl border border-black/[0.08] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveHref(item.href);
                  closeMenu();
                }}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={`block rounded-lg border-b border-black/[0.06] px-4 py-3 text-center text-sm font-semibold transition last:border-0 hover:bg-[var(--background)] hover:text-[var(--rust)] ${
                  activeHref === item.href
                    ? "bg-[var(--background)] text-[var(--rust)]"
                    : "text-[var(--ink)]"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={closeMenu}
              className="site-button site-button-ink mt-2 w-full"
            >
              Let&apos;s Talk
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
