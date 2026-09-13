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
