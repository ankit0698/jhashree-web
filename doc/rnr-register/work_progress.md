# Roots & Reels register — work progress

## Done

- [x] Product locked: `/rootsnreels` paid registration (separate from `/survey` creator form)
- [x] Pass: ₹299 · BUY 1 GET 1 FREE for first **50 paid** · then hide BOGO, single pass @ ₹299
- [x] Serial format: `RR2-001`, `RR2-002`, …
- [x] Ticket print logic proven (server `@napi-rs/canvas`)
  - Helper: `src/lib/tickets/render-pass.ts`
  - Template: `public/assets/root-and-reels-ticket.jpeg`
  - Font: `assets/fonts/LiberationSans-Bold.ttf`
  - Plan: `doc/rnr-register/ticket-print-plan.md`
- [x] Admin test-ticket UI/API removed after validation
- [x] Razorpay test keys prepared in `.env.local`
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - Webhook secret skipped for now
- [x] DB table designed + applied: `event_registrations`
- [x] App code implemented (see `doc/rnr-register/app-code-plan.md`)
  - Types / validation / server: `src/types/registration.ts`, `src/lib/registration/*`
  - Razorpay: `src/lib/razorpay/*`
  - APIs: create-order, verify, offer, ticket/[token]
  - UI: `/rootsnreels` multi-step form + Checkout + confirm/download
- [x] Decision: BOGO = two tickets / two serials
  - `registration_code` (person 1) + `registration_code_guest` (person 2, BOGO only)
  - Ticket view page shows both with separate download buttons

## Next

- [x] Run ALTER SQL below in Supabase (`registration_code_guest`)
- [x] App: assign two serials on BOGO pay + dual ticket view/download UI
- [x] Admin: Surveys and registrations hub + sold registrations list
- [ ] Manual test with Razorpay test payment on `/rootsnreels` (BOGO → two tickets)
- [ ] Optional: admin registrations list
- [ ] Optional: webhook + email/WhatsApp ticket
- [ ] Switch to live Razorpay keys on production only

---

## SQL — ALTER (run this on existing table)

```sql
-- Dual tickets for BOGO: primary + guest serial on the same registration row.

alter table public.event_registrations
  add column if not exists registration_code_guest text;

comment on column public.event_registrations.registration_code_guest is
  'Second pass serial for BOGO (passes_count = 2). Null for single-pass paid rows.';

-- Paid rows: 1 pass → only primary code; 2 passes → primary + guest required.
alter table public.event_registrations
  drop constraint if exists event_registrations_paid_code_chk;

alter table public.event_registrations
  add constraint event_registrations_paid_code_chk check (
    (status <> 'paid')
    or (
      status = 'paid'
      and registration_code is not null
      and paid_at is not null
      and (
        (passes_count = 1 and registration_code_guest is null)
        or (passes_count = 2 and registration_code_guest is not null
            and registration_code_guest is distinct from registration_code)
      )
    )
  );

create unique index if not exists event_registrations_registration_code_guest_uidx
  on public.event_registrations (registration_code_guest)
  where registration_code_guest is not null;
```

---

## SQL — `event_registrations` (full create, includes guest column)

```sql
-- Roots & Reels Season 2 – paid event registrations
-- Writes/reads go through service role (API / admin). Public should not update paid fields.

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 01 — Your details
  full_name text not null,
  contact_number text not null,
  email text not null,
  age_group text not null
    check (
      age_group in (
        'under_18',
        '18_24',
        '25_34',
        '35_44',
        '45_plus'
      )
    ),

  -- 02 — Location
  city text not null,
  district text not null,
  state text not null,

  -- 03 — About you
  attendee_type text not null
    check (
      attendee_type in (
        'creator',
        'photographer',
        'artist',
        'student',
        'entrepreneur',
        'brand_rep',
        'freelancer',
        'marketing',
        'general_audience',
        'other'
      )
    ),
  attendee_type_other text,
  coming_with text not null
    check (
      coming_with in (
        'solo',
        'friends',
        'partner',
        'family',
        'creator_group',
        'brand_team'
      )
    ),

  -- 04 / 05 — Interests & source
  interests text[] not null default '{}',
  heard_from text not null
    check (
      heard_from in (
        'instagram',
        'facebook',
        'whatsapp',
        'youtube',
        'friend_family',
        'creator',
        'brand',
        'poster',
        'college',
        'other'
      )
    ),
  heard_from_other text,

  -- Pass / payment
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  passes_count integer not null check (passes_count in (1, 2)),
  promo text not null default 'none'
    check (promo in ('bogo_first_50', 'none')),
  bogo_slot integer check (bogo_slot is null or (bogo_slot >= 1 and bogo_slot <= 50)),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),

  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  paid_at timestamptz,

  -- Ticket (code only after paid)
  registration_code text,
  registration_code_guest text,
  ticket_token text not null default encode(gen_random_bytes(16), 'hex'),

  source text not null default 'web',

  constraint event_registrations_attendee_other_chk check (
    (attendee_type = 'other' and attendee_type_other is not null and length(trim(attendee_type_other)) > 0)
    or (attendee_type <> 'other' and attendee_type_other is null)
  ),
  constraint event_registrations_heard_other_chk check (
    (heard_from = 'other' and heard_from_other is not null and length(trim(heard_from_other)) > 0)
    or (heard_from <> 'other' and heard_from_other is null)
  ),
  constraint event_registrations_email_format_chk check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  constraint event_registrations_bogo_chk check (
    (promo = 'bogo_first_50' and passes_count = 2 and bogo_slot is not null)
    or (promo = 'none' and passes_count = 1 and bogo_slot is null)
    or (status = 'pending' and bogo_slot is null)
  ),
  constraint event_registrations_paid_code_chk check (
    (status <> 'paid')
    or (
      status = 'paid'
      and registration_code is not null
      and paid_at is not null
      and (
        (passes_count = 1 and registration_code_guest is null)
        or (passes_count = 2 and registration_code_guest is not null
            and registration_code_guest is distinct from registration_code)
      )
    )
  )
);

create unique index event_registrations_registration_code_uidx
  on public.event_registrations (registration_code)
  where registration_code is not null;

create unique index event_registrations_registration_code_guest_uidx
  on public.event_registrations (registration_code_guest)
  where registration_code_guest is not null;

create unique index event_registrations_ticket_token_uidx
  on public.event_registrations (ticket_token);

create unique index event_registrations_razorpay_order_uidx
  on public.event_registrations (razorpay_order_id)
  where razorpay_order_id is not null;

create unique index event_registrations_razorpay_payment_uidx
  on public.event_registrations (razorpay_payment_id)
  where razorpay_payment_id is not null;

create unique index event_registrations_bogo_slot_uidx
  on public.event_registrations (bogo_slot)
  where bogo_slot is not null;

create index event_registrations_created_at_idx
  on public.event_registrations (created_at desc);

create index event_registrations_email_idx
  on public.event_registrations (email);

create index event_registrations_status_idx
  on public.event_registrations (status);

create or replace function public.set_event_registrations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger event_registrations_set_updated_at
  before update on public.event_registrations
  for each row
  execute function public.set_event_registrations_updated_at();

alter table public.event_registrations enable row level security;

-- No public policies: insert/update/select via service role API only.

comment on table public.event_registrations is
  'Roots & Reels Season 2 paid event registrations and ticket codes.';
```
