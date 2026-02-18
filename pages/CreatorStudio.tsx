import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Sliders, Zap, FileText } from 'lucide-react';

const CreatorStudio = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#012840] p-4 pb-20">
      <header className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-[#FFD700] fill-[#FFD700]" /> Creator Studio
        </h1>
      </header>

      <div className="grid gap-6">
        
        {/* Create Asset */}
        <button 
          onClick={() => navigate('/create-asset')}
          className="bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6 text-left group hover:border-[#05F2F2] transition-all"
        >
           <div className="w-12 h-12 rounded-full bg-[#05F2F2]/10 flex items-center justify-center text-[#05F2F2] mb-4 group-hover:bg-[#05F2F2] group-hover:text-[#012840] transition-colors">
              <FileText size={24} />
           </div>
           <h3 className="text-lg font-bold text-white mb-1">Create New Asset</h3>
           <p className="text-[#6593A6] text-sm">สร้าง Asset Template ใหม่เพื่อแชร์ให้ชุมชน</p>
        </button>

        {/* Create Fine-Tune */}
        <button 
          onClick={() => navigate('/create-finetune')}
          className="bg-[#011627] border border-[#8B5CF6]/30 rounded-2xl p-6 text-left group hover:border-[#8B5CF6] transition-all"
        >
           <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-4 group-hover:bg-[#8B5CF6] group-hover:text-[#012840] transition-colors">
              <Sliders size={24} />
           </div>
           <h3 className="text-lg font-bold text-white mb-1">Create Personal Fine-tune</h3>
           <p className="text-[#6593A6] text-sm">สร้าง AI Tool ส่วนตัวด้วย Prompt & Controls ของคุณเอง</p>
        </button>

      </div>
    </div>
  );
};

export default CreatorStudio;
