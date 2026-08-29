import type { FormEvent } from "react";
import { useState } from "react";

import {
  SURVEY_NICHES,
  SURVEY_PLATFORMS,
  type SurveyNiche,
  type SurveyPlatform,
} from "@/types/survey";

type FormStatus = "idle" | "submitting" | "success" | "error";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-white/65 px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)]/55 focus:border-[var(--rust)] focus:ring-4 focus:ring-[var(--rust)]/10";

const labelClassName =
  "text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]";

const tipClassName = "mt-1.5 text-[0.72rem] leading-5 text-[var(--muted)]";

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: string;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClassName}>
      {children}
      {optional ? (
        <span className="ml-2 font-medium normal-case tracking-normal text-[var(--muted)]">
          (optional)
        </span>
      ) : null}
    </label>
  );
}

function SectionHeading({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-black/[0.07] pb-4">
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
        Section {step}
      </p>
      <h2 className="mt-2 font-serif text-[1.65rem] leading-tight text-[var(--ink)] md:text-[1.9rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function SurveyForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [primaryNiche, setPrimaryNiche] = useState<SurveyNiche | "">("");
  const [hasSponsoredWork, setHasSponsoredWork] = useState<boolean | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (hasSponsoredWork === null) {
      setFormStatus("error");
      setFormMessage("Tell us whether you have done sponsored brand work.");
      return;
    }

    setFormStatus("submitting");
    setFormMessage("");

    const payload = {
      fullName: formData.get("fullName"),
      contactNumber: formData.get("contactNumber"),
      email: formData.get("email"),
      primaryNiche: formData.get("primaryNiche"),
      primaryNicheOther: formData.get("primaryNicheOther"),
      primaryPlatform: formData.get("primaryPlatform") as SurveyPlatform,
      instagramHandle: formData.get("instagramHandle"),
      instagramFollowers: formData.get("instagramFollowers"),
      youtubeChannel: formData.get("youtubeChannel"),
      youtubeSubscribers: formData.get("youtubeSubscribers"),
      facebookPage: formData.get("facebookPage"),
      contentUnique: formData.get("contentUnique"),
      brandBenefit: formData.get("brandBenefit"),
      brandIntegrationStyle: formData.get("brandIntegrationStyle"),
      hasSponsoredWork,
      samplePromoLinks: formData.get("samplePromoLinks"),
      whyParticipate: formData.get("whyParticipate"),
    };

    try {
      const response = await fetch("/api/survey", {
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
      setPrimaryNiche("");
      setHasSponsoredWork(null);
      setFormStatus("success");
      setFormMessage(
        "Thank you. Your Roots & Reels Season 2 application has been received.",
      );
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
        className="grid min-h-[22rem] place-items-center rounded-[1.25rem] border border-[var(--rust)]/15 bg-white/55 px-6 py-12 text-center"
      >
        <div className="max-w-md">
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
            Application received
          </p>

          <h2 className="mt-2 font-serif text-[2rem] leading-tight text-[var(--ink)] md:text-[2.35rem]">
            You&apos;re on the list for Roots &amp; Reels.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {formMessage} We&apos;ll review your profile and reach out if
            selected.
          </p>

          <button
            type="button"
            onClick={() => {
              setFormStatus("idle");
              setFormMessage("");
            }}
            className="site-button site-button-rust mt-7"
          >
            Submit another application
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[1.25rem] border border-black/[0.08] bg-[var(--surface)]"
    >
      <div className="space-y-10 p-5 md:p-8">
        {/* Section 1 */}
        <section className="space-y-4">
          <SectionHeading
            step="01"
            title="Creator Profile & Contact Details"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                maxLength={160}
                autoComplete="name"
                placeholder="Your full name"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="contactNumber">
                Contact number (WhatsApp preferred)
              </FieldLabel>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClassName}
              />
            </div>
          </div>

          <fieldset>
            <legend className={labelClassName}>Primary niche / category</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {SURVEY_NICHES.map((niche) => (
                <label
                  key={niche.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${
                    primaryNiche === niche.value
                      ? "border-[var(--rust)]/40 bg-[var(--rust)]/[0.05] text-[var(--ink)]"
                      : "border-black/10 bg-white/50 text-[var(--foreground)] hover:border-[var(--rust)]/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="primaryNiche"
                    value={niche.value}
                    required
                    checked={primaryNiche === niche.value}
                    onChange={() => setPrimaryNiche(niche.value)}
                    className="accent-[var(--rust)]"
                  />
                  {niche.label}
                </label>
              ))}
            </div>
          </fieldset>

          {primaryNiche === "other" ? (
            <div>
              <FieldLabel htmlFor="primaryNicheOther">
                Please specify your niche
              </FieldLabel>
              <input
                id="primaryNicheOther"
                name="primaryNicheOther"
                type="text"
                required
                maxLength={120}
                placeholder="Your niche"
                className={fieldClassName}
              />
            </div>
          ) : null}
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <SectionHeading
            step="02"
            title="Social Media Reach & Analytics"
          />

          <fieldset>
            <legend className={labelClassName}>Primary content platform</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
              {SURVEY_PLATFORMS.map((platform) => (
                <label
                  key={platform.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/10 bg-white/50 px-3.5 py-3 text-sm transition hover:border-[var(--rust)]/25 has-[:checked]:border-[var(--rust)]/40 has-[:checked]:bg-[var(--rust)]/[0.05]"
                >
                  <input
                    type="radio"
                    name="primaryPlatform"
                    value={platform.value}
                    required
                    className="accent-[var(--rust)]"
                  />
                  {platform.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="instagramHandle" optional>
                Instagram handle
              </FieldLabel>
              <input
                id="instagramHandle"
                name="instagramHandle"
                type="text"
                maxLength={120}
                placeholder="@yourname"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="instagramFollowers" optional>
                Instagram follower count
              </FieldLabel>
              <input
                id="instagramFollowers"
                name="instagramFollowers"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 12000"
                className={fieldClassName}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel htmlFor="youtubeChannel" optional>
                YouTube channel name &amp; link
              </FieldLabel>
              <input
                id="youtubeChannel"
                name="youtubeChannel"
                type="text"
                maxLength={500}
                placeholder="Channel name and URL"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="youtubeSubscribers" optional>
                YouTube subscriber count
              </FieldLabel>
              <input
                id="youtubeSubscribers"
                name="youtubeSubscribers"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 5000"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="facebookPage" optional>
                Facebook page link &amp; followers
              </FieldLabel>
              <input
                id="facebookPage"
                name="facebookPage"
                type="text"
                maxLength={500}
                placeholder="Page URL and follower count"
                className={fieldClassName}
              />
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <SectionHeading
            step="03"
            title="Brand Pitch & Creative Value"
          />

          <div>
            <FieldLabel htmlFor="contentUnique">
              What makes your content unique?
            </FieldLabel>
            <textarea
              id="contentUnique"
              name="contentUnique"
              required
              maxLength={5000}
              rows={4}
              placeholder="Describe your style, tone, or connection with your regional audience."
              className={`${fieldClassName} resize-y leading-6`}
            />
            <p className={tipClassName}>
              Tip: Briefly describe your style, tone, or unique connection with
              your regional audience.
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="brandBenefit">
              How can brands benefit from collaborating with your audience?
            </FieldLabel>
            <textarea
              id="brandBenefit"
              name="brandBenefit"
              required
              maxLength={5000}
              rows={4}
              placeholder="Share demographics, local influence, or engagement strengths."
              className={`${fieldClassName} resize-y leading-6`}
            />
            <p className={tipClassName}>
              Tip: Highlight your audience demographic, local influence, or high
              engagement rate.
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="brandIntegrationStyle">
              How do you integrate brand promotions into your regular content
              style?
            </FieldLabel>
            <textarea
              id="brandIntegrationStyle"
              name="brandIntegrationStyle"
              required
              maxLength={5000}
              rows={4}
              placeholder="Explain how sponsorships stay natural and authentic."
              className={`${fieldClassName} resize-y leading-6`}
            />
            <p className={tipClassName}>
              Tip: Explain how you keep sponsorships natural, entertaining, and
              authentic for your viewers.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <SectionHeading step="04" title="Experience & Portfolio" />

          <fieldset>
            <legend className={labelClassName}>
              Have you previously executed sponsored brand promotions or
              commercial content?
            </legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map((option) => (
                <label
                  key={String(option.value)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${
                    hasSponsoredWork === option.value
                      ? "border-[var(--rust)]/40 bg-[var(--rust)]/[0.05]"
                      : "border-black/10 bg-white/50 hover:border-[var(--rust)]/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="hasSponsoredWork"
                    value={String(option.value)}
                    required
                    checked={hasSponsoredWork === option.value}
                    onChange={() => setHasSponsoredWork(option.value)}
                    className="accent-[var(--rust)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {hasSponsoredWork ? (
            <div>
              <FieldLabel htmlFor="samplePromoLinks">
                Sample brand promotion link(s)
              </FieldLabel>
              <textarea
                id="samplePromoLinks"
                name="samplePromoLinks"
                required
                maxLength={5000}
                rows={3}
                placeholder="Paste Google Drive, YouTube, or Instagram reel URLs."
                className={`${fieldClassName} resize-y leading-6`}
              />
              <p className={tipClassName}>
                If Yes: Paste links showing your past brand integration work.
              </p>
            </div>
          ) : (
            <input type="hidden" name="samplePromoLinks" value="" />
          )}

          <div>
            <FieldLabel htmlFor="whyParticipate">
              Why do you want to participate in Roots &amp; Reels Season 2?
            </FieldLabel>
            <textarea
              id="whyParticipate"
              name="whyParticipate"
              required
              maxLength={5000}
              rows={4}
              placeholder="Share what you hope to gain and bring to the event."
              className={`${fieldClassName} resize-y leading-6`}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-black/[0.07] pt-6 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            disabled={formStatus === "submitting"}
            className="site-button site-button-rust disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formStatus === "submitting"
              ? "Submitting…"
              : "Submit application"}
            <span aria-hidden="true">→</span>
          </button>

          {formStatus === "error" && formMessage ? (
            <p role="alert" className="max-w-md text-xs font-semibold text-red-700">
              {formMessage}
            </p>
          ) : (
            <p className="text-[0.68rem] text-[var(--muted)]">
              Applications are reviewed by Jhashree Productions in Madhubani,
              Bihar.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
