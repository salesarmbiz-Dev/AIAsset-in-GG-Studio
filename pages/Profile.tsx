import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createTeam, getUserTeams } from '../lib/teamService';
import { User, Gift, Flame, ArrowLeft, LogOut, Check, Copy, Zap, Users, Plus, BarChart3, Plug, GraduationCap, Settings } from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Team State
  const [teams, setTeams] = useState<any[]>([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    if (user) {
        // Fetch Streak
        supabase.from('user_streaks').select('*').eq('user_id', user.id).single()
        .then(({data}) => {
            if (data) setStreak(data);
            else setStreak({ current_streak_weeks: 0, total_activities: 0 }); 
        });

        // Mock Referral Code
        setReferralCode(`AIM-${user.id.substring(0, 5).toUpperCase()}`);
        
        // Fetch Teams
        getUserTeams(user.id).then(setTeams);
    }
  }, [user]);

  const handleCopyReferral = () => {
      navigator.clipboard.writeText(`https://ai-asset-library.app/signup?ref=${referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateTeam = async () => {
      if(!user || !newTeamName.trim()) return;
      await createTeam(newTeamName, user.id);
      setShowCreateTeam(false);
      getUserTeams(user.id).then(setTeams);
  };

  if (!user) return <div className="p-8 text-white">Please Login</div>;

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
       <header className="p-4 flex items-center gap-2 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
        <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </header>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        
        {/* User Info Card */}
        <div className="bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#05F2F2]/20 flex items-center justify-center text-[#05F2F2] text-2xl font-bold border border-[#05F2F2]">
                {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{profile?.display_name || user.email}</h2>
                <div className="text-[#6593A6] text-sm">{user.email}</div>
                <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#F27405]/20 text-[#F27405] text-xs rounded font-bold uppercase">Free Plan</span>
                </div>
            </div>
            <button onClick={signOut} className="p-2 text-[#FF4B4B] bg-[#FF4B4B]/10 rounded-lg"><LogOut size={20}/></button>
        </div>

        {/* Phase 8, 10 Menu */}
        <div className="space-y-3">
            <button 
              onClick={() => navigate('/me/performance')}
              className="w-full bg-[#011627] border border-[#05F2F2]/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(5,242,242,0.2)] transition-all group"
            >
                <div className="bg-[#05F2F2]/20 p-3 rounded-full text-[#05F2F2]">
                    <BarChart3 size={24} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Performance</h3>
                    <p className="text-[#6593A6] text-sm">ดูสถิติการใช้งานและความสำเร็จ</p>
                </div>
            </button>

            <button 
              onClick={() => navigate('/certifications')}
              className="w-full bg-[#011627] border border-[#FFD700]/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all group"
            >
                <div className="bg-[#FFD700]/20 p-3 rounded-full text-[#FFD700]">
                    <GraduationCap size={24} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Certifications</h3>
                    <p className="text-[#6593A6] text-sm">AI Skill Badges</p>
                </div>
            </button>

            <button 
              onClick={() => navigate('/settings/integrations')}
              className="w-full bg-[#011627] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-[#05F2F2] transition-all group"
            >
                <div className="bg-white/5 p-3 rounded-full text-white">
                    <Plug size={24} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Integrations</h3>
                    <p className="text-[#6593A6] text-sm">Connect LINE, Facebook, etc.</p>
                </div>
            </button>
        </div>

        {/* White Label Admin Link */}
        <button 
            onClick={() => navigate('/wl-admin')}
            className="w-full p-4 flex items-center justify-center gap-2 text-[#6593A6] hover:text-white border border-dashed border-white/10 rounded-xl"
        >
            <Settings size={16} /> White-label Admin
        </button>

        {/* Teams Section */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Users className="text-[#05F2F2]" /> My Teams
                </h3>
                <button onClick={() => setShowCreateTeam(true)} className="text-[#05F2F2] text-sm flex items-center gap-1">
                    <Plus size={16}/> Create Team
                </button>
            </div>
            
            <div className="space-y-3">
                {teams.map(team => (
                    <button 
                       key={team.id} 
                       onClick={() => navigate(`/team/${team.slug}`)}
                       className="w-full bg-[#011627] p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-[#05F2F2]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F27405] flex items-center justify-center text-white font-bold">
                                {team.name.charAt(0)}
                            </div>
                            <div className="text-left">
                                <div className="text-white font-bold">{team.name}</div>
                                <div className="text-xs text-[#6593A6]">Team Starter</div>
                            </div>
                        </div>
                        <ArrowLeft size={16} className="text-[#6593A6] rotate-180" />
                    </button>
                ))}
            </div>

            {showCreateTeam && (
                <div className="mt-4 bg-[#011627] p-4 rounded-xl border border-[#05F2F2]/30 anim-scaleIn">
                    <h4 className="text-white font-bold mb-2">Create New Team</h4>
                    <input 
                      autoFocus
                      value={newTeamName}
                      onChange={e => setNewTeamName(e.target.value)}
                      placeholder="Team Name (e.g. Marketing A)"
                      className="w-full bg-[#012840] p-3 rounded-lg text-white mb-3 border border-white/10"
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setShowCreateTeam(false)} className="flex-1 py-2 text-[#6593A6]">Cancel</button>
                        <button onClick={handleCreateTeam} className="flex-1 py-2 bg-[#05F2F2] text-[#012840] rounded-lg font-bold">Create</button>
                    </div>
                </div>
            )}
        </div>

        {/* Creator Studio Link */}
        <button 
          onClick={() => navigate('/creator-studio')}
          className="w-full bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/5 border border-[#8B5CF6]/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
        >
            <div className="bg-[#8B5CF6] p-3 rounded-full text-white">
                <Zap size={24} fill="currentColor" />
            </div>
            <div className="text-left">
                <h3 className="text-white font-bold text-lg">Creator Studio</h3>
                <p className="text-[#6593A6] text-sm">สร้าง Asset และ Fine-tune ของคุณเอง</p>
            </div>
        </button>

        {/* Referral System */}
        <div className="bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg mb-4">
                <Gift className="text-[#05F2F2]" /> แนะนำเพื่อน รับฟรี 1 เดือน
            </h3>
            <p className="text-[#6593A6] text-sm mb-4">
                ชวนเพื่อนมาสมัคร Member เพื่อนได้ส่วนลด คุณได้ใช้ฟรี 1 เดือน!
            </p>
            <div className="bg-[#012840] border border-white/10 rounded-xl p-3 flex justify-between items-center">
                <code className="text-[#05F2F2] font-mono font-bold">{referralCode}</code>
                <button 
                  onClick={handleCopyReferral}
                  className="p-2 bg-[#05F2F2]/10 text-[#05F2F2] rounded-lg hover:bg-[#05F2F2]/20"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
