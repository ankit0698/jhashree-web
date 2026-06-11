import Image from "next/image";

import { navItems, socialLinks } from "@/components/home/content";

export default function SiteFooter() {
  return (
    <footer className="w-full px-0 pb-0 pt-6">
      <div className="relative overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(28,18,12,0.98),rgba(62,38,14,0.94))] px-5 py-8 text-[var(--hero-foreground)] shadow-[var(--shadow-deep)] sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -left-14 bottom-0 opacity-20">
          <Image
            src="/assets/flowers.png"
            alt=""
            aria-hidden="true"
            width={320}
            height={320}
            className="h-auto w-44 sm:w-56"
          />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-14 hidden opacity-20 md:block">
          <Image
            src="/assets/circle.svg"
            alt=""
            aria-hidden="true"
            width={240}
            height={240}
            className="h-auto w-48"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-[5rem_minmax(0,1fr)]">
            <div className="flex h-20 w-20 items-center justify-center">
              <Image
                src="/assets/brand-logo.png"
                alt="Jhashree Productions logo"
                width={72}
                height={72}
                className="h-18 w-18 rounded-full object-contain"
              />
            </div>
            <div className="min-w-0 self-center">
              <p className="text-xl font-semibold text-[var(--accent-soft)] sm:text-2xl">
                Jhashree Productions
              </p>
              <p className="mt-1 text-sm text-[var(--hero-muted)]">
                Branding, media, and production
              </p>
            </div>

            <p className="text-sm leading-7 text-[var(--hero-muted)] sm:col-span-2">
              Creative work across content, branding visuals, and event
              production, presented with a cleaner digital presence.
            </p>
          </div>

          <div className="flex items-start justify-between gap-8 sm:gap-10">
            <div className="min-w-0 flex-1">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                Quick Links
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--hero-muted)]">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-soft)]">
                Social Media
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-12 w-12 items-center justify-center  transition hover:scale-[1.1]"
                  >
                    <Image
                      src="/assets/instagram.png"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      className="h-10 w-10 object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-[var(--hero-muted)] sm:mt-10 sm:pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Jhashree Productions. All rights reserved.</p>
            <p>Santunagar Chowk, Madhubani, Bihar 847211</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
