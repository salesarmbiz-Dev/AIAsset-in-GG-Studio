import { supabase } from './supabase';
import { Team, TeamMember, TeamPrompt, Workshop, WorkshopSubmission } from '../types';

// --- Team Management ---

export const createTeam = async (name: string, userId: string): Promise<{ teamId?: string, error?: any }> => {
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  
  // Create Team
  const { data: team, error } = await supabase.from('teams').insert([{
    name,
    slug,
    owner_id: userId,
    tier: 'team_starter'
  }]).select().single();

  if (error) return { error };

  // Add Owner as Member
  await supabase.from('team_members').insert([{
    team_id: team.id,
    user_id: userId,
    role: 'owner'
  }]);

  return { teamId: team.id };
};

export const getUserTeams = async (userId: string): Promise<Team[]> => {
  const { data } = await supabase.from('team_members')
    .select('team_id, teams(*)')
    .eq('user_id', userId);
  
  return data?.map((d: any) => d.teams) || [];
};

export const getTeamBySlug = async (slug: string): Promise<Team | null> => {
  const { data } = await supabase.from('teams').select('*').eq('slug', slug).single();
  return data;
};

export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const { data } = await supabase.from('team_members')
    .select('*, user_profiles(display_name)')
    .eq('team_id', teamId);
  
  return data?.map((d: any) => ({
    ...d,
    display_name: d.user_profiles?.display_name || 'User'
  })) || [];
};

// --- Team Library ---

export const saveToTeamLibrary = async (
  teamId: string, 
  userId: string, 
  data: {
    source_type: 'asset' | 'fine_tune',
    source_id: string,
    prompt_name: string,
    fill_values: any,
    generated_output: string
  }
) => {
  return await supabase.from('team_prompts').insert([{
    team_id: teamId,
    created_by: userId,
    ...data
  }]);
};

export const getTeamPrompts = async (teamId: string): Promise<TeamPrompt[]> => {
  const { data } = await supabase.from('team_prompts')
    .select('*, user_profiles(display_name)')
    .eq('team_id', teamId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  return data?.map((d: any) => ({
    ...d,
    creator_name: d.user_profiles?.display_name
  })) || [];
};

// --- Workshop ---

export const createWorkshop = async (teamId: string, facilitatorId: string, title: string, assetIds: number[]) => {
  const joinCode = Math.floor(100000 + Math.random() * 900000).toString();
  return await supabase.from('workshops').insert([{
    team_id: teamId,
    facilitator_id: facilitatorId,
    title,
    assigned_assets: assetIds,
    join_code: joinCode,
    status: 'draft'
  }]).select().single();
};

export const joinWorkshop = async (code: string): Promise<Workshop | null> => {
  const { data } = await supabase.from('workshops').select('*').eq('join_code', code).single();
  return data;
};

export const submitWorkshopTask = async (
    workshopId: string, 
    userId: string, 
    sourceId: string, 
    output: string,
    fillValues: any
) => {
    return await supabase.from('workshop_submissions').insert([{
        workshop_id: workshopId,
        user_id: userId,
        source_type: 'asset',
        source_id: sourceId,
        generated_output: output,
        fill_values: fillValues
    }]);
};

export const getWorkshopSubmissions = async (workshopId: string): Promise<WorkshopSubmission[]> => {
    const { data } = await supabase.from('workshop_submissions')
        .select('*')
        .eq('workshop_id', workshopId);
    return data || [];
}
