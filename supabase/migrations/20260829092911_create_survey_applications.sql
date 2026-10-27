-- Roots & Reels Season 2 – content creator applications
-- Public form can INSERT; reads/updates go through service role (API / admin).

create table public.survey_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Section 1: Creator profile & contact
  full_name text not null,
  contact_number text not null,
  email text not null,
  primary_niche text not null
    check (
      primary_niche in (
        'travel_culture',
        'comedy_entertainment',
        'fashion_beauty',
        'food_lifestyle',
        'education_tech',
        'other'
      )
    ),
  primary_niche_other text,

  -- Section 2: Social media reach
  primary_platform text not null
    check (
      primary_platform in (
        'instagram',
        'youtube',
        'facebook',
        'other'
      )
    ),
  instagram_handle text,
  instagram_followers integer check (instagram_followers is null or instagram_followers >= 0),
  youtube_channel text,
  youtube_subscribers integer check (youtube_subscribers is null or youtube_subscribers >= 0),
  facebook_page text,

  -- Section 3: Brand pitch
  content_unique text not null,
  brand_benefit text not null,
  brand_integration_style text not null,

  -- Section 4: Experience & portfolio
  has_sponsored_work boolean not null,
  sample_promo_links text,
  why_participate text not null,

  -- Ops
  status text not null default 'submitted'
    check (
      status in (
        'submitted',
        'reviewed',
        'accepted',
        'rejected'
      )
    ),
  source text not null default 'web',

  constraint survey_applications_niche_other_chk check (
    (primary_niche = 'other' and primary_niche_other is not null and length(trim(primary_niche_other)) > 0)
    or (primary_niche <> 'other' and primary_niche_other is null)
  ),
  constraint survey_applications_email_format_chk check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);

create index survey_applications_created_at_idx
  on public.survey_applications (created_at desc);

create index survey_applications_email_idx
  on public.survey_applications (email);

create index survey_applications_status_idx
  on public.survey_applications (status);

create or replace function public.set_survey_applications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger survey_applications_set_updated_at
  before update on public.survey_applications
  for each row
  execute function public.set_survey_applications_updated_at();

alter table public.survey_applications enable row level security;

-- Anyone (anon / authenticated) may submit an application.
-- They cannot read, update, or delete rows via the Data API.
create policy "Anyone can submit survey applications"
  on public.survey_applications
  for insert
  to anon, authenticated
  with check (true);

comment on table public.survey_applications is
  'Roots & Reels Season 2 content creator application form submissions.';
