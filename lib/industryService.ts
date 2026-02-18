import { IndustryPack } from '../types';

export const SEED_PACKS: IndustryPack[] = [
    {
        id: 'pack-restaurant',
        name: 'ร้านอาหาร & คาเฟ่ Pack',
        slug: 'restaurant',
        description: 'รวมเครื่องมือครบวงจรสำหรับเจ้าของร้านอาหาร ดึงลูกค้าเข้าร้าน',
        icon_name: 'Utensils',
        cover_color: 'from-orange-500 to-red-600',
        industry_type: 'restaurant',
        included_assets: [1, 3, 5], // Calendar, Converter, LINE OA
        included_fine_tunes: ['seed-1'],
        price: 49900,
        tier_required: 'pro'
    },
    {
        id: 'pack-clinic',
        name: 'คลินิกความงาม Pack',
        slug: 'clinic',
        description: 'เพิ่มยอดจองคิว สร้างความน่าเชื่อถือให้คลินิกของคุณ',
        icon_name: 'Stethoscope',
        cover_color: 'from-pink-500 to-rose-400',
        industry_type: 'clinic',
        included_assets: [1, 2, 3],
        included_fine_tunes: [],
        price: 59900,
        tier_required: 'pro'
    },
    {
        id: 'pack-ecommerce',
        name: 'E-commerce Pack',
        slug: 'ecommerce',
        description: 'เครื่องมือแม่ค้าออนไลน์ เร่งยอดขาย ปิดออเดอร์ไว',
        icon_name: 'ShoppingBag',
        cover_color: 'from-blue-500 to-indigo-600',
        industry_type: 'ecommerce',
        included_assets: [1, 3, 5, 6],
        included_fine_tunes: [],
        price: 49900,
        tier_required: 'pro'
    }
];

export const getIndustryPacks = async (): Promise<IndustryPack[]> => {
    return SEED_PACKS;
};

export const getPackBySlug = async (slug: string): Promise<IndustryPack | undefined> => {
    return SEED_PACKS.find(p => p.slug === slug);
};

// Mock Overrides
export const getAssetOverride = (assetId: number, industry: string) => {
    if (industry === 'restaurant' && assetId === 1) { // Campaign Calendar Override
        return {
            template: `คุณคือผู้เชี่ยวชาญการตลาดร้านอาหาร สร้างปฏิทินคอนเทนต์ที่เน้น "ความน่ากิน" และ "โปรโมชั่นหน้าร้าน"
            ธุรกิจ: ร้านอาหาร | เมนูเด็ด: [สินค้า/บริการ] ...`,
            overrideFields: [
                { name: "สินค้า/บริการ", label: "เมนูแนะนำ / Signature" }
            ],
            badge: "Restaurant Edition"
        };
    }
    return null;
};
