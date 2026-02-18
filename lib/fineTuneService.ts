import { supabase } from './supabase';
import { FineTunePrompt, SubscriptionTier } from '../types';

// Mock Seed Data (Fallback if DB is empty)
export const SEED_FINE_TUNES: FineTunePrompt[] = [
  {
    id: 'seed-1',
    title: 'Pro Sales Copywriter',
    description: 'เขียนคำโฆษณาขายสินค้าแบบมือโปร ปรับระดับความ Hard Sell ได้',
    category: 'copywriting',
    tier_required: 'member',
    version: '1.2',
    icon_name: 'PenLine',
    tag_color: '#F27405',
    base_prompt: `คุณคือ Copywriter มืออาชีพที่เชี่ยวชาญการเขียนคำโฆษณาสำหรับตลาดไทย\nสินค้า/บริการ: {{product}}\nกลุ่มเป้าหมาย: {{target_audience}}\nโทนการเขียน: {{tone}}\nระดับ Hard Sell: {{hard_sell_level}}\nจุดขายหลัก (USP): {{usp}}\nโปรโมชัน/ข้อเสนอ: {{promotion}}\nเขียนคำโฆษณา {{output_format}}:\n1) HEADLINE — จับใจ หยุด scroll ได้\n2) BODY — เล่า pain point → solution → benefit ตามระดับ Hard Sell\n3) CTA — call to action ชัดเจน\n4) HASHTAGS — 5-8 hashtags\nเขียน 2 เวอร์ชัน: Version A (สั้นกระชับ) และ Version B (เล่าเรื่อง)`,
    controls: [
      {id: "product", variable_name: "product", label: "สินค้า/บริการ", type: "textarea", required: true, rows: 3},
      {id: "target_audience", variable_name: "target_audience", label: "กลุ่มเป้าหมาย", type: "select", required: true, options: ["เจ้าของธุรกิจ SME", "แม่ค้าออนไลน์", "Marketing Manager", "Freelancer/Creator", "นักศึกษา/คนรุ่นใหม่", "ผู้บริหาร C-Level", "พนักงานออฟฟิศ"]},
      {id: "tone", variable_name: "tone", label: "โทนการเขียน", type: "select", required: true, options: ["Professional สุภาพ", "Friendly เป็นกันเอง", "Fun สนุกสนาน", "Luxury พรีเมียม", "Urgent เร่งด่วน", "Motivational สร้างแรงบันดาลใจ"]},
      {id: "hard_sell_level", variable_name: "hard_sell_level", label: "ระดับ Hard Sell", type: "slider", required: true, min: 1, max: 5, step: 1, labels: {min: "Soft Sell", max: "Hard Sell"}, default_value: 3},
      {id: "usp", variable_name: "usp", label: "จุดขายหลัก (USP)", type: "text", required: true},
      {id: "promotion", variable_name: "promotion", label: "โปรโมชัน/ข้อเสนอ", type: "text", required: false},
      {id: "output_format", variable_name: "output_format", label: "รูปแบบ Output", type: "select", required: true, options: ["Facebook Post", "Instagram Caption", "LINE OA Broadcast", "TikTok Script", "Google Ads", "Landing Page"]}
    ],
    quality_scoring_enabled: true,
    quality_criteria: [
      {name: "Hook ดึงดูด", color: "#F27405", weight: 2},
      {name: "ความน่าเชื่อถือ", color: "#05F2F2", weight: 2},
      {name: "CTA ชัดเจน", color: "#58CC02", weight: 1}
    ]
  },
  {
    id: 'seed-2',
    title: 'Executive Email Rewriter',
    description: 'แปลงอีเมลห้วนๆ ให้สุภาพและเป็นมืออาชีพ เหมาะสำหรับคุยกับผู้บริหาร',
    category: 'email',
    tier_required: 'pro',
    version: '2.0',
    icon_name: 'Mail',
    tag_color: '#FFD700',
    base_prompt: `คุณคือ Executive Communication Specialist ที่เชี่ยวชาญการเขียนอีเมลระดับ C-Suite\nอีเมลต้นฉบับ: {{original_email}}\nผู้รับ: {{recipient_role}}\nวัตถุประสงค์: {{purpose}}\nระดับความเป็นทางการ: {{formality_level}}\nภาษา: {{language}}\nเพิ่มเติม: {{additional_context}}\nRewrite อีเมลนี้:\n1) Subject Line — ชัดเจน professional ไม่เกิน 60 characters\n2) Opening — ทักทายเหมาะสมกับระดับผู้รับ\n3) Body — จัดโครงสร้าง สื่อสาร key message ภายใน 3 ย่อหน้า\n4) Closing — ปิดท้ายด้วย next step ชัดเจน\n5) Tone Check — อธิบายว่าปรับอะไรบ้าง ทำไม`,
    controls: [
      {id: "original_email", variable_name: "original_email", label: "อีเมลต้นฉบับ", type: "textarea", required: true, rows: 5},
      {id: "recipient_role", variable_name: "recipient_role", label: "ผู้รับอีเมล", type: "select", required: true, options: ["CEO / MD", "VP / Director", "Manager", "ลูกค้า / Client", "Partner / Vendor", "ทีมงาน / Colleague", "Board Member"]},
      {id: "purpose", variable_name: "purpose", label: "วัตถุประสงค์", type: "select", required: true, options: ["ขออนุมัติ / Request Approval", "สถานะ / Update", "นัดประชุม / Meeting", "ส่งงาน / Deliverable", "แจ้งปัญหา / Escalation", "ขอบคุณ / Thank You", "Follow Up"]},
      {id: "formality_level", variable_name: "formality_level", label: "ระดับความเป็นทางการ", type: "slider", required: true, min: 1, max: 5, step: 1, labels: {min: "Casual", max: "Formal"}, default_value: 4},
      {id: "language", variable_name: "language", label: "ภาษา", type: "select", required: true, options: ["ไทย", "English", "ไทย-English Mix"]},
      {id: "additional_context", variable_name: "additional_context", label: "บริบทเพิ่มเติม", type: "text", required: false}
    ],
    quality_scoring_enabled: true,
    quality_criteria: [
      {name: "ความเป็นมืออาชีพ", color: "#FFD700", weight: 2},
      {name: "สื่อสารชัดเจน", color: "#05F2F2", weight: 2},
      {name: "Next Step ชัด", color: "#58CC02", weight: 1}
    ]
  }
];

