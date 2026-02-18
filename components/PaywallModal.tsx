import React from 'react';
import { Lock, Crown, Star, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, title = "จำกัดสิทธิ์การใช้งาน" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-[#012840]/90 backdrop-blur-md anim-fadeSlideUp">
      <div className="w-full sm:max-w-md bg-[#011627] border-t sm:border border-[#05F2F2]/30 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl h-[85vh] sm:h-auto overflow-y-auto relative flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6593A6] hover:text-white p-2"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8 mt-4">
           <div className="w-20 h-20 rounded-full bg-[#F27405]/10 flex items-center justify-center mb-4 border border-[#F27405]/30">
              <Lock size={40} className="text-[#F27405]" />
           </div>
           <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
           <p className="text-[#6593A6] text-center">อัพเกรดแพ็กเกจเพื่อใช้งานฟีเจอร์นี้ได้ทันที</p>
        </div>

        <div className="space-y-4 flex-1">
           {/* Member Card */}
           <div className="bg-[#012840] border border-[#F27405] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#F27405] text-white text-[10px] px-2 py-1 font-bold rounded-bl-lg">RECOMMENDED</div>
              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                    <Star size={20} className="text-[#F27405] fill-[#F27405]" />
                    <span className="font-bold text-lg text-white">Member</span>
                 </div>
                 <span className="text-xl font-bold text-[#F27405]">฿199<span className="text-sm text-[#6593A6] font-normal">/mo</span></span>
              </div>
              <ul className="text-sm text-[#6593A6] space-y-1 mb-4">
                 <li className="flex gap-2"><Check size={14} className="text-[#58CC02]"/> ใช้ Asset Prompts ไม่จำกัด</li>
                 <li className="flex gap-2"><Check size={14} className="text-[#58CC02]"/> Fine-tune 10 ครั้ง/วัน</li>
              </ul>
              <button className="w-full py-3 bg-[#F27405] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">สมัคร Member</button>
           </div>

           {/* Pro Card */}
           <div className="bg-[#012840] border border-[#FFD700] rounded-xl p-5 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                    <Crown size={20} className="text-[#FFD700] fill-[#FFD700]" />
                    <span className="font-bold text-lg text-white">Pro</span>
                 </div>
                 <span className="text-xl font-bold text-[#FFD700]">฿499<span className="text-sm text-[#6593A6] font-normal">/mo</span></span>
              </div>
              <ul className="text-sm text-[#6593A6] space-y-1 mb-4">
                 <li className="flex gap-2"><Check size={14} className="text-[#58CC02]"/> ทุกฟีเจอร์ของ Member</li>
                 <li className="flex gap-2"><Check size={14} className="text-[#58CC02]"/> Fine-tune ไม่จำกัด</li>
                 <li className="flex gap-2"><Check size={14} className="text-[#58CC02]"/> เข้าถึง Pro-only Assets</li>
              </ul>
              <button className="w-full py-3 bg-transparent border border-[#FFD700] text-[#FFD700] font-bold rounded-lg hover:bg-[#FFD700]/10 transition-all">สมัคร Pro</button>
           </div>
        </div>

        <div className="mt-6 text-center">
           <button onClick={onClose} className="text-[#6593A6] underline">ไว้คราวหลัง</button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
