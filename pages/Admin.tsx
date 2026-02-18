import React, { useEffect, useState } from 'react';
import { Sliders, Plus, Users, BarChart, DollarSign, TrendingUp, Copy, Heart, Save } from 'lucide-react';
import { getAdminStats } from '../lib/analytics';

// Simple CSS-only Chart Components
const BarChartComponent: React.FC<{ data: any[], dataKey: string, labelKey: string, color: string }> = ({ data, dataKey, labelKey, color }) => {
    const maxVal = Math.max(...data.map(d => d[dataKey]));
    return (
        <div className="flex items-end gap-2 h-32 pt-4">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                        className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 relative"
                        style={{ height: `${(d[dataKey] / maxVal) * 100}%`, backgroundColor: color }}
                    >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#011627] text-white text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d[dataKey]}
                         </div>
                    </div>
                    <span className="text-[10px] text-[#6593A6] truncate w-full text-center">{d[labelKey].split(' ')[0]}</span>
                </div>
            ))}
        </div>
    );
};

const Admin = () => {
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'finetune'>('overview');

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return <div className="p-8 text-white">Loading Stats...</div>;

  return (
    <div className="min-h-screen bg-[#012840] p-6 pb-20">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sliders className="text-[#F27405]" /> Admin Dashboard
        </h1>
        <button className="bg-[#F27405] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
          <Plus size={20} /> New Asset
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-[#011627] border border-[#05F2F2]/30 p-4 rounded-xl">
            <h3 className="text-[#6593A6] text-sm flex items-center gap-2"><Copy size={14}/> Total Copies</h3>
            <div className="text-2xl font-bold text-white">{stats.total_copies}</div>
         </div>
         <div className="bg-[#011627] border border-[#F27405]/30 p-4 rounded-xl">
            <h3 className="text-[#6593A6] text-sm flex items-center gap-2"><TrendingUp size={14}/> Generates</h3>
            <div className="text-2xl font-bold text-white">{stats.total_generates}</div>
         </div>
         <div className="bg-[#011627] border border-[#8B5CF6]/30 p-4 rounded-xl">
            <h3 className="text-[#6593A6] text-sm flex items-center gap-2"><Users size={14}/> Active Users</h3>
            <div className="text-2xl font-bold text-white">{stats.active_users}</div>
         </div>
         <div className="bg-[#011627] border border-[#58CC02]/30 p-4 rounded-xl">
            <h3 className="text-[#6593A6] text-sm flex items-center gap-2"><DollarSign size={14}/> MRR (Est.)</h3>
            <div className="text-2xl font-bold text-[#58CC02]">฿{stats.mrr.toLocaleString()}</div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-6">
          {['overview', 'assets', 'finetune'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 px-2 text-sm font-bold capitalize ${activeTab === tab ? 'text-[#05F2F2] border-b-2 border-[#05F2F2]' : 'text-[#6593A6]'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
         {/* Asset Performance */}
         {activeTab === 'overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#011627] rounded-xl p-5 border border-white/5">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Copy className="text-[#F27405]" size={18}/> Top Copied Assets</h3>
                    <BarChartComponent data={stats.asset_performance} dataKey="copies" labelKey="name" color="#F27405" />
                </div>
                <div className="bg-[#011627] rounded-xl p-5 border border-white/5">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Save className="text-[#05F2F2]" size={18}/> Top Saved Assets</h3>
                    <BarChartComponent data={stats.asset_performance} dataKey="saves" labelKey="name" color="#05F2F2" />
                </div>
             </div>
         )}

         {activeTab === 'finetune' && (
             <div className="bg-[#011627] rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-bold mb-4">Fine-tune Generation Volume</h3>
                <BarChartComponent data={stats.fine_tune_usage} dataKey="generates" labelKey="name" color="#8B5CF6" />
                <div className="mt-4 space-y-2">
                    {stats.fine_tune_usage.map((ft: any) => (
                        <div key={ft.name} className="flex justify-between text-sm border-b border-white/5 pb-2">
                            <span className="text-white">{ft.name}</span>
                            <div className="flex gap-4">
                                <span className="text-[#6593A6]">{ft.generates} Gens</span>
                                <span className="text-[#FFD700]">★ {ft.avg_score}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default Admin;
