-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Existing Tables (Phase 1-9) --
-- ... (Existing tables user_profiles to industry_asset_overrides) ...

create table if not exists user_profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  business_type text,
  business_info jsonb,
  color_palette text,
  created_at timestamptz default now()
);

create type subscription_tier as enum ('free', 'member', 'pro');

create table if not exists subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  tier subscription_tier default 'free',
  started_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true
);

create table if not exists prompt_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  name text not null,
  icon_name text default 'Folder',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists saved_prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  asset_id int not null,
  prompt_name text not null,
  fill_values jsonb,
  built_prompt text,
  is_favorite boolean default false,
  tags text[],
  folder_id uuid references prompt_folders(id),
  version int default 1,
  previous_version_id uuid references saved_prompts(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists asset_favorites (
  user_id uuid references user_profiles(id) not null,
  asset_id int not null,
  created_at timestamptz default now(),
  primary key (user_id, asset_id)
);

create table if not exists ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  asset_id int,
  fine_tune_id uuid,
  score int check (score between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists fine_tune_prompts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text default 'general',
  tier_required subscription_tier default 'member',
  version text default '1.0',
  base_prompt text not null,
  system_instruction text,
  controls jsonb not null default '[]',
  example_outputs jsonb default '[]',
  output_count int default 1,
  quality_scoring_enabled boolean default false,
  quality_criteria jsonb default '[]',
  ai_model text default 'claude-sonnet',
  icon_name text default 'Sliders',
  tag_color text default '#8B5CF6',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists user_fine_tunes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  title text not null,
  base_prompt text not null,
  controls jsonb default '[]',
  is_public boolean default false,
  submit_status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fine_tune_usage (
  id uuid default uuid_generate_v4() primary key,
  fine_tune_id uuid references fine_tune_prompts(id),
  user_fine_tune_id uuid references user_fine_tunes(id),
  user_id uuid references auth.users,
  control_values jsonb not null,
  generated_output text,
  quality_scores jsonb,
  remix_source_id uuid, 
  created_at timestamptz default now()
);

create table if not exists asset_generation_usage (
  id uuid default uuid_generate_v4() primary key,
  asset_id int not null,
  user_id uuid references auth.users,
  fill_values jsonb not null,
  generated_output text,
  model_used text default 'claude-sonnet',
  tokens_input int,
  tokens_output int,
  generation_time_ms int,
  remix_source_id uuid,
  created_at timestamptz default now()
);

create table if not exists analytics_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  event_type text not null, 
  asset_id int, 
  fine_tune_id uuid, 
  metadata jsonb, 
  created_at timestamptz default now()
);

create table if not exists referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references user_profiles(id) not null,
  referee_id uuid references user_profiles(id), 
  referral_code text unique not null,
  status text default 'pending', 
  created_at timestamptz default now()
);

create table if not exists user_streaks (
  user_id uuid references user_profiles(id) primary key,
  current_streak_weeks int default 0,
  last_activity_date date,
  total_activities int default 0,
  updated_at timestamptz default now()
);

create table if not exists collections (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  theme_color text,
  asset_ids int[], 
  release_date timestamptz default now(),
  is_active boolean default true
);

create table if not exists submitted_assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  asset_data jsonb not null,
  status text default 'pending',
  admin_note text,
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique,
  owner_id uuid references user_profiles(id) not null,
  business_type text,
  business_info jsonb,
  brand_voice text,
  logo_url text,
  max_members int default 10,
  tier text default 'team_starter',
  created_at timestamptz default now()
);

create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) not null,
  user_id uuid references user_profiles(id) not null,
  role text default 'member',
  invited_by uuid references user_profiles(id),
  joined_at timestamptz default now(),
  unique (team_id, user_id)
);

create table if not exists team_prompts (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) not null,
  created_by uuid references user_profiles(id) not null,
  source_type text not null,
  source_id text not null,
  prompt_name text not null,
  fill_values jsonb,
  built_prompt text,
  generated_output text,
  tags text[],
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workshops (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) not null,
  facilitator_id uuid references user_profiles(id) not null,
  title text not null,
  description text,
  assigned_assets int[],
  assigned_fine_tunes uuid[],
  status text default 'draft',
  join_code text unique,
  max_participants int default 30,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists workshop_submissions (
  id uuid default uuid_generate_v4() primary key,
  workshop_id uuid references workshops(id) not null,
  user_id uuid references user_profiles(id) not null,
  source_type text not null,
  source_id text not null,
  fill_values jsonb,
  generated_output text,
  submitted_at timestamptz default now(),
  facilitator_comment text,
  is_highlighted boolean default false
);

