import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { joinWorkshop, getWorkshopSubmissions } from '../lib/teamService';
import { Workshop, WorkshopSubmission } from '../types';
import { ASSETS } from '../constants';
import { CheckCircle, Clock, Play, Circle } from 'lucide-react';

const WorkshopLive = () => {
  const { code } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [submissions, setSubmissions] = useState<WorkshopSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (code && user) {
          loadWorkshop();
      }
  }, [code, user]);

  const loadWorkshop = async () => {
      const ws = await joinWorkshop(code!);
      if (ws) {
          setWorkshop(ws);
          // Load submissions (Simulated Realtime)
          getWorkshopSubmissions(ws.id).then(setSubmissions);
      }
      setLoading(false);
  };

  if (loading) return <div className="p-8 text-white text-center">Joining Workshop...</div>;
  if (!workshop) return <div className="p-8 text-white text-center">Workshop Not Found</div>;

  const isFacilitator = user?.id === workshop.facilitator_id; // Need to fetch facilitator_id correctly in real app

  // Logic to determine task status
  const getTaskStatus = (assetId: number) => {
      const sub = submissions.find(s => s.user_id === user?.id && s.source_id === String(assetId));
      return sub ? 'completed' : 'pending';
  };

  const completedCount = workshop.assigned_assets.filter(id => getTaskStatus(id) === 'completed').length;
  const totalCount = workshop.assigned_assets.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-[#012840] pb-20">
       <div className="bg-[#F27405] p-2 text-center text-white text-xs font-bold uppercase tracking-widest sticky top-0 z-50">
           🔴 LIVE WORKSHOP
       </div>

       <div className="p-4">
           <div className="bg-[#011627] border border-[#F27405]/50 rounded-2xl p-6 mb-6">
               <h1 className="text-2xl font-bold text-white mb-2">{workshop.title}</h1>
               <div className="flex items-center gap-4 text-sm text-[#6593A6] mb-4">
                   <span className="flex items-center gap-1"><Clock size={14} /> Started 14:00</span>
                   <span className="flex items-center gap-1 text-[#58CC02]"><Play size={14} /> Running</span>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-[#012840] h-3 rounded-full overflow-hidden mb-1">
                   <div className="h-full bg-[#F27405] transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
               <div className="text-right text-xs text-[#F27405] font-bold">{completedCount}/{totalCount} Tasks Completed</div>
           </div>

           <h2 className="text-white font-bold text-lg mb-4">Your Tasks</h2>
           <div className="space-y-3">
               {workshop.assigned_assets.map((assetId, index) => {
                   const asset = ASSETS.find(a => a.id === assetId);
                   const status = getTaskStatus(assetId);

                   return (
                       <button 
                         key={assetId}
                         onClick={() => navigate(`/asset/${assetId}`, { state: { workshopId: workshop.id } })}
                         className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all ${
                             status === 'completed' 
                             ? 'bg-[#58CC02]/10 border-[#58CC02]/30' 
                             : 'bg-[#011627] border-white/10 hover:border-[#05F2F2]'
                         }`}
                       >
                           <div className="flex items-center gap-3">
                               <div className="text-[#6593A6] font-mono text-sm">0{index + 1}</div>
                               <div>
                                   <h3 className={`font-bold ${status === 'completed' ? 'text-[#58CC02]' : 'text-white'}`}>
                                       {asset?.title}
                                   </h3>
                                   <p className="text-xs text-[#6593A6]">{asset?.oneLiner}</p>
                               </div>
                           </div>
                           <div>
                               {status === 'completed' ? <CheckCircle className="text-[#58CC02]" size={24} /> : <Circle className="text-[#6593A6]" size={24} />}
                           </div>
                       </button>
                   );
               })}
           </div>

           {isFacilitator && (
               <div className="mt-8 border-t border-white/10 pt-6">
                   <h2 className="text-white font-bold mb-4">Facilitator View</h2>
                   <div className="text-[#6593A6] text-sm">
                       Total Submissions: {submissions.length}
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default WorkshopLive;
