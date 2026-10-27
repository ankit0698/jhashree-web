import type { FormEvent } from "react";
import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";
type YesNo = "yes" | "no" | "";

const fieldClassName = "site-input";

const labelClassName =
  "text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]";

function FieldLabel({
  htmlFor,
  children,
  hindi,
  optional = false,
}: {
  htmlFor: string;
  children: string;
  hindi: string;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className={labelClassName}>
        {children}
        {optional ? (
          <span className="ml-2 font-medium normal-case tracking-normal text-[var(--muted)]">
            (optional)
          </span>
        ) : null}
      </span>
      <span className="mt-1 block text-[0.78rem] leading-5 text-[var(--muted)]">
        {hindi}
      </span>
    </label>
  );
}

function SectionHeading({ step, title }: { step: string; title: string }) {
  return (
    <div className="border-b border-[var(--border)] pb-4">
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
        Section {step}
      </p>
      <h2 className="mt-2 font-serif text-[1.65rem] leading-tight text-[var(--ink)] md:text-[1.9rem]">
        {title}
      </h2>
    </div>
  );
}

function YesNoField({
  name,
  legend,
  hindi,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  hindi: string;
  value: YesNo;
  onChange: (next: YesNo) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClassName}>{legend}</legend>
      <p className="mt-1 text-[0.78rem] leading-5 text-[var(--muted)]">{hindi}</p>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {(
          [
            ["yes", "Yes", "हाँ"],
            ["no", "No", "नहीं"],
          ] as const
        ).map(([option, label, hindiLabel]) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${
              value === option
                ? "border-[var(--rust)]/40 bg-[var(--rust)]/[0.05] text-[var(--ink)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] hover:border-[var(--rust)]/25"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              required
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-[var(--rust)]"
            />
            <span>
              {label}
              <span className="ml-2 text-[var(--muted)]">{hindiLabel}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SurveyForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [wantsToPromoteCulture, setWantsToPromoteCulture] = useState<YesNo>("");
  const [knowsSamaChakewa, setKnowsSamaChakewa] = useState<YesNo>("");
  const [wantsToJoinEvent, setWantsToJoinEvent] = useState<YesNo>("");
  const [interestedInCampaign, setInterestedInCampaign] = useState<YesNo>("");

  function resetChoices() {
    setWantsToPromoteCulture("");
    setKnowsSamaChakewa("");
    setWantsToJoinEvent("");
    setInterestedInCampaign("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (
      !wantsToPromoteCulture ||
      !knowsSamaChakewa ||
      !wantsToJoinEvent ||
      !interestedInCampaign
    ) {
      setFormStatus("error");
      setFormMessage("Please answer every yes or no question.");
      return;
    }

    setFormStatus("submitting");
    setFormMessage("");

    const payload = {
      fullName: formData.get("fullName"),
      contactNumber: formData.get("contactNumber"),
      email: formData.get("email"),
      address: formData.get("address"),
      contentType: formData.get("contentType"),
      instagramUsername: formData.get("instagramUsername"),
      instagramFollowers: formData.get("instagramFollowers"),
      facebookLink: formData.get("facebookLink"),
      facebookFollowers: formData.get("facebookFollowers"),
      youtubeLink: formData.get("youtubeLink"),
      youtubeSubscribers: formData.get("youtubeSubscribers"),
      wantsToPromoteCulture: wantsToPromoteCulture === "yes",
      promoteCultureHow: formData.get("promoteCultureHow"),
      promoteCultureWhy: formData.get("promoteCultureWhy"),
      knowsSamaChakewa: knowsSamaChakewa === "yes",
      wantsToJoinEvent: wantsToJoinEvent === "yes",
      interestedInCampaign: interestedInCampaign === "yes",
    };

    try {
      const response = await fetch("/api/sama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Your application could not be submitted.");
      }

      form.reset();
      resetChoices();
      setFormStatus("success");
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Your application could not be submitted.",
      );
    }
  }

  if (formStatus === "success") {
    return (
      <div
        role="status"
        className="rounded-[1.25rem] border border-[var(--rust)]/15 bg-[var(--surface-soft)] px-6 py-12 text-center"
      >
        <div className="mx-auto max-w-xl">
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
            Submitted
          </p>

          <h2 className="mt-2 font-serif text-[2rem] leading-tight text-[var(--ink)] md:text-[2.35rem]">
            Thank you.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Thank you for completing the survey and it has been successfully
            submitted. Once reviewed by our experts will reach out you. If you
            get shortlisted you will get an invitation on your mail with the
            event and campaign details.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Meanwhile you can follow our page:{" "}
            <a
              href="https://www.instagram.com/jhashree.vibe.vision"
              className="font-semibold text-[var(--rust)]"
              target="_blank"
              rel="noreferrer"
            >
              @jhashree.vibe.vision
            </a>
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            For any queries drop an enquiry at our website footer.
          </p>

          <button
            type="button"
            onClick={() => {
              setFormStatus("idle");
              setFormMessage("");
            }}
            className="site-button site-button-rust mt-7"
          >
            Submit another response
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="space-y-10 p-5 md:p-8">
        <section className="space-y-4">
          <SectionHeading step="01" title="Your details" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="fullName" hindi="नाम">
                Name
              </FieldLabel>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                maxLength={160}
                autoComplete="name"
                placeholder="Your full name"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="contactNumber" hindi="संपर्क नंबर">
                Contact
              </FieldLabel>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="email" hindi="ईमेल">
                Email
              </FieldLabel>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="address" hindi="पता">
                Address
              </FieldLabel>
              <textarea
                id="address"
                name="address"
                required
                maxLength={500}
                rows={3}
                autoComplete="street-address"
                placeholder="Village, town, district"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="contentType" hindi="आप किस तरह का कंटेंट बनाते हैं?">
                What type of content do you make?
              </FieldLabel>
              <textarea
                id="contentType"
                name="contentType"
                required
                maxLength={500}
                rows={3}
                placeholder="Travel, culture, comedy, food…"
                className={`${fieldClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading step="02" title="Where you publish" />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="instagramUsername" hindi="इंस्टाग्राम यूजरनेम">
                Instagram username
              </FieldLabel>
              <input
                id="instagramUsername"
                name="instagramUsername"
                type="text"
                required
                maxLength={120}
                placeholder="@yourname"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="instagramFollowers" hindi="इंस्टाग्राम फॉलोअर्स">
                Instagram followers
              </FieldLabel>
              <input
                id="instagramFollowers"
                name="instagramFollowers"
                type="number"
                required
                min={0}
                step={1}
                placeholder="e.g. 12000"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="facebookLink"
                hindi="फेसबुक लिंक/यूजरनेम"
                optional
              >
                Facebook Link/Username
              </FieldLabel>
              <input
                id="facebookLink"
                name="facebookLink"
                type="text"
                maxLength={500}
                placeholder="Link or @username"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="facebookFollowers"
                hindi="फेसबुक फॉलोअर्स"
                optional
              >
                Facebook followers
              </FieldLabel>
              <input
                id="facebookFollowers"
                name="facebookFollowers"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 8000"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="youtubeLink"
                hindi="यूट्यूब लिंक/यूजरनेम"
                optional
              >
                YouTube Link/Username
              </FieldLabel>
              <input
                id="youtubeLink"
                name="youtubeLink"
                type="text"
                maxLength={500}
                placeholder="Link or @username"
                className={`${fieldClassName} mt-2`}
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="youtubeSubscribers"
                hindi="यूट्यूब सब्सक्राइबर्स"
                optional
              >
                YouTube subscribers
              </FieldLabel>
              <input
                id="youtubeSubscribers"
                name="youtubeSubscribers"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 5000"
                className={`${fieldClassName} mt-2`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading step="03" title="Culture and the event" />

          <YesNoField
            name="wantsToPromoteCulture"
            legend="Do you want to promote your culture with your content?"
            hindi="क्या आप अपने कंटेंट से अपनी संस्कृति को बढ़ावा देना चाहते हैं?"
            value={wantsToPromoteCulture}
            onChange={setWantsToPromoteCulture}
          />

          {wantsToPromoteCulture === "yes" ? (
            <div>
              <FieldLabel htmlFor="promoteCultureHow" hindi="हाँ, तो कैसे?">
                If yes, how?
              </FieldLabel>
              <textarea
                id="promoteCultureHow"
                name="promoteCultureHow"
                required
                maxLength={5000}
                rows={4}
                className={`${fieldClassName} mt-2`}
              />
            </div>
          ) : null}

          {wantsToPromoteCulture === "no" ? (
            <div>
              <FieldLabel htmlFor="promoteCultureWhy" hindi="नहीं, तो क्यों?">
                If no, why?
              </FieldLabel>
              <textarea
                id="promoteCultureWhy"
                name="promoteCultureWhy"
                required
                maxLength={5000}
                rows={4}
                className={`${fieldClassName} mt-2`}
              />
            </div>
          ) : null}

          <YesNoField
            name="knowsSamaChakewa"
            legend="Do you know about Sama Chakewa?"
            hindi="क्या आप सामा चकेवा के बारे में जानते हैं?"
            value={knowsSamaChakewa}
            onChange={setKnowsSamaChakewa}
          />

          <YesNoField
            name="wantsToJoinEvent"
            legend="Do you want to join an upcoming event on Sama Chakewa?"
            hindi="क्या आप सामा चकेवा के आगामी कार्यक्रम में शामिल होना चाहते हैं?"
            value={wantsToJoinEvent}
            onChange={setWantsToJoinEvent}
          />

          <YesNoField
            name="interestedInCampaign"
            legend="Are you interested in being part of a cultural promotion campaign?"
            hindi="क्या आप सांस्कृतिक प्रचार अभियान का हिस्सा बनना चाहते हैं?"
            value={interestedInCampaign}
            onChange={setInterestedInCampaign}
          />
        </section>

        {formStatus === "error" && formMessage ? (
          <p role="alert" className="text-sm text-red-700">
            {formMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={formStatus === "submitting"}
          className="site-button site-button-rust"
        >
          {formStatus === "submitting" ? "Submitting…" : "Submit"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
