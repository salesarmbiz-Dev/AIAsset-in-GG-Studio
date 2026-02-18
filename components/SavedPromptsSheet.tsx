import React from 'react';
import { SavedPrompt } from '../types';
import { X, Search, Clock, ArrowRight } from 'lucide-react';

interface SavedPromptsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts: SavedPrompt[];
  onSelect: (prompt: SavedPrompt) => void;
}

const SavedPromptsSheet: React.FC<SavedPromptsSheetProps> = ({ isOpen, onClose, savedPrompts, onSelect }) => {
  const [search, setSearch] = React.useState('');
  
  if (!isOpen) return null;

  const filtered = savedPrompts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-[#011627] rounded-t-2xl border-t border-[#05F2F2]/30 z-[70] anim-slideUp max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#011627] rounded-t-2xl z-10">
           <h3 className="text-lg font-bold text-white">เลือก Prompt ที่บันทึกไว้</h3>
           <button onClick={onClose} className="p-2 text-[#6593A6]"><X size={24} /></button>
        </div>
        
        <div className="p-4 bg-[#011627]">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6593A6]" size={18} />
              <input 
                 type="text" 
                 placeholder="ค้นหา..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-[#012840] rounded-xl pl-10 pr-4 py-3 text-white border border-white/10 focus:border-[#05F2F2] outline-none"
              />
           </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 pb-8">
           {filtered.length === 0 ? (
              <div className="text-center text-[#6593A6] py-8">ไม่พบ Prompt ที่ค้นหา</div>
           ) : (
              filtered.map(prompt => (
                 <button 
                   key={prompt.id}
                   onClick={() => onSelect(prompt)}
                   className="w-full text-left bg-[#012840] border border-white/5 p-4 rounded-xl hover:border-[#05F2F2] hover:bg-[#05F2F2]/5 transition-all group"
                 >
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="font-bold text-white text-[16px] mb-1">{prompt.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-[#6593A6]">
                             <Clock size={12} />
                             {new Date(prompt.created_at || Date.now()).toLocaleDateString('th-TH')}
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-[#05F2F2]/10 flex items-center justify-center text-[#05F2F2] group-hover:bg-[#05F2F2] group-hover:text-[#012840] transition-colors">
                          <ArrowRight size={16} />
                       </div>
                    </div>
                 </button>
              ))
           )}
        </div>
      </div>
    </>
  );
};

export default SavedPromptsSheet;
