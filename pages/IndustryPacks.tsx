import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Utensils, Stethoscope, ShoppingBag, GraduationCap, ArrowRight } from 'lucide-react';
import { getIndustryPacks } from '../lib/industryService';
import { IndustryPack } from '../types';
import * as Icons from 'lucide-react';

const IndustryPacks = () => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<IndustryPack[]>([]);

  useEffect(() => {
      getIndustryPacks().then(setPacks);
  }, []);

  const IconComponent = ({ name, className, size }: { name: string, className?: string, size?: number }) => {
      const LucideIcon = (Icons as any)[name];
      return LucideIcon ? <LucideIcon className={className} size={size} /> : <Package className={className} size={size} />;
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
         <div className="flex items-center gap-2">
             <Package className="text-[#8B5CF6]" size={28} />
             <div>
                 <h1 className="text-2xl font-bold text-white leading-none">Industry Packs</h1>
                 <p className="text-xs text-[#6593A6] mt-1">มัดรวมเครื่องมือ AI เฉพาะทางธุรกิจคุณ</p>
             </div>
         </div>
      </header>

      <main className="p-4 space-y-4">
          {packs.map(pack => (
              <div 
                key={pack.id}
                onClick={() => navigate(`/packs/${pack.slug}`)}
                className="relative overflow-hidden rounded-2xl border border-white/10 group cursor-pointer"
              >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${pack.cover_color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  
                  <div className="relative p-6">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pack.cover_color} flex items-center justify-center text-white shadow-lg`}>
                              <IconComponent name={pack.icon_name} size={28} />
                          </div>
                          <div className="bg-[#012840]/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-white text-xs font-bold uppercase">
                              {pack.tier_required} Only
                          </div>
                      </div>

                      <h2 className="text-2xl font-bold text-white mb-2">{pack.name}</h2>
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">{pack.description}</p>

                      <div className="flex items-center gap-2 text-white/60 text-xs">
                          <span className="bg-white/10 px-2 py-1 rounded">{pack.included_assets.length} Assets</span>
                          <span className="bg-white/10 px-2 py-1 rounded">{pack.included_fine_tunes.length} Fine-tunes</span>
                      </div>
                  </div>
                  
                  {/* Arrow Decoration */}
                  <div className="absolute bottom-4 right-4 text-white/50 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={24} />
                  </div>
              </div>
          ))}
      </main>
    </div>
  );
};

export default IndustryPacks;