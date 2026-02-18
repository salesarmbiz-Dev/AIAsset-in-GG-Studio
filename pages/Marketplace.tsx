import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Search, Filter, Star, Download, BadgeCheck } from 'lucide-react';
import { getListings } from '../lib/marketplaceService';
import { MarketplaceListing } from '../types';
import * as Icons from 'lucide-react';

const Marketplace = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
      getListings().then(setListings);
  }, []);

  const IconComponent = ({ name, className, size }: { name: string, className?: string, size?: number }) => {
      const LucideIcon = (Icons as any)[name];
      return LucideIcon ? <LucideIcon className={className} size={size} /> : <Icons.FileText className={className} size={size} />;
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 bg-[#011627] border-b border-[#05F2F2]/20 sticky top-0 z-40">
         <div className="flex items-center gap-2 mb-4">
             <Store className="text-[#F27405]" size={28} />
             <div>
                 <h1 className="text-2xl font-bold text-white leading-none">Marketplace</h1>
                 <p className="text-xs text-[#6593A6] mt-1">Fine-tune Prompts จาก Creator ชั้นนำ</p>
             </div>
         </div>

         {/* Search */}
         <div className="relative mb-4">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6593A6]" />
             <input 
               placeholder="ค้นหา Prompt..." 
               className="w-full bg-[#012840] rounded-xl pl-12 pr-4 py-3 text-white border border-white/10 focus:border-[#F27405] outline-none"
             />
         </div>

         {/* Filters */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {['All', 'Free', 'Business', 'Marketing', 'Creative'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setActiveFilter(f)}
                   className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                       activeFilter === f 
                       ? 'bg-[#F27405] text-white' 
                       : 'bg-[#012840] border border-white/10 text-[#6593A6]'
                   }`}
                 >
                     {f}
                 </button>
             ))}
         </div>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Featured Banner */}
          <div className="col-span-full bg-gradient-to-r from-[#FFD700]/20 to-[#F27405]/20 border border-[#FFD700]/50 rounded-2xl p-5 flex items-center justify-between mb-2">
              <div>
                  <div className="flex items-center gap-2 text-[#FFD700] font-bold text-sm mb-1">
                      <Icons.Award size={16} /> STAFF PICK
                  </div>
                  <h2 className="text-xl font-bold text-white">แม่ค้าออนไลน์ Starter Kit</h2>
                  <p className="text-white/80 text-sm">รวมทุก Prompt ที่คนขายของต้องมี</p>
              </div>
              <button 
                onClick={() => navigate('/marketplace/m1')}
                className="bg-[#FFD700] text-[#012840] px-4 py-2 rounded-lg font-bold shadow-lg"
              >
                  ดูเลย
              </button>
          </div>

          {listings.map(listing => (
              <div 
                key={listing.id}
                onClick={() => navigate(`/marketplace/${listing.id}`)}
                className="bg-[#011627] border border-white/5 rounded-2xl p-4 hover:border-[#05F2F2] transition-all cursor-pointer group"
              >
                  <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#012840] flex items-center justify-center text-[#05F2F2] border border-white/5 group-hover:bg-[#05F2F2] group-hover:text-[#012840] transition-colors">
                          <IconComponent name={listing.icon_name || 'FileText'} size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                          {listing.price === 0 ? (
                              <span className="text-[#58CC02] bg-[#58CC02]/10 px-2 py-1 rounded text-xs font-bold">FREE</span>
                          ) : (
                              <span className="text-[#F27405] bg-[#F27405]/10 px-2 py-1 rounded text-xs font-bold">฿{listing.price / 100}</span>
                          )}
                          <div className="flex items-center gap-1 text-[#FFD700] text-xs mt-1">
                              <Star size={10} fill="currentColor" /> {listing.rating}
                          </div>
                      </div>
                  </div>

                  <h3 className="text-white font-bold text-lg leading-tight mb-1">{listing.title}</h3>
                  <p className="text-[#6593A6] text-sm line-clamp-2 mb-4 h-10">{listing.preview_description}</p>

                  <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#6593A6] flex items-center justify-center text-[#012840] font-bold text-xs">
                              {listing.creator_avatar}
                          </div>
                          <span className="text-[#6593A6] text-xs flex items-center gap-1">
                              {listing.creator_name} <BadgeCheck size={12} className="text-[#05F2F2]" />
                          </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6593A6] text-xs">
                          <Download size={12} /> {listing.downloads}
                      </div>
                  </div>
              </div>
          ))}
      </main>
    </div>
  );
};

export default Marketplace;