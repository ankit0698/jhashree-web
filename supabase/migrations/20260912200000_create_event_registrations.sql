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
    (status = 'paid' and registration_code is not null and paid_at is not null)
    or (status <> 'paid')
  )
);

create unique index event_registrations_registration_code_uidx
  on public.event_registrations (registration_code)
  where registration_code is not null;

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
