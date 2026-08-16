import Image from "next/image";

import { services } from "@/components/home/content";

function ServiceIcon({ index }: { index: number }) {
  const paths = [
    "M4 7h11v10H4zM15 10l5-3v10l-5-3M7 4h5",
    "M5 5h14v14H5zM8 9h8M8 13h5M16.5 15.5l2.5 2.5",
    "M4 6h16v12H4zM8 6l4 5 4-5M8 18l4-5 4 5",
    "M8 4l2 4-4 2-2-4 4-2Zm8 10 4 2-2 4-4-2 2-4ZM14 4l6 6M4 20l7-7",
  ];

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#c76035,#9f321f)] text-[#fff4df] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={paths[index]}
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SocialIcon({
  name,
}: {
  name: "instagram" | "facebook" | "youtube" | "whatsapp";
}) {
  if (name === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        aria-hidden="true"
      >
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

  if (name === "facebook") {
    return (
      <span aria-hidden="true" className="font-serif text-lg font-bold">
        f
      </span>
    );
  }

  if (name === "youtube") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8.5c.5 2.7 2 4.2 4.7 5l1-1.2 1.8.8-.2 1.8c-4.4.5-7.6-2.5-8.1-6.7L9 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-[#0d0d0c] text-[#fff7eb]"
    >
      <div className="mx-auto grid max-w-[100rem] md:grid-cols-[1.65fr_0.85fr]">
        {/* LEFT SIDE */}
        <div className="site-gutter relative py-14 md:py-16">
          <div className="relative z-10">
            <p className="text-[0.61rem] font-extrabold uppercase tracking-[0.28em] text-[var(--orange)]">
              What We Do
            </p>

            <h2 className="mt-3 font-serif text-[2.6rem] leading-[0.92] tracking-[-0.02em] md:text-[3.4rem]">
              Services That
              <span className="block">Make an Impact</span>
            </h2>

            <div className="mt-5 h-px w-10 bg-[var(--accent)]" />

            <div className="mt-7 grid gap-4 md:grid-cols-4">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="min-h-[14rem] rounded-xl border border-white/[0.04] bg-[linear-gradient(145deg,#282620,#1e1d19)] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/25"
                >
                  <ServiceIcon index={index} />

                  <h3 className="mt-5 font-serif text-[1.05rem] leading-[1.05] text-[#fff7eb]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-[0.69rem] leading-[1.55] text-white/65">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="site-gutter relative min-h-[34rem] overflow-hidden border-t border-white/10 bg-black py-14 md:min-h-[38rem] md:border-l md:border-t-0 md:py-16">
          {/* FULL HEIGHT BIRD IMAGE */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden md:flex md:items-stretch">
            <Image
              src="/assets/madhubani-paintings/bird.webp"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1536}
              priority
              sizes="35vw"
              className="h-full w-auto max-w-none object-contain object-right opacity-60"
            />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 max-w-[16rem]">
            <p className="text-[0.61rem] font-extrabold uppercase tracking-[0.26em] text-[var(--orange)]">
              Let&apos;s Create Together
            </p>

            <h2 className="mt-4 font-serif text-[2.65rem] leading-[0.92] tracking-[-0.02em] md:text-[3.35rem]">
              Have a Project
              <span className="block">in Mind?</span>
            </h2>

            <p className="mt-5 max-w-[15rem] text-[0.75rem] leading-5 text-white/65">
              Let&apos;s collaborate and create something amazing.
            </p>

            <a href="#contact" className="site-button site-button-rust mt-6">
              Get in Touch
              <span aria-hidden="true">→</span>
            </a>

            {/* SOCIAL ICONS */}
            <div className="mt-7 flex gap-3">
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/jhashree_/profilecard/?igsh=MXRkZ2xvNjRiOGhiYg%3D%3D"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.06] text-[var(--accent-soft)] transition hover:border-[var(--accent)]/50 hover:bg-white/[0.1]"
              >
                <SocialIcon name="instagram" />
              </a>

              {/* FACEBOOK */}
              <span
                aria-label="Facebook"
                title="Facebook"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.06] text-[var(--accent-soft)]"
              >
                <SocialIcon name="facebook" />
              </span>

              {/* YOUTUBE */}
              <span
                aria-label="YouTube"
                title="YouTube"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.06] text-[var(--accent-soft)]"
              >
                <SocialIcon name="youtube" />
              </span>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/917565888785"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.06] text-[var(--accent-soft)] transition hover:border-[var(--accent)]/50 hover:bg-white/[0.1]"
              >
                <SocialIcon name="whatsapp" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
