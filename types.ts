
export interface AssetField {
  name: string;
  type: 'Pick' | 'Template' | 'Custom' | 'Multi' | 'Color';
  options?: string[];
  allowCustom?: boolean;
  label: string;
  hint?: string;
}

export interface Asset {
  id: number;
  iconName: string; // Storing icon name as string to map dynamically
  tag: string;
  tagColor: string;
  title: string;
  oneLiner: string;
  saved: string;
  fields: AssetField[];
  template: string;
  afterCopyTip: string;
  badges?: string[]; // 'NEW', 'MEMBER', 'PRO'
  tierRequired?: 'free' | 'member' | 'pro';
  creator?: string; // For UGC
}

export interface UserProfile {
  id: string;
  display_name: string;
  business_type: string;
  business_info: any;
  color_palette: string;
}

export interface SavedPrompt {
  id: string; // UUID
  user_id: string;
  asset_id: number;
  title: string; // prompt_name
  content: string; // built_prompt
  fill_values: Record<string, any>;
  is_favorite: boolean;
  tags: string[];
  folder_id?: string;
  created_at?: string;
}

export interface PromptFolder {
  id: string;
  user_id: string;
  name: string;
  icon_name: string;
  created_at: string;
}

// Phase 3: Fine-Tune Types
export type SubscriptionTier = 'free' | 'member' | 'pro';

export interface FineTuneControl {
  id: string;
  variable_name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multi_select' | 'slider' | 'toggle';
  required: boolean;
  description?: string;
  options?: string[]; // for select/multi
  min?: number; // for slider
  max?: number;
  step?: number;
  labels?: { min: string; max: string };
  default_value?: any;
  rows?: number; // for textarea
  onLabel?: string; // for toggle
  offLabel?: string;
}

export interface FineTunePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tier_required: SubscriptionTier;
  version: string;
  base_prompt?: string; // Hidden in client usually, but simulating logic here
  system_instruction?: string;
  controls: FineTuneControl[];
  icon_name: string;
  tag_color: string;
  quality_scoring_enabled: boolean;
  quality_criteria: any[];
  user_id?: string; // If UGC
}

export interface GenerationResult {
  success: boolean;
  output?: string;
  usageId?: string;
  error?: string;
  limitReached?: boolean;
}

// Phase 7: Team & Workshop
export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  business_type?: string;
  brand_voice?: string;
  max_members: number;
  tier: 'team_starter' | 'team_pro';
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  display_name?: string; // Joined from user_profiles
}

export interface TeamPrompt {
  id: string;
  team_id: string;
  created_by: string;
  source_type: 'asset' | 'fine_tune';
  source_id: string;
  prompt_name: string;
  fill_values: any;
  generated_output?: string;
  is_pinned: boolean;
  created_at: string;
  creator_name?: string; // Joined
}

export interface Workshop {
  id: string;
  team_id: string;
  title: string;
  status: 'draft' | 'live' | 'completed';
  join_code: string;
  assigned_assets: number[];
  assigned_fine_tunes: string[];
}

export interface WorkshopSubmission {
  id: string;
  workshop_id: string;
  user_id: string;
  source_id: string;
  generated_output: string;
  is_highlighted: boolean;
  submitted_at: string;
}

// Phase 8: Analytics & Learning
export type UsageStatus = 'used_as_is' | 'edited_minor' | 'edited_major' | 'not_used';

export interface OutputFeedback {
  id: string;
  usage_type: 'asset' | 'fine_tune';
  usage_id: string;
  user_id: string;
  usage_status: UsageStatus;
  performance_metrics?: Record<string, number>;
  comment?: string;
  feedback_at: string;
}

export interface SmartDefault {
  source_type: 'asset' | 'fine_tune';
  source_id: string;
  business_type: string;
  control_id: string;
  recommended_value: string;
  confidence: number;
}

// Phase 9: Marketplace & Packs
export interface CreatorProfile {
  user_id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  total_earnings: number;
  total_downloads: number;
  rating_avg: number;
  is_verified: boolean;
}

export interface MarketplaceListing {
  id: string;
  fine_tune_id: string;
  creator_id: string;
  price: number; // satang
  listing_status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  preview_description: string;
  tags: string[];
  industry_tags: string[];
  downloads: number;
  featured: boolean;
  
  // Joined Fields
  title?: string;
  icon_name?: string;
  creator_name?: string;
  creator_avatar?: string;
  rating?: number;
  review_count?: number;
}

export interface IndustryPack {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  cover_color: string;
  industry_type: string;
  included_assets: number[];
  included_fine_tunes: string[];
  price: number;
  tier_required: 'member' | 'pro';
}

// Phase 10: Integrations & Certifications & White-label
export type IntegrationPlatform = 'line_oa' | 'google' | 'facebook' | 'canva';

export interface UserIntegration {
  id: string;
  platform: IntegrationPlatform;
  platform_metadata: any;
  connected_at: string;
}

export interface Certification {
  id: string;
  name: string;
  level: number;
  description: string;
  badge_icon: string;
  badge_color: string;
  requirements: Record<string, {target: number, label: string}>;
}

export interface UserCertification {
  id: string;
  certification_id: string;
  progress: Record<string, number>; // requirement_key -> current_value
  completed_at?: string;
  verify_code?: string;
}

export interface WhiteLabelTenant {
  id: string;
  brand_name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  background_color?: string;
  welcome_message?: string;
  enabled_assets?: number[];
  is_active: boolean;
}
