import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '../constants';
import { Repeat, ArrowRight, X } from 'lucide-react';

interface RemixSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sourceContent: string;
  sourceTitle: string;
}

const RemixSheet: React.FC<RemixSheetProps> = ({ isOpen, onClose, sourceContent, sourceTitle }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Filter compatible assets (exclude Image generators usually, but for now allow all text-based)
  const compatibleAssets = ASSETS.filter(a => 
    a.tag !== 'Image' && // Exclude image generators as destinations for now
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (assetId: number) => {
    navigate(`/asset/${assetId}`, { 
      state: { 
        remixContent: sourceContent, 
        remixSource: sourceTitle 
      } 
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-[#011627] rounded-t-2xl border-t border-[#05F2F2]/30 z-[110] anim-slideUp max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-white/10 sticky top-0 bg-[#011627] rounded-t-2xl z-10 flex justify-between items-center">
           <div>
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <Repeat className="text-[#05F2F2]" /> Remix Output
             </h3>
             <p className="text-[#6593A6] text-sm">ส่งผลลัพธ์นี้ไปเป็น Input ของเครื่องมืออื่น</p>
           </div>
           <button onClick={onClose} className="p-2 text-[#6593A6] hover:text-white"><X size={24}/></button>
        </div>

        <div className="p-4 overflow-y-auto pb-10">
           <input 
             type="text" 
             placeholder="ค้นหาเครื่องมือปลายทาง..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-[#012840] border border-white/10 rounded-xl p-3 text-white mb-4 focus:border-[#05F2F2] outline-none"
           />

           <div className="space-y-3">
              {compatibleAssets.map(asset => (
                 <button 
                   key={asset.id}
                   onClick={() => handleSelect(asset.id)}
                   className="w-full bg-[#012840] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-[#05F2F2] hover:bg-[#05F2F2]/5 transition-all group"
                 >
                    <div className="text-left">
                       <h4 className="font-bold text-white text-[16px]">{asset.title}</h4>
                       <p className="text-xs text-[#6593A6] line-clamp-1">{asset.oneLiner}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#05F2F2]/10 flex items-center justify-center text-[#05F2F2] group-hover:bg-[#05F2F2] group-hover:text-[#012840]">
                       <ArrowRight size={16} />
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default RemixSheet;
