import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Crown } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#012840] pb-20">
      <header className="p-4 flex items-center gap-2 sticky top-0 bg-[#012840]/90 backdrop-blur z-50">
        <button onClick={() => navigate(-1)} className="p-2"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white">เลือกแพ็กเกจ</h1>
      </header>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        
        {/* Free */}
        <div className="bg-[#012840]/50 border border-[#05F2F2]/30 rounded-2xl p-6">
           <h3 className="text-xl font-bold text-[#05F2F2] mb-2">Free</h3>
           <p className="text-[#6593A6] mb-4">เริ่มต้นใช้งานทั่วไป</p>
           <div className="text-3xl font-bold text-white mb-6">฿0</div>
           <ul className="space-y-3 mb-6 text-white/80">
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> Asset Prompts 2 ตัว/วัน</li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> ดูตัวอย่าง Fine-tune</li>
           </ul>
           <button className="w-full py-3 border border-[#05F2F2] text-[#05F2F2] rounded-xl font-bold">ใช้งานฟรี</button>
        </div>

        {/* Member */}
        <div className="bg-[#012840] border-2 border-[#F27405] rounded-2xl p-6 relative shadow-[0_0_30px_rgba(242,116,5,0.2)] scale-105">
           <div className="absolute top-0 right-0 bg-[#F27405] text-white px-3 py-1 font-bold rounded-bl-xl text-sm">แนะนำ</div>
           <div className="flex items-center gap-2 mb-2">
              <Star className="text-[#F27405] fill-[#F27405]" size={24}/>
              <h3 className="text-2xl font-bold text-white">Member</h3>
           </div>
           <p className="text-[#6593A6] mb-4">สำหรับคนทำ Content มือโปร</p>
           <div className="text-4xl font-bold text-[#F27405] mb-6">฿199<span className="text-lg text-[#6593A6] font-normal">/เดือน</span></div>
           <ul className="space-y-3 mb-8 text-white">
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> <b>Asset Prompts ไม่จำกัด</b></li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> Fine-tune 10 ครั้ง/วัน</li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> Save Prompt 10 ชุด</li>
           </ul>
           <button className="w-full py-4 bg-[#F27405] text-white rounded-xl font-bold text-lg shadow-lg">สมัคร Member</button>
        </div>

        {/* Pro */}
        <div className="bg-[#012840]/50 border border-[#FFD700] rounded-2xl p-6 relative overflow-hidden">
           <div className="flex items-center gap-2 mb-2">
              <Crown className="text-[#FFD700] fill-[#FFD700]" size={24}/>
              <h3 className="text-2xl font-bold text-white">Pro</h3>
           </div>
           <p className="text-[#6593A6] mb-4">สำหรับ Agency & Business</p>
           <div className="text-4xl font-bold text-[#FFD700] mb-6">฿499<span className="text-lg text-[#6593A6] font-normal">/เดือน</span></div>
           <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> ทุกอย่างใน Member</li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> <b>Fine-tune ไม่จำกัด</b></li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> Pro-only Assets</li>
              <li className="flex gap-2"><Check className="text-[#58CC02]" size={20}/> Save ไม่จำกัด</li>
           </ul>
           <button className="w-full py-3 border border-[#FFD700] text-[#FFD700] rounded-xl font-bold">สมัคร Pro</button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
