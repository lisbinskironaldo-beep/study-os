create table if not exists public.premium_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  user_id text,
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
  user_id text,
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

alter table public.premium_checkout_sessions
  add column if not exists user_id text;

alter table public.premium_entitlements
  add column if not exists user_id text;

create index if not exists premium_checkout_sessions_user_idx
  on public.premium_checkout_sessions (user_id);

create index if not exists premium_entitlements_user_idx
  on public.premium_entitlements (user_id);

create table if not exists public.rotanota_user_accounts (
  user_id text primary key,
  provider text not null default 'google',
  provider_user_id text not null unique,
  email text not null default '',
  full_name text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists rotanota_user_accounts_email_idx
  on public.rotanota_user_accounts (email);

create table if not exists public.rotanota_user_customer_links (
  user_id text not null references public.rotanota_user_accounts (user_id) on delete cascade,
  customer_id text not null unique,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, customer_id)
);

create index if not exists rotanota_user_customer_links_user_idx
  on public.rotanota_user_customer_links (user_id, is_primary desc, created_at asc);

create index if not exists rotanota_user_customer_links_customer_idx
  on public.rotanota_user_customer_links (customer_id);

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

drop trigger if exists rotanota_user_accounts_updated_at
  on public.rotanota_user_accounts;

create trigger rotanota_user_accounts_updated_at
before update on public.rotanota_user_accounts
for each row execute function public.set_updated_at();

drop trigger if exists rotanota_user_customer_links_updated_at
  on public.rotanota_user_customer_links;

create trigger rotanota_user_customer_links_updated_at
before update on public.rotanota_user_customer_links
for each row execute function public.set_updated_at();

