import Image from "next/image";

import { navItems, socialLinks } from "@/components/home/content";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--ink)] text-[var(--hero-foreground)]">
      <Image
        src="/assets/madhubani-paintings/fish-new.webp"
        alt=""
        aria-hidden="true"
        width={2172}
        height={724}
        sizes="(max-width: 768px) 46rem, 58rem"
        className="pointer-events-none absolute -bottom-1 -right-36 h-auto w-[46rem] opacity-30 md:right-0 md:w-[58rem] md:opacity-40"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_0%,var(--ink)_36%,rgba(17,17,15,0.78)_64%,rgba(17,17,15,0.28)_100%)]" />

      <div className="site-gutter relative z-10 mx-auto max-w-[90rem] py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <a
              href="#top"
              className="group inline-flex items-center gap-4"
              aria-label="Back to top"
            >
              <Image
                src="/assets/brand-logo.png"
                alt="Jhashree Productions logo"
                width={64}
                height={64}
                className="h-14 w-14 rounded-full object-cover transition duration-300 group-hover:rotate-2"
              />
              <div>
                <p className="font-serif text-2xl font-semibold">
                  Jhashree Productions
                </p>
                <p className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.27em] text-[var(--accent-soft)]">
                  Stories from Madhubani
                </p>
              </div>
            </a>
            <p className="mt-7 max-w-xl font-serif text-3xl leading-tight text-[#fff6e8] md:text-4xl">
              Rooted in culture. Driven by creativity.
            </p>
          </div>

          <div className="border-t border-white/10 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-[var(--hero-muted)]">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-[var(--accent-soft)] transition hover:border-[var(--accent)] hover:bg-white/[0.06]"
                >
                  <InstagramIcon />
                </a>
              ))}
              <a
                href="mailto:jhashri.productions@gmail.com"
                className="text-[14px] text-[var(--hero-muted)] transition hover:text-white"
              >
                jhashri.productions@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.08] pt-6 text-[14px] text-[var(--hero-muted)] md:flex-row md:justify-between">
          <p>© 2026 Jhashree Productions. All rights reserved.</p>
          <p>Madhubani, Bihar · India</p>
        </div>
      </div>
    </footer>
  );
}
