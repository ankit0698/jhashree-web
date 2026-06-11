import { processSteps, services } from "@/components/home/content";
import SectionHeading from "@/components/home/section-heading";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="mx-auto max-w-7xl scroll-mt-28 px-5 py-4 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Services"
        title="Creative services designed to move a brand forward."
        description=""
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(84,52,16,0.08)] transition hover:-translate-y-1"
          >
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

      <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-[0_24px_60px_rgba(84,52,16,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Process"
          title="A production flow that stays clear from first brief to delivery."
        />

        <div className="mt-8 grid gap-5">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]"
            >
              <p className="font-serif text-4xl leading-none text-[var(--accent)]">
                {step.number}
              </p>
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
