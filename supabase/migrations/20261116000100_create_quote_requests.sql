begin;

create table public.quote_requests (
  id uuid primary key,
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 150),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (phone ~ '^[0-9]{10}$'),
  service_type text not null check (service_type in ('auto', 'home')),
  selected_plan text check (selected_plan in ('platinum', 'gold', 'powertrain', 'pre-paid-maintenance')),
  vehicle jsonb,
  property jsonb,
  message text check (char_length(message) <= 1000),
  consent_to_contact boolean not null check (consent_to_contact = true),
  source_path text not null check (char_length(source_path) between 1 and 200),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_id text,
  email_sent_at timestamptz,
  check (
    (service_type = 'auto' and vehicle is not null and jsonb_typeof(vehicle) = 'object' and property is null)
    or (service_type = 'home' and property is not null and jsonb_typeof(property) = 'object' and vehicle is null and selected_plan is null)
  )
);

alter table public.quote_requests enable row level security;

-- No public policies and no public privileges: only server service-role writes.
revoke all on table public.quote_requests from public, anon, authenticated;
grant select, insert, update on table public.quote_requests to service_role;

comment on column public.quote_requests.email_status is
  'sent means Resend accepted the message, not confirmed inbox delivery. No automatic retries.';

commit;
