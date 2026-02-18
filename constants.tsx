import { Asset } from './types';

export const ASSETS: Asset[] = [
  {
    id: 1,
    iconName: 'CalendarDays',
    tag: "Planner",
    tagColor: "#6366f1",
    title: "Marketing Campaign Calendar",
    oneLiner: "วางแผนแคมเปญการตลาดรายเดือน พร้อมไทม์ไลน์ครบจบ",
    saved: "ประหยัด 4 ชม./เดือน",
    badges: ['NEW'],
    fields: [
      {
        name: "ประเภทธุรกิจ",
        type: "Pick",
        label: "ประเภทธุรกิจ",
        allowCustom: true,
        options: ["ร้านอาหาร/คาเฟ่", "คลินิกความงาม", "ร้านค้าออนไลน์", "โรงเรียนสอน/คอร์ส", "ฟิตเนส/สุขภาพ", "อสังหาริมทรัพย์", "ที่ปรึกษา/Agency", "โรงแรม/ท่องเที่ยว", "ร้านสะดวกซื้อ/ค้าปลีก", "SaaS/แอปพลิเคชัน"]
      },
      {
        name: "สินค้า/บริการ",
        type: "Custom",
        label: "สินค้า/บริการหลัก",
        hint: "เช่น ครัวซองต์, กาแฟ, เค้กวันเกิด"
      },
      {
        name: "งบการตลาด",
        type: "Pick",
        label: "งบการตลาด",
        allowCustom: true,
        options: ["ต่ำกว่า 5,000 บาท", "5,000-15,000", "15,000-50,000", "50,000-100,000", "100,000+", "ยังไม่มีงบ (Organic)"]
      },
      {
        name: "ช่องทาง",
        type: "Multi",
        label: "ช่องทาง",
        allowCustom: true,
        options: ["Facebook", "Instagram", "TikTok", "LINE OA", "YouTube", "Google Ads", "Twitter/X", "Website/Blog"]
      },
      {
        name: "เดือน",
        type: "Pick",
        label: "เดือนที่จะวางแผน",
        options: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
      },
      {
        name: "เทศกาล",
        type: "Multi",
        label: "เทศกาล/โอกาสพิเศษ",
        allowCustom: true,
        options: ["ปีใหม่", "ตรุษจีน", "Valentine's", "สงกรานต์", "วันแม่", "วันพ่อ", "Halloween", "11.11/12.12", "Black Friday", "คริสต์มาส", "วันหยุดยาว", "ไม่มี/ทั่วไป"]
      },
      {
        name: "เป้าหมาย",
        type: "Pick",
        label: "เป้าหมายหลัก",
        allowCustom: true,
        options: ["เพิ่มยอดขาย", "Brand Awareness", "เพิ่ม Followers", "เปิดตัวสินค้าใหม่", "Re-engagement", "เพิ่ม Traffic", "สร้าง Leads"]
      }
    ],
    template: `คุณคือ Marketing Strategist ที่เชี่ยวชาญการวางแผนแคมเปญสำหรับธุรกิจไทย
ธุรกิจ: [ประเภทธุรกิจ] | สินค้า/บริการหลัก: [สินค้า/บริการ] | งบ: [งบการตลาด] | ช่องทาง: [ช่องทาง] | เดือน: [เดือน] | เทศกาล: [เทศกาล] | เป้าหมาย: [เป้าหมาย]
สร้าง Marketing Campaign Calendar:
1) MONTHLY OVERVIEW
2) WEEKLY BREAKDOWN 4 สัปดาห์
3) KEY DATES & CONTENT
4) AD BUDGET ALLOCATION
5) MEASUREMENT PLAN
— แสดงผลเป็นตาราง`,
    afterCopyTip: "ลองใส่ข้อมูลเพิ่ม เช่น คู่แข่ง หรือจุดแข็งแบรนด์ เพื่อให้ Calendar แม่นยำขึ้น"
  },
  {
    id: 2,
    iconName: 'Palette',
    tag: "Image",
    tagColor: "#f97316",
    title: "Image Prompt Generator",
    oneLiner: "สร้าง Prompt เจนรูป AI ให้ตรงสไตล์แบรนด์",
    saved: "ประหยัด 1 ชม./รูป",
    badges: ['MEMBER'],
    fields: [
      {
        name: "เครื่องมือ AI",
        type: "Pick",
        label: "เครื่องมือ AI ที่ใช้",
        allowCustom: true,
        options: ["Midjourney", "DALL-E 3", "Stable Diffusion", "Leonardo AI", "Ideogram", "Firefly"]
      },
      {
        name: "รายละเอียดรูป",
        type: "Template",
        label: "รายละเอียดรูปที่ต้องการ",
        allowCustom: true,
        options: ["โลโก้แบรนด์...", "รูปสินค้า Flat Lay...", "Banner โปรโมชัน...", "รูป Lifestyle..."]
      },
      {
        name: "สไตล์ภาพ",
        type: "Pick",
        label: "สไตล์ภาพ",
        allowCustom: true,
        options: ["Realistic", "Minimal", "Watercolor", "Flat Design", "3D Render", "Cinematic", "Anime", "Vintage", "Isometric"]
      },
      {
        name: "Color Palette",
        type: "Pick", // Simplified from Color Swatch for MVP
        label: "โทนสี (Color Palette)",
        allowCustom: true,
        options: ["Warm Earth Tones", "Cool Ocean", "Luxury Gold", "Pastel Soft", "Bold Pop", "Monochrome", "Nature Green", "Sunset Gradient"]
      },
      {
        name: "อัตราส่วน",
        type: "Pick",
        label: "อัตราส่วนภาพ",
        options: ["1:1 (Instagram Post)", "4:5 (Instagram Portrait)", "9:16 (Story/Reels)", "16:9 (YouTube/Banner)", "2:3 (Pinterest)", "3:2 (Landscape)"]
      },
      {
        name: "ใช้สำหรับ",
        type: "Pick",
        label: "นำไปใช้สำหรับ",
        allowCustom: true,
        options: ["Social Media Post", "Ad Banner", "Website Hero", "Product Catalog", "Presentation", "Email Header", "Print Material"]
      }
    ],
    template: `คุณคือ AI Art Director ที่เชี่ยวชาญการสร้าง Image Prompt
เครื่องมือ: [เครื่องมือ AI] | รายละเอียด: [รายละเอียดรูป] | สไตล์: [สไตล์ภาพ] | สี: [Color Palette] | อัตราส่วน: [อัตราส่วน] | ใช้สำหรับ: [ใช้สำหรับ]
สร้าง Image Prompt ภาษาอังกฤษ:
1) MAIN PROMPT (detailed, specific)
2) NEGATIVE PROMPT (สิ่งที่ไม่ต้องการ)
3) STYLE PARAMETERS สำหรับเครื่องมือนี้
4) VARIATIONS 3 เวอร์ชัน (ปรับ mood/angle/composition)`,
    afterCopyTip: "ลองเพิ่ม reference image หรือ artist style เพื่อให้ได้ผลลัพธ์ตรงใจมากขึ้น"
  },
  {
    id: 3,
    iconName: 'RefreshCw',
    tag: "Converter",
    tagColor: "#10b981",
    title: "Multi Platform Content",
    oneLiner: "แปลง Content 1 ชิ้น ให้ใช้ได้ทุก Platform",
    saved: "ประหยัด 3 ชม./สัปดาห์",
    fields: [
      {
        name: "Content ต้นฉบับ",
        type: "Template",
        label: "เนื้อหาต้นฉบับ",
        allowCustom: true,
        options: ["บทความ Blog...", "โพสต์ Facebook...", "Script วิดีโอ...", "Email Newsletter..."]
      },
      {
        name: "แหล่งที่มา",
        type: "Pick",
        label: "แหล่งที่มาของข้อมูล",
        allowCustom: true,
        options: ["Blog/Website", "Facebook Post", "Instagram Caption", "YouTube Script", "Podcast Transcript", "Email", "Press Release", "Meeting Notes"]
      },
      {
        name: "Platform เป้าหมาย",
        type: "Multi",
        label: "Platform เป้าหมาย",
        options: ["Facebook Post", "Instagram Caption", "Instagram Story", "TikTok Script", "LinkedIn Post", "Twitter/X Thread", "LINE OA Broadcast", "YouTube Description", "Email Newsletter", "Blog Article"]
      },
      {
        name: "Tone",
        type: "Pick",
        label: "น้ำเสียง (Tone)",
        allowCustom: true,
        options: ["Professional", "Friendly/Casual", "Playful", "Urgent/FOMO", "Educational", "Inspirational", "Humorous", "Luxury/Premium"]
      },
      {
        name: "ภาษา",
        type: "Pick",
        label: "ภาษา",
        options: ["ไทย", "English", "ไทย-English Mix", "Formal Thai", "Casual Thai"]
      }
    ],
    template: `คุณคือ Content Strategist ที่เชี่ยวชาญการแปลง Content ข้าม Platform
Content ต้นฉบับ: [Content ต้นฉบับ] | แหล่งที่มา: [แหล่งที่มา] | Platform เป้าหมาย: [Platform เป้าหมาย] | Tone: [Tone] | ภาษา: [ภาษา]
แปลง Content สำหรับแต่ละ Platform:
1) ปรับความยาวและรูปแบบให้เหมาะแต่ละ Platform
2) ใส่ Hashtags / CTA ที่เหมาะสม
3) ปรับ Tone ตามที่กำหนด
4) เพิ่ม Hook ที่ดึงดูดสำหรับแต่ละ Platform
5) แนะนำเวลาโพสต์ที่ดีที่สุด`,
    afterCopyTip: "ใส่ข้อมูล target audience เพิ่มเพื่อให้ AI ปรับ Content ได้ตรงกลุ่มมากขึ้น"
  },
  {
    id: 4,
    iconName: 'Video',
    tag: "Converter",
    tagColor: "#ef4444",
    title: "Video Script Converter",
    oneLiner: "แปลงเนื้อหาให้เป็น Script วิดีโอ พร้อมถ่ายทำ",
    saved: "ประหยัด 2 ชม./วิดีโอ",
    badges: ['PRO'],
    fields: [
       {
        name: "เนื้อหา",
        type: "Template",
        label: "เนื้อหาหลัก",
        allowCustom: true,
        options: ["บทความสินค้า/บริการ...", "รีวิวจากลูกค้า...", "How-to / Tutorial...", "Behind the Scenes..."]
      },
      {
        name: "ประเภทวิดีโอ",
        type: "Pick",
        label: "ประเภทวิดีโอ",
        allowCustom: true,
        options: ["Product Review", "Tutorial/How-to", "Testimonial", "Behind the Scenes", "Unboxing", "Before & After", "Day in the Life", "Q&A", "Comparison", "Storytelling"]
      },
      {
        name: "ความยาว",
        type: "Pick",
        label: "ความยาววิดีโอ",
        options: ["15 วินาที (TikTok/Reels)", "30 วินาที (Ad)", "60 วินาที (Short)", "3 นาที (Standard)", "5-10 นาที (YouTube)", "10+ นาที (Long-form)"]
      },
      {
        name: "Platform",
        type: "Multi",
        label: "Platform ที่จะลง",
        options: ["TikTok", "Instagram Reels", "YouTube Shorts", "YouTube", "Facebook Video", "LINE VOOM"]
      },
      {
        name: "สไตล์",
        type: "Pick",
        label: "สไตล์การเล่าเรื่อง",
        allowCustom: true,
        options: ["Fast-paced/Energetic", "Calm/Cinematic", "Funny/Entertaining", "Professional/Corporate", "Raw/Authentic", "ASMR/Aesthetic"]
      },
      {
        name: "กลุ่มเป้าหมาย",
        type: "Pick",
        label: "กลุ่มเป้าหมาย",
        allowCustom: true,
        options: ["Gen Z (18-24)", "Millennials (25-34)", "Gen X (35-50)", "วัยทำงาน (25-45)", "ผู้บริหาร", "แม่บ้าน/พ่อบ้าน", "นักเรียน/นักศึกษา"]
      }
    ],
    template: `คุณคือ Video Content Creator & Script Writer มืออาชีพ
เนื้อหา: [เนื้อหา] | ประเภท: [ประเภทวิดีโอ] | ความยาว: [ความยาว] | Platform: [Platform] | สไตล์: [สไตล์] | กลุ่มเป้าหมาย: [กลุ่มเป้าหมาย]
สร้าง Video Script:
1) HOOK (3 วินาทีแรก — ดึงดูดให้หยุด scroll)
2) SCENE-BY-SCENE BREAKDOWN (Visual + Audio + Text Overlay)
3) CTA (Call to Action ปิดท้าย)
4) THUMBNAIL CONCEPT
5) CAPTION + HASHTAGS สำหรับแต่ละ Platform`,
    afterCopyTip: "เพิ่มข้อมูล brand voice หรือ reference วิดีโอที่ชอบ เพื่อให้ Script ตรงสไตล์มากขึ้น"
  },
  {
    id: 5,
    iconName: 'MessageCircle',
    tag: "LINE OA",
    tagColor: "#06c755",
    title: "LINE OA Broadcast",
    oneLiner: "แปลง Content ให้เป็น LINE Broadcast ที่กดซื้อ",
    saved: "ประหยัด 1 ชม./Broadcast",
    fields: [
      {
        name: "เนื้อหา",
        type: "Template",
        label: "เนื้อหาที่จะ Broadcast",
        allowCustom: true,
        options: ["โปรโมชัน/ส่วนลด...", "สินค้าใหม่...", "ข่าวสาร/อัพเดท...", "กิจกรรม/อีเวนท์..."]
      },
      {
        name: "ประเภท Broadcast",
        type: "Pick",
        label: "วัตถุประสงค์",
        allowCustom: true,
        options: ["โปรโมชัน/ส่วนลด", "สินค้าใหม่", "Content/Tips", "แจ้งข่าว/อัพเดท", "Abandoned Cart", "Birthday/Anniversary", "Seasonal/เทศกาล", "Survey/Feedback"]
      },
      {
        name: "เป้าหมาย",
        type: "Pick",
        label: "สิ่งที่อยากให้ลูกค้าทำ",
        allowCustom: true,
        options: ["เพิ่มยอดขาย", "กระตุ้นให้กลับมาซื้อ", "สร้าง Engagement", "เก็บ Data/Survey", "ดึงคนมาหน้าร้าน", "เพิ่มสมาชิก", "แนะนำสินค้า Cross-sell"]
      },
      {
        name: "Tone",
        type: "Pick",
        label: "น้ำเสียง (Tone)",
        allowCustom: true,
        options: ["Friendly สนิท", "Professional สุภาพ", "Urgent เร่งด่วน", "Exclusive พิเศษเฉพาะ", "Fun สนุกสนาน", "Caring ห่วงใย"]
      },
      {
        name: "Rich Menu/Coupon",
        type: "Pick",
        label: "ฟีเจอร์ที่ใช้ร่วม",
        allowCustom: true,
        options: ["มี Rich Menu (ลิงก์ไป)", "มี Coupon Code", "มี Reward Card", "ไม่มี / ข้อความอย่างเดียว"]
      }
    ],
    template: `คุณคือ LINE OA Marketing Expert ที่เชี่ยวชาญการสร้าง Broadcast ที่มี conversion สูง
เนื้อหา: [เนื้อหา] | ประเภท: [ประเภท Broadcast] | เป้าหมาย: [เป้าหมาย] | Tone: [Tone] | Rich Menu/Coupon: [Rich Menu/Coupon]
สร้าง LINE OA Broadcast 3 เวอร์ชัน:
VERSION A (สั้นกระชับ): 3-4 บรรทัด + CTA ชัด
VERSION B (เล่าเรื่อง): 5-7 บรรทัด + storytelling + CTA
VERSION C (Urgency): สร้าง FOMO + deadline + CTA เร่ง
แต่ละเวอร์ชันต้องมี: Emoji ที่เหมาะสม, CTA button text, เวลาส่งที่แนะนำ`,
    afterCopyTip: "ทดลองส่ง A/B Test สัก 2 เวอร์ชันเพื่อดูว่าแบบไหน Open Rate สูงกว่า"
  },
  {
    id: 6,
    iconName: 'Puzzle',
    tag: "RAG",
    tagColor: "#8b5cf6",
    title: "Product File to RAG",
    oneLiner: "แปลงข้อมูลสินค้าให้ AI Chatbot ตอบลูกค้าได้แม่น",
    saved: "ประหยัด 5 ชม./ครั้ง",
    fields: [
       {
        name: "ข้อมูลสินค้า",
        type: "Template",
        label: "ข้อมูลต้นฉบับ",
        allowCustom: true,
        options: ["รายละเอียดสินค้า + ราคา...", "FAQ คำถามที่พบบ่อย...", "นโยบาย (คืนสินค้า, จัดส่ง)...", "คู่มือการใช้งาน..."]
      },
      {
        name: "ประเภทข้อมูล",
        type: "Pick",
        label: "ประเภทเอกสาร",
        allowCustom: true,
        options: ["Product Catalog", "FAQ", "Policy (Return/Shipping/Warranty)", "User Manual", "Pricing Table", "Service Description", "Branch/Contact Info", "Promotion/Campaign"]
      },
      {
        name: "ใช้กับ",
        type: "Pick",
        label: "นำไปใช้กับระบบ",
        allowCustom: true,
        options: ["LINE OA Chatbot", "Website Chatbot", "Custom GPT", "Internal Knowledge Base", "Customer Service Agent", "Sales Assistant"]
      },
      {
        name: "จำนวน",
        type: "Pick",
        label: "ปริมาณข้อมูล",
        options: ["1-10 รายการ", "11-50 รายการ", "51-100 รายการ", "100+ รายการ", "ไม่จำกัด (เอกสารยาว)"]
      },
      {
        name: "ภาษา",
        type: "Pick",
        label: "ภาษาของ RAG",
        options: ["ไทย", "English", "ไทย-English Mix"]
      }
    ],
    template: `คุณคือ RAG & Knowledge Base Specialist ที่เชี่ยวชาญการจัดโครงสร้างข้อมูลสำหรับ AI Chatbot
ข้อมูล: [ข้อมูลสินค้า] | ประเภท: [ประเภทข้อมูล] | ใช้กับ: [ใช้กับ] | จำนวน: [จำนวน] | ภาษา: [ภาษา]
จัดโครงสร้างข้อมูลสำหรับ RAG System:
1) CHUNK STRUCTURE: แบ่งข้อมูลเป็น chunks ขนาดเหมาะสม (200-500 tokens/chunk)
2) METADATA TAGS: กำหนด tags สำหรับแต่ละ chunk (category, product_id, type)
3) Q&A PAIRS: สร้างคู่คำถาม-คำตอบจากข้อมูล (5-10 คู่ต่อ chunk)
4) EMBEDDING GUIDE: แนะนำวิธี embed + store ใน Vector DB
5) TEST QUERIES: ตัวอย่างคำถามเพื่อทดสอบ Chatbot`,
    afterCopyTip: "ยิ่งข้อมูลต้นฉบับละเอียด (ราคา, spec, เงื่อนไข) ยิ่งได้ Chunks ที่ AI ตอบได้แม่นยำ"
  }
];