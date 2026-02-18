import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTeamBySlug, getTeamMembers, getTeamPrompts, createWorkshop } from '../lib/teamService';
import { Team, TeamMember, TeamPrompt } from '../types';
import { 
    Users, BookOpen, Building2, Presentation, Settings, Plus, 
    Pin, Copy, Star, Play, CheckCircle
} from 'lucide-react';
import { ASSETS } from '../constants';

const TeamDashboard = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'library'|'members'|'settings'|'workshop'>('library');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [prompts, setPrompts] = useState<TeamPrompt[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]); // Mock list

  // Workshop Creation State
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false);
  const [workshopTitle, setWorkshopTitle] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

  useEffect(() => {
    if (slug) {
        getTeamBySlug(slug).then(t => {
            if (t) {
                setTeam(t);
                getTeamMembers(t.id).then(setMembers);
                getTeamPrompts(t.id).then(setPrompts);
            }
        });
    }
  }, [slug]);

  const handleStartWorkshop = async () => {
      if (!team || !user) return;
      const { data, error } = await createWorkshop(team.id, user.id, workshopTitle, selectedAssets);
      if (data) {
          navigate(`/workshop/${data.join_code}`);
      }
  };

  if (!team) return <div className="p-8 text-white">Loading Team...</div>;

  return (
    <div className="min-h-screen bg-[#012840] pb-20">
      {/* Header */}
      <header className="bg-[#011627] border-b border-[#05F2F2]/20 p-4 sticky top-0 z-40">
         <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-[#F27405] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                     {team.name.charAt(0)}
                 </div>
                 <div>
                     <h1 className="text-xl font-bold text-white flex items-center gap-2">
                         {team.name}
                         <span className="text-xs bg-[#05F2F2]/20 text-[#05F2F2] px-2 py-0.5 rounded-full">{members.length} Members</span>
                     </h1>
                     <p className="text-xs text-[#6593A6]">Team Starter Plan</p>
                 </div>
             </div>
             <button className="bg-[#012840] border border-white/10 p-2 rounded-full text-[#6593A6]">
                 <Settings size={20} />
             </button>
         </div>

         {/* Tabs */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
             {[
                 { id: 'library', label: 'Prompt Library', icon: BookOpen },
                 { id: 'members', label: 'Members', icon: Users },
                 { id: 'settings', label: 'Business Profile', icon: Building2 },
                 { id: 'workshop', label: 'Workshop', icon: Presentation },
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                        activeTab === tab.id 
                        ? 'bg-[#05F2F2] text-[#012840] shadow-lg shadow-[#05F2F2]/20' 
                        : 'bg-[#012840] border border-white/10 text-[#6593A6]'
                    }`}
                 >
                     <tab.icon size={16} /> {tab.label}
                 </button>
             ))}
         </div>
      </header>

      {/* Content */}
      <main className="p-4">
          
          {/* Library Tab */}
          {activeTab === 'library' && (
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <h2 className="text-white font-bold text-lg">Team Prompts</h2>
                      <div className="text-xs text-[#6593A6]">Shared by team</div>
                  </div>
                  {prompts.length === 0 ? (
                      <div className="text-center py-10 text-[#6593A6]">
                          <BookOpen size={48} className="mx-auto mb-2 opacity-50" />
                          <p>ยังไม่มี Prompt ในทีม</p>
                          <p className="text-xs">บันทึก output จากหน้า Asset เพื่อแชร์ให้ทีม</p>
                      </div>
                  ) : (
                      prompts.map(prompt => (
                          <div key={prompt.id} className={`bg-[#011627] border rounded-xl p-4 relative ${prompt.is_pinned ? 'border-[#F27405]' : 'border-[#05F2F2]/20'}`}>
                              {prompt.is_pinned && (
                                  <div className="absolute top-0 right-0 bg-[#F27405] text-white text-[10px] px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                                      <Pin size={10} /> แนะนำ
                                  </div>
                              )}
                              <div className="flex gap-2 items-start mb-2">
                                  <div className={`p-2 rounded-lg bg-[#012840]`}>
                                      <Star size={16} className="text-[#05F2F2]" />
                                  </div>
                                  <div>
                                      <h3 className="text-white font-bold">{prompt.prompt_name}</h3>
                                      <p className="text-xs text-[#6593A6]">by @{prompt.creator_name}</p>
                                  </div>
                              </div>
                              <div className="bg-[#012840] p-2 rounded text-xs text-[#6593A6] line-clamp-2 font-mono mb-3">
                                  {prompt.generated_output || prompt.built_prompt}
                              </div>
                              <button 
                                onClick={() => navigate(`/asset/${prompt.source_id}`, { state: { teamPrompt: prompt } })}
                                className="w-full py-2 border border-[#05F2F2] text-[#05F2F2] rounded-lg text-sm font-bold hover:bg-[#05F2F2]/10"
                              >
                                  Use Template
                              </button>
                          </div>
                      ))
                  )}
              </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
              <div>
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white font-bold">Team Members</h2>
                      <button className="bg-[#F27405] text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                          <Plus size={14} /> Invite
                      </button>
                  </div>
                  <div className="space-y-2">
                      {members.map(m => (
                          <div key={m.id} className="flex items-center justify-between bg-[#011627] p-3 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#05F2F2]/20 flex items-center justify-center text-[#05F2F2] font-bold">
                                      {m.display_name?.charAt(0)}
                                  </div>
                                  <div>
                                      <div className="text-white font-bold">{m.display_name}</div>
                                      <div className={`text-[10px] px-2 py-0.5 rounded inline-block ${
                                          m.role === 'owner' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#05F2F2]/20 text-[#05F2F2]'
                                      }`}>
                                          {m.role.toUpperCase()}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Workshop Tab */}
          {activeTab === 'workshop' && (
              <div>
                   {!showCreateWorkshop ? (
                       <button 
                         onClick={() => setShowCreateWorkshop(true)}
                         className="w-full py-4 bg-[#F27405] text-white font-bold rounded-xl flex items-center justify-center gap-2 mb-6"
                       >
                           <Plus size={20} /> สร้าง Workshop ใหม่
                       </button>
                   ) : (
                       <div className="bg-[#011627] p-4 rounded-xl border border-[#F27405]/30 mb-6 anim-scaleIn">
                           <h3 className="text-white font-bold mb-4">สร้าง Workshop</h3>
                           <input 
                             placeholder="ชื่อ Workshop (เช่น Content Plan Q2)"
                             value={workshopTitle}
                             onChange={e => setWorkshopTitle(e.target.value)}
                             className="w-full bg-[#012840] p-3 rounded-lg text-white mb-4 border border-white/10"
                           />
                           <div className="space-y-2 mb-4">
                               <p className="text-sm text-[#6593A6]">เลือก Assets ที่ต้องทำ:</p>
                               {ASSETS.slice(0,4).map(asset => (
                                   <label key={asset.id} className="flex items-center gap-3 p-2 bg-[#012840] rounded-lg">
                                       <input 
                                         type="checkbox" 
                                         checked={selectedAssets.includes(asset.id)}
                                         onChange={e => {
                                             if (e.target.checked) setSelectedAssets([...selectedAssets, asset.id]);
                                             else setSelectedAssets(selectedAssets.filter(id => id !== asset.id));
                                         }}
                                         className="w-5 h-5 accent-[#F27405]"
                                       />
                                       <span className="text-white text-sm">{asset.title}</span>
                                   </label>
                               ))}
                           </div>
                           <div className="flex gap-2">
                               <button onClick={() => setShowCreateWorkshop(false)} className="flex-1 py-3 text-[#6593A6]">ยกเลิก</button>
                               <button onClick={handleStartWorkshop} className="flex-1 py-3 bg-[#F27405] text-white rounded-lg font-bold">เริ่ม Workshop</button>
                           </div>
                       </div>
                   )}

                   <div className="text-center text-[#6593A6] py-8 border-t border-white/10">
                       <Play size={48} className="mx-auto mb-2 opacity-50" />
                       <p>ประวัติ Workshop</p>
                   </div>
              </div>
          )}

          {/* Settings Tab (Simple Mock) */}
          {activeTab === 'settings' && (
              <div className="bg-[#011627] p-4 rounded-xl border border-white/5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Building2 size={18} /> Shared Business Profile</h3>
                  <p className="text-sm text-[#6593A6] mb-4">ข้อมูลนี้จะถูกใช้ Auto-fill ให้สมาชิกทุกคนในทีม</p>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-xs text-[#6593A6]">Brand Voice</label>
                          <textarea className="w-full bg-[#012840] p-3 rounded-lg text-white text-sm h-24 border border-white/10" defaultValue="เป็นกันเอง สนุกสนาน ใช้คำว่า 'เพื่อนๆ' แทนลูกค้า..." />
                      </div>
                      <button className="w-full py-2 border border-[#05F2F2] text-[#05F2F2] rounded-lg text-sm font-bold">บันทึก</button>
                  </div>
              </div>
          )}

      </main>
    </div>
  );
};

export default TeamDashboard;
