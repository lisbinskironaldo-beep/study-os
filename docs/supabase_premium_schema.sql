create table if not exists public.premium_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  plan_id text not null,
  preference_id text,
  external_reference text,
  status text not null default 'created',
  provider text not null default 'mercado_pago',
  payment_id text,
  metadata jsonb not null default '{}'::jsonb,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_checkout_sessions_customer_idx
  on public.premium_checkout_sessions (customer_id);

create index if not exists premium_checkout_sessions_preference_idx
  on public.premium_checkout_sessions (preference_id);

create table if not exists public.premium_entitlements (
  customer_id text primary key,
  access_tier text not null default 'premium',
  status text not null default 'active',
  plan_id text not null,
  provider text not null default 'mercado_pago',
  payment_id text,
  preference_id text,
  payer_email text,
  valid_until timestamptz,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_entitlements_status_idx
  on public.premium_entitlements (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists premium_checkout_sessions_updated_at
  on public.premium_checkout_sessions;

create trigger premium_checkout_sessions_updated_at
before update on public.premium_checkout_sessions
for each row execute function public.set_updated_at();

drop trigger if exists premium_entitlements_updated_at
  on public.premium_entitlements;

create trigger premium_entitlements_updated_at
before update on public.premium_entitlements
for each row execute function public.set_updated_at();
