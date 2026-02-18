import React from 'react';
import { Check, Edit, PenLine, X } from 'lucide-react';
import { submitFeedback } from '../lib/analyticsService';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackSheetProps {
  isOpen: boolean;
  onClose: () => void;
  usageId?: string;
  usageType: 'asset' | 'fine_tune';
}

const FeedbackSheet: React.FC<FeedbackSheetProps> = ({ isOpen, onClose, usageId, usageType }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleFeedback = async (status: any) => {
      if (user && usageId) {
          await submitFeedback(usageId, usageType, user.id, status);
      }
      // Show toast or thank you (mock)
      onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-[#011627] rounded-t-2xl border-t border-[#05F2F2]/30 z-[110] anim-slideUp p-6">
         <h3 className="text-xl font-bold text-white mb-4 text-center">ใช้ Output นี้ยังไง?</h3>
         
         <div className="grid grid-cols-2 gap-3 mb-4">
             <button onClick={() => handleFeedback('used_as_is')} className="flex flex-col items-center justify-center gap-2 bg-[#58CC02]/10 border border-[#58CC02]/30 p-4 rounded-xl hover:bg-[#58CC02]/20 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-[#58CC02]/20 flex items-center justify-center text-[#58CC02]"><Check size={20}/></div>
                 <span className="text-white text-sm font-bold">ใช้เลย ไม่แก้</span>
             </button>
             <button onClick={() => handleFeedback('edited_minor')} className="flex flex-col items-center justify-center gap-2 bg-[#05F2F2]/10 border border-[#05F2F2]/30 p-4 rounded-xl hover:bg-[#05F2F2]/20 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-[#05F2F2]/20 flex items-center justify-center text-[#05F2F2]"><Edit size={20}/></div>
                 <span className="text-white text-sm font-bold">แก้เล็กน้อย</span>
             </button>
             <button onClick={() => handleFeedback('edited_major')} className="flex flex-col items-center justify-center gap-2 bg-[#F27405]/10 border border-[#F27405]/30 p-4 rounded-xl hover:bg-[#F27405]/20 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-[#F27405]/20 flex items-center justify-center text-[#F27405]"><PenLine size={20}/></div>
                 <span className="text-white text-sm font-bold">แก้เยอะ</span>
             </button>
             <button onClick={() => handleFeedback('not_used')} className="flex flex-col items-center justify-center gap-2 bg-[#012840] border border-white/10 p-4 rounded-xl hover:border-white/30 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#6593A6]"><X size={20}/></div>
                 <span className="text-[#6593A6] text-sm font-bold">ยังไม่ได้ใช้</span>
             </button>
         </div>

         <button onClick={onClose} className="w-full py-3 text-[#6593A6] text-sm underline">ข้ามไปก่อน</button>
      </div>
    </>
  );
};

export default FeedbackSheet;
