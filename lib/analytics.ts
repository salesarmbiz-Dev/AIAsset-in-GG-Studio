import { supabase } from './supabase';

type EventType = 
  | 'view_asset' 
  | 'copy_asset' 
  | 'save_asset' 
  | 'generate_finetune' 
  | 'share_asset' 
  | 'share_finetune'
  | 'referral_click';

interface EventMetadata {
  asset_title?: string;
  fill_mode?: 'pick' | 'custom' | 'template';
  completion_rate?: number;
  fine_tune_title?: string;
  platform?: string; // mobile/desktop
  [key: string]: any;
}

export const trackEvent = async (
  eventType: EventType,
  userId: string | undefined,
  entityId: string | number, // asset_id or fine_tune_id
  metadata: EventMetadata = {}
) => {
  if (!userId) return; // Optional: Track anonymous with session ID if needed

  const payload: any = {
    user_id: userId,
    event_type: eventType,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
  };

  if (typeof entityId === 'number') {
    payload.asset_id = entityId;
  } else {
    payload.fine_tune_id = entityId;
  }

  try {
    const { error } = await supabase.from('analytics_events').insert([payload]);
    if (error) console.error('Analytics Error:', error);
    
    // Check Streak on meaningful actions
    if (['copy_asset', 'generate_finetune'].includes(eventType)) {
      updateStreak(userId);
    }

  } catch (e) {
    console.error('Analytics Exception:', e);
  }
};

const updateStreak = async (userId: string) => {
  // Simple Mock Logic for Streak: Check last activity date
  // In real app, this should be an Edge Function/Trigger to avoid client-side manipulation
  const today = new Date().toISOString().split('T')[0];
  
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) {
    await supabase.from('user_streaks').insert([{ 
      user_id: userId, 
      current_streak_weeks: 1, 
      last_activity_date: today,
      total_activities: 1 
    }]);
  } else {
    // Logic: If last activity was > 7 days ago, reset? Or simple daily/weekly logic.
    // For MVP, just increment total activity and update date
    await supabase.from('user_streaks').update({
       last_activity_date: today,
       total_activities: streak.total_activities + 1
       // Complex weekly streak logic would go here
    }).eq('user_id', userId);
  }
};

// Mock Aggregation for Admin Dashboard (Client-side aggregation for demo)
export const getAdminStats = async () => {
    // In production, use Supabase RPC or dedicated Stats table
    return {
        total_copies: 1250,
        total_generates: 450,
        active_users: 320,
        mrr: 15400,
        asset_performance: [
            { name: 'Campaign Calendar', copies: 320, saves: 120, favorites: 45 },
            { name: 'Image Prompt', copies: 280, saves: 90, favorites: 60 },
            { name: 'Content Converter', copies: 210, saves: 80, favorites: 30 },
            { name: 'Video Script', copies: 190, saves: 75, favorites: 50 },
            { name: 'LINE OA', copies: 150, saves: 40, favorites: 20 },
            { name: 'RAG', copies: 100, saves: 30, favorites: 15 },
        ],
        fine_tune_usage: [
            { name: 'Pro Sales Copywriter', generates: 300, avg_score: 4.5 },
            { name: 'Executive Email', generates: 150, avg_score: 4.8 },
        ],
        revenue_data: [
            { date: 'W1', value: 3000 },
            { date: 'W2', value: 4500 },
            { date: 'W3', value: 3800 },
            { date: 'W4', value: 5200 },
        ]
    };
};
