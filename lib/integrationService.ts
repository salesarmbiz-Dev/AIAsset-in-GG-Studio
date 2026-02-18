import { supabase } from './supabase';
import { UserIntegration, IntegrationPlatform } from '../types';

export const PLATFORMS = [
    { id: 'line_oa', name: 'LINE Official Account', icon: 'MessageCircle', color: '#06c755' },
    { id: 'google', name: 'Google Sheets', icon: 'Table', color: '#10b981' },
    { id: 'facebook', name: 'Facebook Page', icon: 'Facebook', color: '#3b82f6' },
    { id: 'canva', name: 'Canva', icon: 'Image', color: '#8b5cf6' },
];

export const getUserIntegrations = async (userId: string): Promise<UserIntegration[]> => {
    const { data } = await supabase.from('user_integrations').select('*').eq('user_id', userId);
    return data || [];
};

export const connectPlatform = async (userId: string, platform: IntegrationPlatform) => {
    // Mock OAuth Flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockMetadata = {
        connected_account: `user_${Math.floor(Math.random()*1000)}`,
        channel_name: `${platform.toUpperCase()} Demo Channel`
    };

    return await supabase.from('user_integrations').upsert({
        user_id: userId,
        platform,
        platform_metadata: mockMetadata
    });
};

export const disconnectPlatform = async (userId: string, platform: IntegrationPlatform) => {
    return await supabase.from('user_integrations').delete().eq('user_id', userId).eq('platform', platform);
};

export const sendToPlatform = async (userId: string, platform: IntegrationPlatform, content: string, metadata?: any) => {
    // Check connection first
    const { data } = await supabase.from('user_integrations').select('*').eq('user_id', userId).eq('platform', platform).single();
    if (!data) throw new Error(`Platform ${platform} not connected`);

    // Mock API Call to Platform
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Log success
    await supabase.from('integration_logs').insert({
        user_id: userId,
        platform,
        action: 'send_content',
        status: 'success'
    });

    return { success: true };
};
