import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, EyeOff, FileText, ChevronDown, ChevronUp, Zap, Sparkles, Check, Copy, Share2, Wand2 } from 'lucide-react';
import { getFineTunePrompts, generateFineTuneOutput } from '../lib/fineTuneService';
import { FineTunePrompt, SmartDefault } from '../types';
import { FTControl } from '../components/FineTuneControls';
import { useAuth } from '../contexts/AuthContext';
import PaywallModal from '../components/PaywallModal';
import LoginModal from '../components/LoginModal';
import ShareModal from '../components/ShareModal';
import FeedbackSheet from '../components/FeedbackSheet';
import { trackEvent } from '../lib/analytics';
import { getSmartDefaults } from '../lib/learningService';

const FineTuneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [prompt, setPrompt] = useState<FineTunePrompt | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Smart Defaults
  const [recommendations, setRecommendations] = useState<SmartDefault[]>([]);

  // Modals
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [usageId, setUsageId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'free'|'member'|'pro'>('free');

  useEffect(() => {
    getFineTunePrompts().then(prompts => {
      const found = prompts.find(p => p.id === id);
      if (found) {
        setPrompt(found);
        const defaults: any = {};
        found.controls.forEach(c => {
          if (c.default_value !== undefined) defaults[c.variable_name] = c.default_value;
        });
        setValues(defaults);
        trackEvent('view_asset', user?.id, found.id, { fine_tune_title: found.title });
      }
    });
    
    if (user) setUserTier('member'); 
  }, [id, user]);

  useEffect(() => {
      if (profile?.business_type && id) {
          getSmartDefaults('fine_tune', id, profile.business_type).then(setRecommendations);
      }
  }, [profile, id]);

  const applyRecommendations = () => {
      const updates: any = {};
      recommendations.forEach(rec => {
          updates[rec.control_id] = rec.recommended_value;
      });
      setValues(prev => ({ ...prev, ...updates }));
  };

  if (!prompt) return <div className="p-8 text-center text-white">Loading...</div>;

  const filledCount = prompt.controls.filter(c => {
    const val = values[c.variable_name];
    return !c.required || (val !== undefined && val !== '' && (!Array.isArray(val) || val.length > 0));
  }).length;
  const isComplete = filledCount >= prompt.controls.length;

  const handleGenerate = async () => {
    if (!user) { setShowLogin(true); return; }
    
    setLoading(true);
    const result = await generateFineTuneOutput(prompt, values, userTier);
    setLoading(false);

    if (result.success && result.output) {
      setOutput(result.output);
      setUsageId('mock-usage-id'); // In real app, get from result
      trackEvent('generate_finetune', user.id, prompt.id, { fine_tune_title: prompt.title });
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
      
      // Trigger Feedback
      setTimeout(() => setShowFeedback(true), 5000);
    } else {
      if (result.error?.includes('tier')) setShowPaywall(true);
      else alert(result.error || "Error generating output");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#012840]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#012840]/90 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full min-w-[44px]"><ArrowLeft size={24} className="text-white"/></button>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{prompt.title}</h1>
              <div className="flex gap-2 text-xs mt-1">
                <span className="px-2 py-0.5 bg-[#05F2F2]/20 text-[#05F2F2] rounded">{prompt.version}</span>
                <span className="px-2 py-0.5 bg-[#F27405]/20 text-[#F27405] rounded uppercase">{prompt.tier_required}</span>
              </div>
            </div>
        </div>
        {output && (
             <button onClick={() => setShowShare(true)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><Share2 size={24} className="text-[#05F2F2]" /></button>
        )}
      </header>

      <main className="p-4 space-y-6 max-w-2xl mx-auto">
        
        {/* Recommendation Banner */}
        {recommendations.length > 0 && (
            <div className="bg-[#05F2F2]/10 border border-[#05F2F2]/30 rounded-xl p-4 flex items-center justify-between anim-fadeSlideUp">
                <div className="flex items-center gap-3">
                    <div className="bg-[#05F2F2] p-2 rounded-full text-[#012840]"><Wand2 size={20}/></div>
                    <div>
                        <div className="text-white font-bold text-sm">แนะนำสำหรับ {profile?.business_type}</div>
                        <div className="text-[#05F2F2] text-xs">AI Learning จากข้อมูลผู้ใช้จริง</div>
                    </div>
                </div>
                <button 
                  onClick={applyRecommendations}
                  className="bg-[#05F2F2] text-[#012840] px-3 py-2 rounded-lg text-sm font-bold shadow-lg"
                >
                    ใช้ทั้งหมด
                </button>
            </div>
        )}

        <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-2xl p-4 space-y-2">
           <div className="flex items-center gap-2 text-[#8B5CF6] font-bold">
             <Lock size={18} />
             <h3>Fine-tuned Prompt</h3>
           </div>
           <p className="text-[#6593A6] text-sm">Prompt ถูกซ่อนไว้เพื่อคุณภาพ output ที่ดีที่สุด ปรับค่าด้านล่างเพื่อ optimize ผลลัพธ์</p>
        </div>

        <div className="space-y-4">
           {prompt.controls.map(control => {
             const recommendation = recommendations.find(r => r.control_id === control.variable_name);
             return (
                 <div key={control.id} className="relative">
                     {recommendation && (
                         <div className="absolute -top-2 right-4 bg-[#05F2F2] text-[#012840] text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-lg">
                             <Wand2 size={10} /> แนะนำ: {recommendation.recommended_value}
                         </div>
                     )}
                     <FTControl 
                        control={control} 
                        value={values[control.variable_name]} 
                        onChange={(val) => setValues(prev => ({...prev, [control.variable_name]: val}))}
                     />
                 </div>
             );
           })}
        </div>

        {output && (
          <div className="bg-[#58CC02]/5 border border-[#58CC02]/30 rounded-2xl p-6 anim-scaleIn mt-8">
             <div className="flex items-center gap-2 mb-4 text-[#58CC02]">
                <Sparkles size={24} />
                <h3 className="text-xl font-bold">Output พร้อมใช้</h3>
             </div>
             <div className="bg-[#011627] rounded-xl p-4 text-white/90 whitespace-pre-wrap font-mono text-sm border border-white/10 mb-4">
                {output}
             </div>
             <button 
               onClick={() => navigator.clipboard.writeText(output)}
               className="w-full py-3 bg-[#F27405] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg"
             >
                <Copy size={20} /> Copy Output
             </button>
          </div>
        )}
      </main>

      {!output && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#012840] via-[#012840] to-transparent z-50">
           <div className="max-w-2xl mx-auto">
             <button 
               onClick={handleGenerate}
               disabled={!isComplete || loading}
               className={`w-full rounded-full min-h-[60px] font-extrabold text-[20px] flex items-center justify-center gap-2 transition-all ${
                 isComplete 
                 ? 'bg-gradient-to-r from-[#F27405] to-[#F97316] text-white shadow-[0_6px_30px_rgba(242,116,5,0.4)]' 
                 : 'bg-[#011627]/90 text-[#6593A6] border border-white/10'
               }`}
             >
                {loading ? (
                  <>Processing...</>
                ) : isComplete ? (
                  <><Zap size={24} /> Generate Optimized Output</>
                ) : (
                  `กรอกข้อมูลให้ครบก่อน (${filledCount}/${prompt.controls.length})`
                )}
             </button>
           </div>
        </div>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
      <ShareModal 
        isOpen={showShare} 
        onClose={() => setShowShare(false)} 
        title={`Result from ${prompt.title}`} 
        textToShare={output || ''} 
        type="output" 
      />
      <FeedbackSheet 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        usageId={usageId || 'temp'}
        usageType="fine_tune"
      />
    </div>
  );
};

export default FineTuneDetail;
