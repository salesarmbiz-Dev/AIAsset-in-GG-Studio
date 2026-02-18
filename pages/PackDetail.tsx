import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackBySlug } from '../lib/industryService';
import { IndustryPack } from '../types';
import { ASSETS } from '../constants';
import { ArrowLeft, CheckCircle, Lock, Crown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PackDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pack, setPack] = useState<IndustryPack | undefined>();

  useEffect(() => {
      if (slug) getPackBySlug(slug).then(setPack);
  }, [slug]);

  if (!pack) return <div className="p-8 text-white">Loading...</div>;

  const IconComponent = ({ name, className, size }: { name: string, className?: string, size?: number }) => {
      const LucideIcon = (Icons as any)[name];
      return LucideIcon ? <LucideIcon className={className} size={size} /> : <Icons.Package className={className} size={size} />;
  };

  const handleAccess = () => {
      // Logic to check subscription
      alert("Access Granted (Mock)");
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-32">
        {/* Hero Header */}
        <div className={`relative pt-12 pb-8 px-6 bg-gradient-to-br ${pack.cover_color}`}>
            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/20 rounded-full text-white backdrop-blur"><ArrowLeft size={24}/></button>
            
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white mb-6 shadow-2xl">
                <IconComponent name={pack.icon_name} size={40} />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{pack.name}</h1>
            <p className="text-white/90 text-lg leading-relaxed">{pack.description}</p>
        </div>

        <main className="p-6 -mt-4 bg-[#012840] rounded-t-3xl relative z-10">
            {/* Items List */}
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">Included Items</h3>
            <div className="space-y-4">
                {pack.included_assets.map(assetId => {
                    const asset = ASSETS.find(a => a.id === assetId);
                    return (
                        <div 
                          key={assetId}
                          onClick={() => navigate(`/asset/${assetId}`, { state: { packMode: true, industry: pack.industry_type } })}
                          className="bg-[#011627] border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-[#05F2F2] cursor-pointer group"
                        >
                            <div className="w-12 h-12 bg-[#012840] rounded-lg flex items-center justify-center text-[#05F2F2] border border-white/5">
                                <IconComponent name={asset?.iconName || 'FileText'} size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold flex items-center gap-2">
                                    {asset?.title}
                                    <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">Tuned</span>
                                </h4>
                                <p className="text-[#6593A6] text-xs line-clamp-1">{asset?.oneLiner}</p>
                            </div>
                            <ArrowLeft size={16} className="text-[#6593A6] rotate-180 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    );
                })}
            </div>

            {/* Benefit List */}
            <div className="mt-8 bg-[#011627] rounded-2xl p-6 border border-white/5">
                <h3 className="text-white font-bold mb-4">Why this pack?</h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-[#6593A6] text-sm">
                        <CheckCircle className="text-[#58CC02] flex-shrink-0" size={18} />
                        Prompt ถูกจูนมาสำหรับธุรกิจ {pack.industry_type} โดยเฉพาะ
                    </li>
                    <li className="flex gap-3 text-[#6593A6] text-sm">
                        <CheckCircle className="text-[#58CC02] flex-shrink-0" size={18} />
                        ลดเวลาปรับแต่งเองกว่า 50 ชม.
                    </li>
                    <li className="flex gap-3 text-[#6593A6] text-sm">
                        <CheckCircle className="text-[#58CC02] flex-shrink-0" size={18} />
                        รวมเครื่องมือที่จำเป็นต้องใช้ไว้ให้แล้ว
                    </li>
                </ul>
            </div>
        </main>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#011627] border-t border-white/10 z-50">
           <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
               <div className="flex flex-col">
                   <span className="text-[#6593A6] text-xs">Price</span>
                   <span className="text-2xl font-bold text-white">
                       ฿{pack.price / 100}
                   </span>
               </div>
               <button 
                 onClick={handleAccess}
                 className="flex-1 py-4 bg-[#FFD700] text-[#012840] font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
               >
                   <Crown size={20} /> Get Access (Pro)
               </button>
           </div>
        </div>
    </div>
  );
};

export default PackDetail;