export const getFineTunePrompts = async (): Promise<FineTunePrompt[]> => {
  try {
    const { data, error } = await supabase.from('fine_tune_prompts').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) {
      console.warn("Using Seed Data for Fine Tune Prompts");
      return SEED_FINE_TUNES;
    }
    return data;
  } catch (e) {
    return SEED_FINE_TUNES;
  }
};

export const generateFineTuneOutput = async (
  fineTune: FineTunePrompt, 
  values: Record<string, any>, 
  userTier: SubscriptionTier
): Promise<{ success: boolean; output?: string; error?: string }> => {
  
  // 1. Check Tier
  const tierLevels = { 'free': 0, 'member': 1, 'pro': 2 };
  if (tierLevels[userTier] < tierLevels[fineTune.tier_required]) {
    return { success: false, error: `Requires ${fineTune.tier_required} tier` };
  }

  // 2. Build Prompt (Simulation)
  let prompt = fineTune.base_prompt || "";
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    prompt = prompt.split(placeholder).join(String(value));
  });

  // 3. Mock AI Delay & Output
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Mock Output
  const mockOutput = `[MOCK AI OUTPUT for ${fineTune.title}]
--------------------------------------------------
${prompt.substring(0, 100)}...
--------------------------------------------------
(นี่คือตัวอย่าง Output จำลอง เนื่องจากยังไม่ได้เชื่อมต่อ AI API จริง)

Headline: ยกระดับธุรกิจคุณด้วย ${values.product || 'สินค้าของเรา'}
Body: 
คุณกำลังประสบปัญหา... ใช่หรือไม่? ${values.product} ช่วยคุณได้...
ด้วยจุดเด่น ${values.usp}...

CTA: สั่งซื้อเลยวันนี้!
Hashtags: #Business #${values.product ? String(values.product).split(' ')[0] : 'Product'} #Growth
`;

  return { success: true, output: mockOutput };
};
