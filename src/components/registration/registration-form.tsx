import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  AGE_GROUPS,
  ATTENDEE_TYPES,
  COMING_WITH_OPTIONS,
  HEARD_FROM_OPTIONS,
  INTEREST_OPTIONS,
  type AgeGroup,
  type AttendeeType,
  type ComingWith,
  type HeardFrom,
  type Interest,
  type RegistrationConfirmation,
  type RegistrationInput,
} from "@/types/registration";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Offer = {
  amount: number;
  currency: string;
  passesCount: number;
  promo: string;
  bogoAvailable: boolean;
  bogoRemaining: number;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const fieldClassName =
  "site-input";
const labelClassName =
  "text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--rust)]";

const emptyForm: RegistrationInput = {
  fullName: "",
  contactNumber: "",
  email: "",
  ageGroup: "18_24",
  city: "",
  district: "",
  state: "",
  attendeeType: "general_audience",
  attendeeTypeOther: null,
  comingWith: "solo",
  interests: [],
  heardFrom: "instagram",
  heardFromOther: null,
};

function loadRazorpayScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
    document.body.appendChild(script);
  });
}

function StepHeading({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-[var(--border)] pb-4">
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
        Step {step}
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

export default function RegistrationForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<RegistrationInput>(emptyForm);
  const [attendeeOther, setAttendeeOther] = useState("");
  const [heardOther, setHeardOther] = useState("");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] =
    useState<RegistrationConfirmation | null>(null);

  useEffect(() => {
    void fetch("/api/registrations/offer")
      .then(async (response) => {
        const result = (await response.json()) as Offer & { error?: string };
        if (!response.ok) throw new Error(result.error || "Offer unavailable.");
        setOffer(result);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Offer unavailable.");
      });
  }, []);

  const priceLabel = useMemo(() => {
    const amount = (offer?.amount ?? 29900) / 100;
    return `₹${amount.toFixed(0)}/-`;
  }, [offer]);

  function updateField<K extends keyof RegistrationInput>(
    key: K,
    value: RegistrationInput[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function toggleInterest(value: Interest) {
    setForm((previous) => {
      const exists = previous.interests.includes(value);
      return {
        ...previous,
        interests: exists
          ? previous.interests.filter((item) => item !== value)
          : [...previous.interests, value],
      };
    });
  }

  function goNext() {
    setError("");
    if (step === 1) {
      if (!form.fullName.trim() || !form.contactNumber.trim() || !form.email.trim()) {
        setError("Please fill name, WhatsApp number, and email.");
        return;
      }
    }
    if (step === 2) {
      if (!form.city.trim() || !form.district.trim() || !form.state.trim()) {
        setError("Please fill city, district, and state.");
        return;
      }
    }
    if (step === 3 && form.attendeeType === "other" && !attendeeOther.trim()) {
      setError("Please specify what best describes you.");
      return;
    }
    if (step === 4 && form.interests.length === 0) {
      setError("Select at least one interest.");
      return;
    }
    if (step === 5 && form.heardFrom === "other" && !heardOther.trim()) {
      setError("Please specify how you heard about Roots & Reels.");
      return;
    }
    setStep((previous) => Math.min(8, previous + 1) as Step);
  }

  function goBack() {
    setError("");
    setStep((previous) => Math.max(1, previous - 1) as Step);
  }

  async function handlePay(event: FormEvent) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const payload: RegistrationInput = {
        ...form,
        attendeeTypeOther:
          form.attendeeType === "other" ? attendeeOther.trim() : null,
        heardFromOther: form.heardFrom === "other" ? heardOther.trim() : null,
      };

      const orderResponse = await fetch("/api/registrations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const orderResult = (await orderResponse.json()) as {
        registrationId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        passesCount?: number;
        promo?: string;
        bogoAvailable?: boolean;
        bogoRemaining?: number;
        error?: string;
      };

      if (!orderResponse.ok || !orderResult.orderId || !orderResult.registrationId) {
        throw new Error(orderResult.error || "Could not start payment.");
      }

      if (orderResult.amount && orderResult.passesCount) {
        setOffer({
          amount: orderResult.amount,
          currency: orderResult.currency || "INR",
          passesCount: orderResult.passesCount,
          promo: orderResult.promo || "none",
          bogoAvailable: Boolean(orderResult.bogoAvailable),
          bogoRemaining: orderResult.bogoRemaining ?? 0,
        });
      }

      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable.");
      }

      const registrationId = orderResult.registrationId;

      await new Promise<void>((resolve, reject) => {
        const checkout = new window.Razorpay!({
          key: orderResult.keyId!,
          amount: orderResult.amount!,
          currency: orderResult.currency || "INR",
          name: "Jhashree Productions",
          description: "Roots & Reels Season 2 Pass",
          order_id: orderResult.orderId!,
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.contactNumber,
          },
          handler: (payment) => {
            void (async () => {
              try {
                const verifyResponse = await fetch("/api/registrations/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    registrationId,
                    razorpayOrderId: payment.razorpay_order_id,
                    razorpayPaymentId: payment.razorpay_payment_id,
                    razorpaySignature: payment.razorpay_signature,
                  }),
                });
                const verifyResult = (await verifyResponse.json()) as {
                  confirmation?: RegistrationConfirmation;
                  error?: string;
                };
                if (!verifyResponse.ok || !verifyResult.confirmation) {
                  throw new Error(
                    verifyResult.error || "Payment verification failed.",
                  );
                }
                setConfirmation(verifyResult.confirmation);
                setStep(8);
                resolve();
              } catch (verifyError) {
                reject(verifyError);
              }
            })();
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled. You can try again."));
            },
          },
        });
        checkout.open();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  if (step === 8 && confirmation) {
    const ticketPageHref = `/rootsnreels/ticket/${confirmation.ticketToken}`;
    return (
      <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--rust)]">
          Registration confirmed
        </p>
        <h2 className="mt-3 font-serif text-[2.2rem] leading-tight text-[var(--ink)]">
          You&apos;re in!
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Welcome to Roots &amp; Reels — Season 2
        </p>

        <dl className="mt-6 space-y-3 text-sm text-[var(--ink)]">
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <dt className="text-[var(--muted)]">
              {confirmation.registrationCodeGuest
                ? "Ticket 1"
                : "Registration ID"}
            </dt>
            <dd className="font-semibold">{confirmation.registrationCode}</dd>
          </div>
          {confirmation.registrationCodeGuest ? (
            <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--muted)]">Ticket 2</dt>
              <dd className="font-semibold">
                {confirmation.registrationCodeGuest}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <dt className="text-[var(--muted)]">Date</dt>
            <dd>4 October 2026</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <dt className="text-[var(--muted)]">Time</dt>
            <dd>10:00 AM onwards</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <dt className="text-[var(--muted)]">Venue</dt>
            <dd>Mithila Vatika</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--border)] pb-2">
            <dt className="text-[var(--muted)]">Passes</dt>
            <dd className="font-semibold">
              {confirmation.passesCount}{" "}
              {confirmation.passesCount === 1 ? "person" : "people"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Paid</dt>
            <dd className="font-semibold">
              ₹{(confirmation.amountPaise / 100).toFixed(0)}
            </dd>
          </div>
        </dl>

        <div className="mt-7">
          <a
            href={ticketPageHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[var(--rust)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {confirmation.registrationCodeGuest
              ? "View my tickets"
              : "View my ticket"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={step === 7 ? handlePay : (event) => event.preventDefault()}
      className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] md:p-8"
    >
      {step === 1 ? (
        <div className="space-y-5">
          <StepHeading step="01" title="Your details" />
          <div>
            <label htmlFor="fullName" className={labelClassName}>
              Full name *
            </label>
            <input
              id="fullName"
              className={fieldClassName}
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className={labelClassName}>
              WhatsApp / contact number *
            </label>
            <input
              id="contactNumber"
              className={fieldClassName}
              value={form.contactNumber}
              onChange={(event) =>
                updateField("contactNumber", event.target.value)
              }
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClassName}>
              Email address *
            </label>
            <input
              id="email"
              type="email"
              className={fieldClassName}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="ageGroup" className={labelClassName}>
              Age group *
            </label>
            <select
              id="ageGroup"
              className={fieldClassName}
              value={form.ageGroup}
              onChange={(event) =>
                updateField("ageGroup", event.target.value as AgeGroup)
              }
            >
              {AGE_GROUPS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <StepHeading step="02" title="Your location" />
          <div>
            <label htmlFor="city" className={labelClassName}>
              City / town *
            </label>
            <input
              id="city"
              className={fieldClassName}
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="district" className={labelClassName}>
              District *
            </label>
            <input
              id="district"
              className={fieldClassName}
              value={form.district}
              onChange={(event) => updateField("district", event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className={labelClassName}>
              State *
            </label>
            <input
              id="state"
              className={fieldClassName}
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
              required
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <StepHeading step="03" title="Tell us about you" />
          <div>
            <label htmlFor="attendeeType" className={labelClassName}>
              What best describes you? *
            </label>
            <select
              id="attendeeType"
              className={fieldClassName}
              value={form.attendeeType}
              onChange={(event) =>
                updateField("attendeeType", event.target.value as AttendeeType)
              }
            >
              {ATTENDEE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {form.attendeeType === "other" ? (
            <div>
              <label htmlFor="attendeeOther" className={labelClassName}>
                Please specify *
              </label>
              <input
                id="attendeeOther"
                className={fieldClassName}
                value={attendeeOther}
                onChange={(event) => setAttendeeOther(event.target.value)}
              />
            </div>
          ) : null}
          <div>
            <label htmlFor="comingWith" className={labelClassName}>
              Who are you coming with? *
            </label>
            <select
              id="comingWith"
              className={fieldClassName}
              value={form.comingWith}
              onChange={(event) =>
                updateField("comingWith", event.target.value as ComingWith)
              }
            >
              {COMING_WITH_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-5">
          <StepHeading
            step="04"
            title="What are you excited about?"
            description="Select all that interest you."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {INTEREST_OPTIONS.map((item) => {
              const checked = form.interests.includes(item.value);
              return (
                <label
                  key={item.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                    checked
                      ? "border-[var(--rust)] bg-[var(--rust)]/5"
                      : "border-[var(--border)] bg-[var(--surface-soft)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleInterest(item.value)}
                    className="accent-[var(--rust)]"
                  />
                  {item.label}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-5">
          <StepHeading step="05" title="How did you hear about Roots & Reels?" />
          <div>
            <label htmlFor="heardFrom" className={labelClassName}>
              Source *
            </label>
            <select
              id="heardFrom"
              className={fieldClassName}
              value={form.heardFrom}
              onChange={(event) =>
                updateField("heardFrom", event.target.value as HeardFrom)
              }
            >
              {HEARD_FROM_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {form.heardFrom === "other" ? (
            <div>
              <label htmlFor="heardOther" className={labelClassName}>
                Please specify *
              </label>
              <input
                id="heardOther"
                className={fieldClassName}
                value={heardOther}
                onChange={(event) => setHeardOther(event.target.value)}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 6 ? (
        <div className="space-y-5">
          <StepHeading step="06" title="Your Roots & Reels pass" />
          <p className="font-serif text-[1.55rem] leading-snug text-[var(--ink)] md:text-[1.8rem]">
            One pass. Two people. One day full of creators, brands, music,
            content &amp; fun.
          </p>
          <p className="text-sm font-semibold tracking-wide text-[var(--rust)]">
            {priceLabel} ·{" "}
            {offer?.bogoAvailable
              ? `BUY 1 GET 1 FREE · FIRST 50 ONLY (${offer.bogoRemaining} left)`
              : "SINGLE PASS"}
          </p>
          <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
            <li>✓ Event entry, breakfast &amp; beverages</li>
            <li>✓ Creators × brands meetup &amp; networking</li>
            <li>✓ Live performances, challenges &amp; talent discovery</li>
            <li>✓ Food &amp; fun zone · event photo &amp; video coverage</li>
          </ul>
          <p className="text-sm text-[var(--ink)]">
            4 October 2026 · 10:00 AM onwards · Mithila Vatika
          </p>
        </div>
      ) : null}

      {step === 7 ? (
        <div className="space-y-6">
          <StepHeading step="07" title="Secure your slot" />
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-6 text-center">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--rust)]">
              Roots &amp; Reels Season 2 Pass
            </p>
            <p className="mt-3 font-serif text-4xl text-[var(--ink)]">
              {priceLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--rust)]">
              {offer?.bogoAvailable
                ? "BUY 1 GET 1 FREE — first 50 confirmed"
                : "Single pass"}
            </p>
            {offer?.bogoAvailable ? (
              <p className="mt-1 text-xs text-[var(--muted)]">
                {offer.bogoRemaining} BOGO slots remaining
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[var(--rust)] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? "Opening payment…" : `Pay ${priceLabel} & confirm my slot →`}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {step < 7 ? (
        <div className="mt-7 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-full bg-[var(--rust)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continue
          </button>
        </div>
      ) : null}

      {step === 7 ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={goBack}
            className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← Back
          </button>
        </div>
      ) : null}
    </form>
  );
}
