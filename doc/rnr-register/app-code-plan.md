# Roots & Reels — App code implementation plan

Build `/rootsnreels` paid registration + Razorpay + ticket download.  
Do **not** change `/survey` or survey admin unless asked.

References:

- Progress: `doc/rnr-register/work_progress.md`
- Ticket print: `doc/rnr-register/ticket-print-plan.md`
- Helper already exists: `src/lib/tickets/render-pass.ts`

---

## Product rules (locked)


| Item     | Value                                                            |
| -------- | ---------------------------------------------------------------- |
| Route    | `/rootsnreels`                                                   |
| Price    | ₹299 (`29900` paise)                                             |
| BOGO     | First **50 paid** → `passes_count = 2`, `promo = bogo_first_50`  |
| After 50 | Hide BOGO → single pass ₹299, `passes_count = 1`, `promo = none` |
| Serial   | `RR2-001` … assigned only when `status = paid`                   |
| Ticket   | Server composite via `renderRootsReelsTicket(code)`              |
| Webhook  | Skip v1 (add later)                                              |


---

## Phase 0 — Preconditions

- [x] Table SQL written (`event_registrations`)
- [x] Migration applied in Supabase
- [x] Test Razorpay keys in `.env.local`
- [x] Ticket render helper + assets

---

## Phase 1 — Types, validation, server lib

Mirror survey patterns (`src/types/survey.ts`, `src/lib/survey/`*).

Create:

- `src/types/registration.ts` — enums, input/row types, table name constant
- `src/lib/registration/validation.ts` — form field validation
- `src/lib/registration/server.ts` — create pending, count paid BOGO, mark paid, assign `RR2-XXX` + `bogo_slot`, fetch by `ticket_token`
- `src/lib/razorpay/client.ts` — Razorpay SDK init from env (`KEY_ID` / `KEY_SECRET`)
- `src/lib/razorpay/env.ts` — require env helpers

Install: `razorpay` (server). Checkout script loaded on client only.

---

## Phase 2 — Payment APIs


| Route                                   | Role                                                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/registrations/create-order`  | Validate form → insert `pending` → create Razorpay order (amount **server-side** 29900) → return `{ registrationId, orderId, amount, currency, keyId, passesCount, promo }` |
| `POST /api/registrations/verify`        | Verify signature → if paid BOGO count `< 50` assign BOGO else single → set `registration_code`, `paid_at`, status `paid` → return confirmation payload + `ticketToken`      |
| `GET /api/registrations/ticket/[token]` | Load paid row by `ticket_token` → `renderRootsReelsTicket(registration_code)` → JPEG download                                                                               |


Rules:

- Never trust client amount or “paid” flag.
- Assign serial + BOGO slot only inside verify (transaction-safe / unique indexes).
- Idempotent verify: same payment twice returns same success.

---

## Phase 3 — `/rootsnreels` UI

Page: `src/pages/rootsnreels/index.tsx` (+ components under `src/components/registration/`).

Multi-step form (keep payment step clean):

1. Details — name, WhatsApp, email, age group
2. Location — city, district, state
3. About you — attendee type, coming with
4. Interests — multi-select
5. Source — heard from (no referral name)
6. Pass summary — hero line + light inclusions (not “access” dump)
7. Pay — price + BOGO/single line + one CTA → Razorpay Checkout
8. Confirmed — `YOU'RE IN!`, `RR2-XXX`, event facts, passes, **View / Download ticket**

Visual: match survey/site (paper, rust, serif) but shorter than creator form.

Checkout:

- Load Razorpay.js
- Open with `order_id` from create-order
- On success → call verify → show step 8

---

## Phase 4 — Ticket delivery (v1)

- On confirm: **View my tickets** → `/rootsnreels/ticket/[token]`
- BOGO: shows Ticket 1 + Ticket 2, each with its own Download
- Single pass: one ticket only
- Image API: `GET /api/registrations/ticket/[token]?which=primary|guest`
- Email / WhatsApp: **later** (not blocking)

---

## Phase 5 — Admin (optional, after public flow works)

- `/admin/registrations` list paid attendees (like survey panel)
- Export CSV later if needed

---

## Phase 6 — Harden

- Test full path with `rzp_test_` keys
- Failed/cancelled payment UX
- Sold-out BOGO messaging (single pass still available)
- Then live keys on production only
- Add webhook when public URL exists

---

## File checklist (expected)

