import SectionHeading from "@/components/home/section-heading";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-7xl scroll-mt-28 px-5 py-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,#faefdb_0%,#f1d9ac_48%,#e2b15c_100%)] shadow-[0_30px_90px_rgba(94,61,18,0.14)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:px-12 lg:py-12">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let’s make your next campaign feel memorable, local, and unmistakably yours."
              description="Reach out for content creation, branding support, event coverage, or a custom production package."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/[0.55] p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                  Call
                </p>
                <a
                  href="tel:+917565888785"
                  className="mt-3 block text-lg font-semibold text-[var(--foreground)]"
                >
                  +91 75658 88785
                </a>
                <a
                  href="tel:+917255910607"
                  className="mt-1 block text-lg font-semibold text-[var(--foreground)]"
                >
                  +91 72559 10607
                </a>
              </div>

              <div className="rounded-[1.5rem] bg-white/[0.55] p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                  Email
                </p>
              <a
                href="mailto:jhashri.productions@gmail.com"
                className="mt-3 block overflow-wrap-anywhere text-lg font-semibold leading-tight text-[var(--foreground)]"
              >
                jhashri.productions@gmail.com
              </a>
              </div>

              <div className="rounded-[1.5rem] bg-white/[0.55] p-5 backdrop-blur sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">
                  Address
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                  Santunagar Chowk, Madhubani, Bihar 847211
                </p>
                <p className="mt-2 text-sm text-[var(--muted-strong)]">
                  Mon-Sat: 9:00am to 6:00pm
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-[rgba(63,37,11,0.90)] text-white shadow-[0_20px_50px_rgba(53,28,8,0.24)]">
            <div className="px-6 pb-6 pt-6">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-soft)]">
                Location
              </p>
              <h3 className="mt-4 font-serif text-3xl">
                Visit Jhashree Productions in Madhubani.
              </h3>
            </div>

            <div className="border-y border-white/10">
              <iframe
                title="Jhashree Productions location"
                src="https://www.google.com/maps?q=JhaShree+Productions,+Santunagar+Chowk,+Madhubani,+Bihar+847211&z=17&output=embed"
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[22rem] w-full border-0 sm:h-[26rem]"
              />
            </div>

            <div className="px-6 py-6">
              <a
                href="https://www.google.com/maps/place/JhaShree+Productions/@26.359709,86.068952,16z/data=!4m6!3m5!1s0x39edcd72be971f77:0x8920325024312249!8m2!3d26.3597087!4d86.0689515!16s%2Fg%2F11x1ywn4_f?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--foreground-contrast)] transition hover:bg-[var(--accent-deep)]"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
