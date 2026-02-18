import { supabase } from './supabase';
import { WhiteLabelTenant } from '../types';

export const getTenantBySlug = async (slug: string): Promise<WhiteLabelTenant | null> => {
    const { data } = await supabase.from('white_label_tenants').select('*').eq('slug', slug).eq('is_active', true).single();
    return data;
};

export const getTenantByOwner = async (ownerId: string): Promise<WhiteLabelTenant | null> => {
    const { data } = await supabase.from('white_label_tenants').select('*').eq('owner_id', ownerId).single();
    return data;
};

export const updateTenantSettings = async (tenantId: string, updates: Partial<WhiteLabelTenant>) => {
    return await supabase.from('white_label_tenants').update(updates).eq('id', tenantId);
};

// Mock Tenant for Demo
export const createMockTenant = async (userId: string) => {
    const { data } = await supabase.from('white_label_tenants').select('*').eq('owner_id', userId).single();
    if (data) return data;

    return await supabase.from('white_label_tenants').insert({
        owner_id: userId,
        brand_name: 'Agency X Platform',
        slug: `agency-${Math.floor(Math.random()*1000)}`,
        primary_color: '#8B5CF6',
        secondary_color: '#F472B6',
        background_color: '#1e1b4b', // dark indigo
        welcome_message: 'Welcome to Agency X Content Hub'
    }).select().single();
};