create table if not exists public.premium_study_growth_events (
  id uuid primary key default gen_random_uuid(),
  customer_id text,
  event_type text not null,
  material_hash text not null default '',
  channel text not null default 'internal_site',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  referrer text not null default '',
  landing_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists premium_study_growth_events_created_idx
  on public.premium_study_growth_events (created_at desc);

create index if not exists premium_study_growth_events_customer_idx
  on public.premium_study_growth_events (customer_id);

create index if not exists premium_study_growth_events_event_idx
  on public.premium_study_growth_events (event_type);

create table if not exists public.premium_study_channel_spend (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null,
  channel text not null default 'internal_site',
  campaign text not null default '(manual)',
  external_platform text not null default '',
  external_account_id text not null default '',
  amount numeric(12,2) not null default 0,
  currency text not null default 'BRL',
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_study_channel_spend_period_idx
  on public.premium_study_channel_spend (period_start desc, period_end desc);

create index if not exists premium_study_channel_spend_channel_idx
  on public.premium_study_channel_spend (channel, campaign);

drop trigger if exists premium_study_channel_spend_updated_at
  on public.premium_study_channel_spend;

create trigger premium_study_channel_spend_updated_at
before update on public.premium_study_channel_spend
for each row execute function public.set_updated_at();

create table if not exists public.premium_study_ops_alerts (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  severity text not null default 'info',
  provider text not null default '',
  message text not null default '',
  payload jsonb not null default '{}'::jsonb,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_study_ops_alerts_created_idx
  on public.premium_study_ops_alerts (created_at desc);

create index if not exists premium_study_ops_alerts_event_idx
  on public.premium_study_ops_alerts (event_type, severity);

drop trigger if exists premium_study_ops_alerts_updated_at
  on public.premium_study_ops_alerts;

create trigger premium_study_ops_alerts_updated_at
before update on public.premium_study_ops_alerts
for each row execute function public.set_updated_at();

create table if not exists public.premium_study_ops_state (
  state_key text primary key,
  state_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists premium_study_ops_state_updated_at
  on public.premium_study_ops_state;

create trigger premium_study_ops_state_updated_at
before update on public.premium_study_ops_state
for each row execute function public.set_updated_at();

create table if not exists public.premium_study_promotion_campaigns (
  id uuid primary key default gen_random_uuid(),
  surface text not null default 'premium_checkout',
  feature text not null default '',
  channel text not null default 'internal_site',
  status text not null default 'draft',
  mode text not null default 'suggest',
  headline text not null default '',
  lead text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  cta text not null default '',
  recommended_plan_id text not null default '',
  targeting jsonb not null default '{}'::jsonb,
  external_platform text not null default '',
  campaign_id text not null default '',
  adset_id text not null default '',
  ad_id text not null default '',
  creative_id text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_study_promotion_campaigns_status_idx
  on public.premium_study_promotion_campaigns (status, surface, channel);

create index if not exists premium_study_promotion_campaigns_feature_idx
  on public.premium_study_promotion_campaigns (feature, updated_at desc);

drop trigger if exists premium_study_promotion_campaigns_updated_at
  on public.premium_study_promotion_campaigns;

create trigger premium_study_promotion_campaigns_updated_at
before update on public.premium_study_promotion_campaigns
for each row execute function public.set_updated_at();

create table if not exists public.premium_study_promotion_actions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.premium_study_promotion_campaigns (id) on delete cascade,
  action_type text not null,
  status text not null default 'completed',
  mode text not null default 'suggest',
  reason text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists premium_study_promotion_actions_campaign_idx
  on public.premium_study_promotion_actions (campaign_id, created_at desc);

create table if not exists public.premium_study_promotion_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel text not null default 'internal_site',
  surface text not null default 'premium_checkout',
  feature text not null default '',
  status text not null default 'draft',
  approved boolean not null default false,
  priority integer not null default 100,
  rule_type text not null default 'conversion_guardrail',
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '{}'::jsonb,
  notes text not null default '',
  external_platform text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_study_promotion_rules_status_idx
  on public.premium_study_promotion_rules (status, approved, priority);

drop trigger if exists premium_study_promotion_rules_updated_at
  on public.premium_study_promotion_rules;

create trigger premium_study_promotion_rules_updated_at
before update on public.premium_study_promotion_rules
for each row execute function public.set_updated_at();

create table if not exists public.northstar_app_work_items (
  id uuid primary key default gen_random_uuid(),
  app_key text not null,
  item_type text not null default 'improvement',
  title text not null default '',
  summary text not null default '',
  status text not null default 'open',
  priority integer not null default 100,
  owner text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists northstar_app_work_items_app_idx
  on public.northstar_app_work_items (app_key, status, priority);

drop trigger if exists northstar_app_work_items_updated_at
  on public.northstar_app_work_items;

create trigger northstar_app_work_items_updated_at
before update on public.northstar_app_work_items
for each row execute function public.set_updated_at();

create table if not exists public.northstar_app_bug_reports (
  id uuid primary key default gen_random_uuid(),
  app_key text not null,
  title text not null default '',
  description text not null default '',
  severity text not null default 'medium',
  status text not null default 'open',
  source_channel text not null default 'ops_console',
  reporter_email text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists northstar_app_bug_reports_app_idx
  on public.northstar_app_bug_reports (app_key, status, severity);

drop trigger if exists northstar_app_bug_reports_updated_at
  on public.northstar_app_bug_reports;

create trigger northstar_app_bug_reports_updated_at
before update on public.northstar_app_bug_reports
for each row execute function public.set_updated_at();

create table if not exists public.northstar_app_finance_snapshots (
  id uuid primary key default gen_random_uuid(),
  app_key text not null,
  period_start date not null,
  period_end date not null,
  revenue_amount numeric(12,2) not null default 0,
  expense_amount numeric(12,2) not null default 0,
  currency text not null default 'BRL',
  source_channel text not null default 'manual',
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists northstar_app_finance_snapshots_app_idx
  on public.northstar_app_finance_snapshots (app_key, period_start desc, period_end desc);

drop trigger if exists northstar_app_finance_snapshots_updated_at
  on public.northstar_app_finance_snapshots;

create trigger northstar_app_finance_snapshots_updated_at
before update on public.northstar_app_finance_snapshots
for each row execute function public.set_updated_at();

create table if not exists public.northstar_change_requests (
  id uuid primary key default gen_random_uuid(),
  review_run_id uuid,
  target_system text not null,
  action_type text not null,
  payload jsonb not null default '{}'::jsonb,
  prepared_by text not null default 'northstar',
  status text not null default 'pending',
  approval_notes text not null default '',
  approved_by text not null default '',
  rejected_by text not null default '',
  executed_at timestamptz,
  result_summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists northstar_change_requests_status_idx
  on public.northstar_change_requests (status, target_system, created_at desc);

drop trigger if exists northstar_change_requests_updated_at
  on public.northstar_change_requests;

create trigger northstar_change_requests_updated_at
before update on public.northstar_change_requests
for each row execute function public.set_updated_at();

create table if not exists public.northstar_review_runs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null default 'three_day_growth_review',
  provider text not null default 'fallback',
  status text not null default 'completed',
  summary text not null default '',
  recommendations jsonb not null default '{}'::jsonb,
  confidence text not null default '',
  missing_data jsonb not null default '[]'::jsonb,
  generated_change_requests integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists northstar_review_runs_type_idx
  on public.northstar_review_runs (run_type, created_at desc);

drop trigger if exists northstar_review_runs_updated_at
  on public.northstar_review_runs;

create trigger northstar_review_runs_updated_at
before update on public.northstar_review_runs
for each row execute function public.set_updated_at();

create table if not exists public.northstar_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor text not null default 'northstar',
  target_system text not null default '',
  entity_type text not null default '',
  entity_id text not null default '',
  status text not null default 'info',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists northstar_audit_log_created_idx
  on public.northstar_audit_log (created_at desc);

create index if not exists northstar_audit_log_target_idx
  on public.northstar_audit_log (target_system, event_type, created_at desc);
