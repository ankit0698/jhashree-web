import { processSteps, services } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 py-4 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Services"
        title="Creative services designed to move a brand forward."
      />

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,242,0.94),rgba(246,235,214,0.92))] p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent),rgba(20,101,80,0.6))]" />
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-deep)]">
              0{index + 1}
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
              {service.title}
            </h3>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              {service.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(248,239,220,0.96),rgba(241,217,172,0.78))] p-5 shadow-[var(--shadow-soft)] sm:p-8">
        <SectionHeading
          eyebrow="Process"
          title="A production flow that stays clear from first brief to delivery."
        />

        <div className="mt-8 grid gap-5">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="grid gap-3 rounded-[1.5rem] border border-[rgba(155,90,27,0.12)] bg-[rgba(255,250,242,0.9)] p-4 shadow-[0_14px_28px_rgba(84,52,16,0.05)] sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:p-5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(216,155,47,0.12)]">
                <p className="font-serif text-3xl leading-none text-[var(--accent)]">
                  {step.number}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
