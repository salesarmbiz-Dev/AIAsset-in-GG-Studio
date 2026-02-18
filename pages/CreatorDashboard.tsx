import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Download, Star, FileText, Plus } from 'lucide-react';

const CreatorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#012840] p-4 pb-20">
      <header className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-xl font-bold text-white">Creator Dashboard</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#011627] p-4 rounded-xl border border-[#FFD700]/30">
              <div className="text-[#6593A6] text-xs flex items-center gap-1 mb-1"><Wallet size={12}/> Total Revenue</div>
              <div className="text-2xl font-bold text-[#FFD700]">฿12,500</div>
          </div>
          <div className="bg-[#011627] p-4 rounded-xl border border-[#05F2F2]/30">
              <div className="text-[#6593A6] text-xs flex items-center gap-1 mb-1"><Download size={12}/> Downloads</div>
              <div className="text-2xl font-bold text-[#05F2F2]">1,240</div>
          </div>
          <div className="bg-[#011627] p-4 rounded-xl border border-white/10">
              <div className="text-[#6593A6] text-xs flex items-center gap-1 mb-1"><Star size={12}/> Avg Rating</div>
              <div className="text-2xl font-bold text-white">4.8</div>
          </div>
          <div className="bg-[#011627] p-4 rounded-xl border border-[#F27405]/30">
              <div className="text-[#6593A6] text-xs flex items-center gap-1 mb-1"><FileText size={12}/> Active Listings</div>
              <div className="text-2xl font-bold text-[#F27405]">3</div>
          </div>
      </div>

      <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-lg">My Listings</h2>
          <button className="text-[#F27405] text-sm flex items-center gap-1 font-bold">
              <Plus size={16}/> New Listing
          </button>
      </div>

      <div className="space-y-3">
          {/* Mock Listing Item */}
          <div className="bg-[#011627] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                  <h3 className="text-white font-bold">Clinic Video Script</h3>
                  <div className="flex gap-2 text-xs text-[#6593A6]">
                      <span>฿299</span> • <span>320 Sales</span>
                  </div>
              </div>
              <span className="bg-[#58CC02]/20 text-[#58CC02] text-xs px-2 py-1 rounded font-bold">Active</span>
          </div>
          <div className="bg-[#011627] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                  <h3 className="text-white font-bold">Email Template Pack</h3>
                  <div className="flex gap-2 text-xs text-[#6593A6]">
                      <span>Free</span> • <span>850 Sales</span>
                  </div>
              </div>
              <span className="bg-[#58CC02]/20 text-[#58CC02] text-xs px-2 py-1 rounded font-bold">Active</span>
          </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