create table if not exists output_feedback (
  id uuid default uuid_generate_v4() primary key,
  usage_type text not null,
  usage_id uuid not null,
  user_id uuid references user_profiles(id) not null,
  usage_status text not null,
  performance_metrics jsonb,
  comment text,
  feedback_at timestamptz default now()
);

create table if not exists smart_defaults (
  id uuid default uuid_generate_v4() primary key,
  source_type text not null,
  source_id text not null,
  business_type text not null,
  control_id text not null,
  recommended_value text not null,
  confidence float default 0,
  sample_size int default 0,
  updated_at timestamptz default now(),
  unique (source_type, source_id, business_type, control_id)
);

create table if not exists creator_profiles (
  user_id uuid references user_profiles(id) primary key,
  display_name text not null,
  bio text,
  avatar_url text,
  website_url text,
  total_earnings int default 0,
  total_downloads int default 0,
  rating_avg float default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists marketplace_listings (
  id uuid default uuid_generate_v4() primary key,
  fine_tune_id uuid references user_fine_tunes(id) not null,
  creator_id uuid references user_profiles(id) not null,
  price int not null,
  currency text default 'THB',
  listing_status text default 'draft',
  admin_review_note text,
  preview_description text not null,
  tags text[],
  industry_tags text[],
  downloads int default 0,
  revenue_total int default 0,
  featured boolean default false,
  created_at timestamptz default now(),
  published_at timestamptz
);

create table if not exists marketplace_purchases (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references marketplace_listings(id) not null,
  buyer_id uuid references user_profiles(id) not null,
  price_paid int not null,
  payment_ref text,
  purchased_at timestamptz default now()
);

create table if not exists industry_packs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique,
  description text not null,
  icon_name text,
  cover_color text,
  industry_type text not null,
  included_assets int[],
  included_fine_tunes uuid[],
  price int not null,
  tier_required text default 'pro',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists industry_asset_overrides (
  id uuid default uuid_generate_v4() primary key,
  pack_id uuid references industry_packs(id) not null,
  asset_id int not null,
  custom_prompt_template text,
  custom_fill_steps jsonb,
  custom_example_preview jsonb
);

-- PHASE 10: Integrations, Certifications, White-Label --

create table if not exists user_integrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  platform text not null, -- line_oa, google, facebook, canva
  access_token text,
  refresh_token text,
  platform_user_id text,
  platform_metadata jsonb,
  connected_at timestamptz default now(),
  expires_at timestamptz,
  unique (user_id, platform)
);

create table if not exists integration_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id),
  platform text not null,
  action text not null, -- send_broadcast, export_sheet
  usage_id uuid,
  status text not null, -- success, failed
  error_message text,
  created_at timestamptz default now()
);

create table if not exists certifications (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  level int not null,
  description text,
  requirements jsonb not null,
  badge_icon text,
  badge_color text,
  created_at timestamptz default now()
);

create table if not exists user_certifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id) not null,
  certification_id uuid references certifications(id) not null,
  progress jsonb not null,
  completed_at timestamptz,
  certificate_url text,
  verify_code text unique,
  unique (user_id, certification_id)
);

create table if not exists white_label_tenants (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references user_profiles(id) not null,
  brand_name text not null,
  slug text unique,
  custom_domain text,
  logo_url text,
  primary_color text default '#F27405',
  secondary_color text default '#05F2F2',
  background_color text default '#012840',
  custom_css text,
  welcome_message text,
  enabled_assets int[],
  enabled_fine_tunes uuid[],
  enabled_marketplace boolean default false,
  max_users int default 50,
  tier text default 'wl_starter',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists white_label_users (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references white_label_tenants(id) not null,
  user_id uuid references user_profiles(id) not null,
  role text default 'user',
  joined_at timestamptz default now(),
  unique (tenant_id, user_id)
);

-- RLS
alter table user_integrations enable row level security;
alter table integration_logs enable row level security;
alter table certifications enable row level security;
alter table user_certifications enable row level security;
alter table white_label_tenants enable row level security;
alter table white_label_users enable row level security;

create policy "Users manage own integrations" on user_integrations for all using (auth.uid() = user_id);
create policy "Users see own certs" on user_certifications for all using (auth.uid() = user_id);
create policy "Public read certs" on certifications for select using (true);
create policy "Tenant owners manage tenant" on white_label_tenants for all using (auth.uid() = owner_id);
