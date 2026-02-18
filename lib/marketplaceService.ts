import { supabase } from './supabase';
import { MarketplaceListing, CreatorProfile } from '../types';

// Mock Data for Demo
const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    id: 'm1',
    fine_tune_id: 'ft1',
    creator_id: 'c1',
    price: 0,
    listing_status: 'approved',
    preview_description: 'ช่วยเขียนแคปชั่นขายของให้น่าสนใจ เพิ่มยอดขายได้จริง',
    tags: ['Social Media', 'Copywriting'],
    industry_tags: ['E-commerce', 'General'],
    downloads: 1250,
    featured: true,
    title: 'แม่ค้าออนไลน์ Starter Kit',
    icon_name: 'ShoppingBag',
    creator_name: 'Coach Bank',
    creator_avatar: 'B',
    rating: 4.8,
    review_count: 45
  },
  {
    id: 'm2',
    fine_tune_id: 'ft2',
    creator_id: 'c2',
    price: 29900, // 299 THB
    listing_status: 'approved',
    preview_description: 'สร้าง Script วิดีโอสั้นสำหรับคลินิกความงามโดยเฉพาะ',
    tags: ['Video', 'Script'],
    industry_tags: ['Clinic', 'Beauty'],
    downloads: 320,
    featured: false,
    title: 'Clinic Reel Script Pro',
    icon_name: 'Video',
    creator_name: 'Dr. Marketing',
    creator_avatar: 'D',
    rating: 4.9,
    review_count: 12
  },
  {
    id: 'm3',
    fine_tune_id: 'ft3',
    creator_id: 'c3',
    price: 19900,
    listing_status: 'approved',
    preview_description: 'ตอบแชทลูกค้าแบบมืออาชีพ ปิดการขายได้ไวขึ้น',
    tags: ['Chat', 'Sales'],
    industry_tags: ['General'],
    downloads: 850,
    featured: true,
    title: 'Smart Admin Reply',
    icon_name: 'MessageCircle',
    creator_name: 'Admin Pro',
    creator_avatar: 'A',
    rating: 4.7,
    review_count: 88
  }
];

export const getListings = async (filters?: any): Promise<MarketplaceListing[]> => {
  // In real app, query supabase 'marketplace_listings' with joins
  // For demo, return mock with filter logic
  let results = [...MOCK_LISTINGS];
  
  if (filters?.industry && filters.industry !== 'All') {
      // Simple filter mock
  }
  
  return results;
};

export const getListingById = async (id: string): Promise<MarketplaceListing | undefined> => {
    return MOCK_LISTINGS.find(l => l.id === id);
};

export const getCreatorProfile = async (userId: string): Promise<CreatorProfile | null> => {
    const { data } = await supabase.from('creator_profiles').select('*').eq('user_id', userId).single();
    if (data) return data;
    
    // Return mock if not found
    return {
        user_id: userId,
        display_name: 'New Creator',
        bio: 'Creating awesome prompts',
        avatar_url: '',
        total_earnings: 0,
        total_downloads: 0,
        rating_avg: 0,
        is_verified: false
    };
};

export const purchaseListing = async (listingId: string, userId: string): Promise<boolean> => {
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await supabase.from('marketplace_purchases').insert([{
        listing_id: listingId,
        buyer_id: userId,
        price_paid: 29900, // Mock price
        payment_ref: 'mock_stripe_charge'
    }]);
    
    return true;
};
