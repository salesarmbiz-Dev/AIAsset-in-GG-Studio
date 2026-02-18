import { supabase } from './supabase';
import { SmartDefault } from '../types';

export const getSmartDefaults = async (
  sourceType: 'asset' | 'fine_tune',
  sourceId: string,
  businessType?: string
): Promise<SmartDefault[]> => {
  if (!businessType) return [];

  // 1. Try fetch from DB
  const { data } = await supabase.from('smart_defaults')
    .select('*')
    .eq('source_type', sourceType)
    .eq('source_id', sourceId)
    .eq('business_type', businessType);

  if (data && data.length > 0) return data as SmartDefault[];

  // 2. Fallback: Mock Logic for Demo
  // Simulating "AI Learning" based on business type
  const mockDefaults: SmartDefault[] = [];

  if (businessType === 'ร้านอาหาร/คาเฟ่') {
      mockDefaults.push(
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'Tone', recommended_value: 'Friendly/Casual', confidence: 0.85 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'tone', recommended_value: 'Friendly เป็นกันเอง', confidence: 0.85 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'เป้าหมาย', recommended_value: 'ดึงคนมาหน้าร้าน', confidence: 0.75 }
      );
  } else if (businessType === 'คลินิกความงาม') {
      mockDefaults.push(
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'Tone', recommended_value: 'Professional', confidence: 0.9 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'tone', recommended_value: 'Professional สุภาพ', confidence: 0.9 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'hard_sell_level', recommended_value: '4', confidence: 0.7 }
      );
  } else if (businessType === 'ร้านค้าออนไลน์') {
      mockDefaults.push(
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'Tone', recommended_value: 'Urgent/FOMO', confidence: 0.8 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'tone', recommended_value: 'Urgent เร่งด่วน', confidence: 0.8 },
          { source_type: sourceType, source_id: sourceId, business_type: businessType, control_id: 'hard_sell_level', recommended_value: '5', confidence: 0.65 }
      );
  }

  return mockDefaults;
};

// Simulate Prompt Enhancement based on insights
export const applyEnhancements = (prompt: string, businessType?: string) => {
    if (!businessType) return prompt;
    
    let enhancement = `\n\n[AI ENHANCEMENT for ${businessType}]:`;
    if (businessType === 'ร้านอาหาร/คาเฟ่') {
        enhancement += `\n- เน้นความน่ากินและบรรยากาศ`;
        enhancement += `\n- ใช้คำกระตุ้นความหิว (Sensory words)`;
    } else if (businessType === 'คลินิกความงาม') {
        enhancement += `\n- เน้นความน่าเชื่อถือและผลลัพธ์`;
        enhancement += `\n- หลีกเลี่ยงคำที่ดู Overclaim`;
    }
    
    return prompt + enhancement;
};
