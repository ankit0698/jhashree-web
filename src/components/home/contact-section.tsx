import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

type ContactIconName = "phone" | "mail" | "pin";

function ContactIcon({ name }: { name: ContactIconName }) {
  const paths: Record<ContactIconName, string> = {
    phone:
      "M7.2 3.5 10 7.2 8.3 9.5a14.5 14.5 0 0 0 6.2 6.2l2.3-1.7 3.7 2.8-1.2 3.1c-.5 1.2-1.8 1.9-3.1 1.6C9.3 19.9 4.1 14.7 2.5 7.8c-.3-1.3.4-2.6 1.6-3.1l3.1-1.2Z",
    mail: "M3 6h18v12H3V6Zm1 1 8 6 8-6",
    pin: "M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  };

  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--rust)]/20 bg-[var(--rust)]/[0.04] text-[var(--rust)]">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={paths[name]}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const contactItems: Array<{
  label: string;
  icon: ContactIconName;
  content: ReactNode;
}> = [
  {
    label: "Call",
    icon: "phone",
    content: (
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <a
          href="tel:+917565888785"
          className="transition hover:text-[var(--rust)]"
        >
          +91 75658 88785
        </a>

        <a
          href="tel:+917255910607"
          className="transition hover:text-[var(--rust)]"
        >
          +91 72559 10607
        </a>
      </div>
    ),
  },
  {
    label: "Email",
    icon: "mail",
    content: (
      <a
        href="mailto:jhashri.productions@gmail.com"
        className="break-all transition hover:text-[var(--rust)]"
      >
        jhashri.productions@gmail.com
      </a>
    ),
  },
  {
    label: "Studio",
    icon: "pin",
    content: <>Santunagar Chowk, Madhubani, Bihar 847211</>,
  },
];

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [formMessage, setFormMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!phone && !email) {
      setFormStatus("error");
      setFormMessage("Enter a contact number or an email address.");
      return;
    }

    setFormStatus("submitting");
    setFormMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          phone,
          email,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Your enquiry could not be submitted.");
      }

      form.reset();

      setFormStatus("success");
      setFormMessage("Thank you. Your enquiry has been sent successfully.");
    } catch (error) {
      setFormStatus("error");

      setFormMessage(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be submitted.",
      );
    }
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-[var(--paper-light)] py-8 md:py-12"
    >
      {/* SUBTLE FLOWER / LOTUS ART */}
      <div className="pointer-events-none absolute -bottom-24 -left-20 hidden h-[27rem] w-[27rem] opacity-[0.1] md:block">
        <Image
          src="/assets/madhubani-paintings/lotus-border.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="27rem"
          className="select-none object-contain object-left-bottom mix-blend-multiply"
        />
      </div>

      <div className="site-gutter relative z-10 mx-auto max-w-[82rem]">
        <div className="overflow-hidden rounded-[1.25rem] border border-black/[0.08] bg-[var(--surface)]">
          <div className="grid md:grid-cols-[0.82fr_1.18fr]">
            {/* =========================
                LEFT
            ========================== */}
            <div className="relative border-b border-black/[0.08] p-5 md:border-b-0 md:border-r md:p-6">
              {/* SMALL INTERNAL FLOWER ACCENT */}
              <Image
                src="/assets/madhubani-paintings/lotus-border.webp"
                alt=""
                aria-hidden="true"
                width={600}
                height={400}
                className="pointer-events-none absolute -bottom-16 -right-20 hidden w-[19rem] opacity-[0.07] mix-blend-multiply md:block"
              />

              <div className="relative z-10">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
                  Let&apos;s Talk
                </p>

                <h2 className="mt-2 max-w-sm font-serif text-[2.35rem] leading-[0.95] tracking-[-0.035em] text-[var(--ink)] md:text-[2.7rem]">
                  Have a story
                  <span className="block italic text-[var(--rust)]">
                    worth telling?
                  </span>
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                  Tell us what you&apos;re planning and we&apos;ll help bring
                  the idea to life.
                </p>

                {/* CONTACT DETAILS */}
                <div className="mt-4 grid gap-2.5">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <ContactIcon name={item.icon} />

                      <div className="min-w-0 pt-0.5">
                        <p className="text-[0.52rem] font-bold uppercase tracking-[0.16em] text-[var(--rust)]">
                          {item.label}
                        </p>

                        <div className="mt-0.5 text-[0.78rem] leading-5 text-[var(--foreground)] md:text-[0.82rem]">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SMALL MAP */}
                <div className="relative mt-4 h-[10rem] overflow-hidden rounded-xl border border-black/[0.08] bg-[var(--ink)]">
                  <iframe
                    title="Jhashree Productions location"
                    src="https://www.google.com/maps?q=JhaShree+Productions,+Santunagar+Chowk,+Madhubani,+Bihar+847211&z=16&output=embed"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 block h-full w-full border-0"
                  />

                  {/* makes button easier to read */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

                  <a
                    href="https://www.google.com/maps/place/JhaShree+Productions/@26.359709,86.068952,16z/data=!4m6!3m5!1s0x39edcd72be971f77:0x8920325024312249!8m2!3d26.3597087!4d86.0689515!16s%2Fg%2F11x1ywn4_f?hl=en-US&entry=ttu"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-3 py-2 text-[0.58rem] font-semibold text-white backdrop-blur-sm transition hover:bg-black"
                  >
                    Expand Map
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* =========================
                RIGHT / FORM
            ========================== */}
            <div className="p-5 md:p-6">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--rust)]">
                    Send an enquiry
                  </p>

                  <h3 className="mt-1.5 font-serif text-[1.6rem] leading-tight text-[var(--ink)]">
                    Tell us about your project.
                  </h3>
                </div>

                <span className="hidden text-[0.65rem] text-[var(--muted)] md:block">
                  We&apos;ll get back to you soon.
                </span>
              </div>

              {formStatus === "success" ? (
                <div
                  role="status"
                  className="grid min-h-[19rem] place-items-center rounded-xl border border-[var(--rust)]/15 bg-white/55 px-5 py-8 text-center"
                >
                  <div className="max-w-sm">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--rust)] text-white shadow-[0_10px_28px_rgba(166,57,30,0.22)]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="h-7 w-7"
                      >
                        <path
                          d="m5 12.5 4.25 4.25L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--rust)]">
                      Enquiry received
                    </p>

                    <h3 className="mt-2 font-serif text-[1.9rem] leading-tight text-[var(--ink)]">
                      Thank you for reaching out.
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {formMessage} We&apos;ll review your message and get back to
                      you soon.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setFormStatus("idle");
                        setFormMessage("");
                      }}
                      className="site-button site-button-rust mt-6"
                    >
                      Send another message
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                {/* TITLE */}
                <div>
                  <label
                    htmlFor="enquiry-title"
                    className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]"
                  >
                    Project / Query
                  </label>

                  <input
                    id="enquiry-title"
                    name="title"
                    type="text"
                    required
                    maxLength={160}
                    placeholder="What would you like to create?"
                    className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/65 px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--rust)] focus:ring-4 focus:ring-[var(--rust)]/10"
                  />
                </div>

                {/* PHONE / EMAIL */}
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="enquiry-phone"
                      className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]"
                    >
                      Phone
                    </label>

                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/65 px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--rust)] focus:ring-4 focus:ring-[var(--rust)]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]"
                    >
                      Email
                    </label>

                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/65 px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--rust)] focus:ring-4 focus:ring-[var(--rust)]/10"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-3">
                  <label
                    htmlFor="enquiry-description"
                    className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]"
                  >
                    Brief
                  </label>

                  <textarea
                    id="enquiry-description"
                    name="description"
                    required
                    maxLength={5000}
                    rows={4}
                    placeholder="A few details about your idea, timeline and requirements..."
                    className="mt-1.5 w-full resize-none rounded-lg border border-black/10 bg-white/65 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--rust)] focus:ring-4 focus:ring-[var(--rust)]/10"
                  />
                </div>

                {/* BOTTOM */}
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="site-button site-button-rust disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formStatus === "submitting" ? "Sending…" : "Send Enquiry"}

                    <span aria-hidden="true">→</span>
                  </button>

                  {formStatus === "error" && formMessage ? (
                    <p
                      role="alert"
                      className="max-w-xs text-xs font-semibold text-red-700"
                    >
                      {formMessage}
                    </p>
                  ) : (
                    <p className="text-[0.68rem] text-[var(--muted)]">
                      Phone or email is required.
                    </p>
                  )}
                </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
