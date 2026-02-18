import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, purchaseListing } from '../lib/marketplaceService';
import { MarketplaceListing } from '../types';
import { ArrowLeft, Star, Download, BadgeCheck, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<MarketplaceListing | undefined>();
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
      if (id) getListingById(id).then(setListing);
  }, [id]);

  if (!listing) return <div className="p-8 text-white">Loading...</div>;

  const handlePurchase = async () => {
      if (!user) {
          alert("Please login first");
          return;
      }
      if (listing.price === 0) {
          alert("Added to your library!");
          navigate('/fine-tune/' + listing.fine_tune_id);
          return;
      }

      setPurchasing(true);
      await purchaseListing(listing.id, user.id);
      setPurchasing(false);
      alert("Purchase Successful! 🎉");
      navigate('/fine-tune/' + listing.fine_tune_id);
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-32">
       <header className="p-4 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 flex justify-between items-center border-b border-white/5">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
           <div className="flex gap-3">
               {/* Share button could go here */}
           </div>
       </header>

       <main className="p-4 max-w-2xl mx-auto">
           {/* Listing Header */}
           <div className="mb-6">
               <div className="flex gap-2 mb-2">
                   {listing.tags.map(tag => (
                       <span key={tag} className="text-[#05F2F2] bg-[#05F2F2]/10 px-2 py-0.5 rounded text-xs font-bold">{tag}</span>
                   ))}
               </div>
               <h1 className="text-2xl font-bold text-white mb-2">{listing.title}</h1>
               
               <div className="flex items-center gap-4 text-sm mb-4">
                   <div className="flex items-center gap-1 text-[#FFD700]">
                       <Star size={16} fill="currentColor" /> 
                       <span className="font-bold">{listing.rating}</span> 
                       <span className="text-[#6593A6]">({listing.review_count} reviews)</span>
                   </div>
                   <div className="flex items-center gap-1 text-[#6593A6]">
                       <Download size={16} /> {listing.downloads} downloads
                   </div>
               </div>

               <div className="flex items-center gap-3 p-3 bg-[#011627] rounded-xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-[#6593A6] flex items-center justify-center text-[#012840] font-bold">
                       {listing.creator_avatar}
                   </div>
                   <div>
                       <div className="text-white font-bold text-sm flex items-center gap-1">
                           {listing.creator_name} <BadgeCheck size={14} className="text-[#05F2F2]" />
                       </div>
                       <div className="text-[#6593A6] text-xs">Verified Creator</div>
                   </div>
               </div>
           </div>

           {/* Preview / Description */}
           <div className="space-y-6">
               <div className="bg-[#011627] rounded-2xl p-5 border border-white/10">
                   <h3 className="text-white font-bold mb-3">About this Prompt</h3>
                   <p className="text-[#6593A6] leading-relaxed">
                       {listing.preview_description}
                       <br/><br/>
                       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                   </p>
               </div>

               {/* Example Output */}
               <div className="bg-[#011627] rounded-2xl p-5 border border-white/10">
                   <h3 className="text-white font-bold mb-3">Example Output</h3>
                   <div className="bg-[#012840] p-4 rounded-xl border border-white/5 font-mono text-sm text-white/80">
                       [AI Generated Content Preview]
                       <br/>
                       Headline: Boost your sales 300%
                       <br/>
                       Body: Are you struggling with...
                   </div>
               </div>

               <div className="flex items-center gap-2 justify-center text-[#58CC02] text-sm">
                   <ShieldCheck size={16} /> 7-Day Money Back Guarantee
               </div>
           </div>
       </main>

       {/* Sticky Purchase Bar */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#011627] border-t border-white/10 z-50">
           <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
               <div className="flex flex-col">
                   <span className="text-[#6593A6] text-xs">Total Price</span>
                   <span className="text-2xl font-bold text-white">
                       {listing.price === 0 ? 'Free' : `฿${listing.price / 100}`}
                   </span>
               </div>
               <button 
                 onClick={handlePurchase}
                 disabled={purchasing}
                 className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
                     listing.price === 0 
                     ? 'bg-[#58CC02] text-white' 
                     : 'bg-[#F27405] text-white'
                 }`}
               >
                   {purchasing ? 'Processing...' : (listing.price === 0 ? 'Add to Library' : 'Buy Now')}
               </button>
           </div>
       </div>
    </div>
  );
};

export default ListingDetail;
