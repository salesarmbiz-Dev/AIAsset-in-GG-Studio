import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ASSETS } from '../constants';
import { Asset, SavedPrompt, SmartDefault } from '../types';
import { 
  Check, Copy, ArrowLeft, Share2, 
  ArrowDown, PenLine, FileText, ChevronDown, ChevronUp, ArrowUp,
  BookmarkPlus, Bookmark, Wand2, Zap, Sparkles, RefreshCw, Repeat, Users, Send,
  MessageCircle, Table, Facebook, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import SavedPromptsSheet from '../components/SavedPromptsSheet';
import ShareModal from '../components/ShareModal';
import RatingSheet from '../components/RatingSheet';
import RemixSheet from '../components/RemixSheet';
import FeedbackSheet from '../components/FeedbackSheet';
import PaywallModal from '../components/PaywallModal';
import { trackEvent } from '../lib/analytics';
import { generateAssetOutput, getRemixTargetField } from '../lib/generationService';
import { saveToTeamLibrary, submitWorkshopTask, getUserTeams } from '../lib/teamService';
import { getSmartDefaults } from '../lib/learningService';
import { getAssetOverride } from '../lib/industryService';
import { sendToPlatform, getUserIntegrations } from '../lib/integrationService';

const ICON_MAP: Record<string, any> = {
  // Add icons as needed or import globally
};

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const originalAsset = ASSETS.find(a => a.id === Number(id));
  const { user, profile } = useAuth();

  // Asset State (Mutable for Overrides)
  const [asset, setAsset] = useState<Asset | undefined>(originalAsset);
  const [packBadge, setPackBadge] = useState<string | null>(null);

  // State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSavedSheet, setShowSavedSheet] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showRemix, setShowRemix] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Logic
  const [mySavedPrompts, setMySavedPrompts] = useState<SavedPrompt[]>([]);
  const [prefilled, setPrefilled] = useState(false);
  const [integrations, setIntegrations] = useState<any[]>([]);
  
  // AI Learning
  const [recommendations, setRecommendations] = useState<SmartDefault[]>([]);
  
  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [usageId, setUsageId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'free' | 'member' | 'pro'>('free'); // Mock
  const outputRef = useRef<HTMLDivElement>(null);

  // Remix & Workshop State
  const [remixSource, setRemixSource] = useState<string | null>(null);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<any[]>([]);

  if (!asset) return <div>Asset not found</div>;
  const Icon = ICON_MAP[asset.iconName] || FileText;

  // Calculation
  const totalSteps = asset.fields.length;
  const filledSteps = asset.fields.filter(f => {
    const val = formData[f.name];
    if (f.type === 'Multi') return val && val.length > 0;
    return val && val.trim() !== '';
  }).length;
  const progress = (filledSteps / totalSteps) * 100;
  const isComplete = filledSteps === totalSteps;

  // --- Effects ---

  useEffect(() => {
    if (asset) {
        trackEvent('view_asset', user?.id, asset.id, { asset_title: asset.title });
    }
    if (user) {
        setUserTier('member'); 
        fetchSavedPrompts();
        getUserTeams(user.id).then(setUserTeams);
        getUserIntegrations(user.id).then(setIntegrations);
    }
  }, [asset, user]);

  // Load Smart Defaults
  useEffect(() => {
      if (profile?.business_type && asset) {
          getSmartDefaults('asset', String(asset.id), profile.business_type)
            .then(setRecommendations);
      }
  }, [profile, asset]);

  // Handle Incoming State (Pack / Remix / Workshop)
  useEffect(() => {
      if (location.state) {
          // Industry Pack Override
          if (location.state.packMode && originalAsset) {
              const override = getAssetOverride(originalAsset.id, location.state.industry);
              if (override) {
                  // Create a modified asset object
                  const modifiedAsset = { ...originalAsset };
                  modifiedAsset.template = override.template;
                  setPackBadge(override.badge);
                  
                  // Modify fields labels if needed
                  if (override.overrideFields) {
                      modifiedAsset.fields = originalAsset.fields.map(f => {
                          const fOverride = override.overrideFields.find((o: any) => o.name === f.name);
                          return fOverride ? { ...f, label: fOverride.label } : f;
                      });
                  }
                  setAsset(modifiedAsset);
              }
          }

          // Remix
          if (location.state.remixContent) {
              const { remixContent, remixSource } = location.state;
              const targetField = getRemixTargetField(asset);
              if (targetField) {
                  setFormData(prev => ({ ...prev, [targetField]: remixContent }));
                  setRemixSource(remixSource);
                  setCustomFields(prev => ({ ...prev, [targetField]: true })); 
                  window.scrollTo({ top: 100, behavior: 'smooth' });
              }
          }
          // Workshop
          if (location.state.workshopId) {
              setWorkshopId(location.state.workshopId);
          }
          // Team Template
          if (location.state.teamPrompt) {
              setFormData(location.state.teamPrompt.fill_values);
              setPrefilled(true);
          }
      }
  }, [location.state, originalAsset]);

  // --- Handlers ---

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      handleInputChange(field, current.filter((v: string) => v !== value));
    } else {
      handleInputChange(field, [...current, value]);
    }
  };

  const applyRecommendations = () => {
      const updates: any = {};
      recommendations.forEach(rec => {
          updates[rec.control_id] = rec.recommended_value;
      });
      setFormData(prev => ({ ...prev, ...updates }));
  };

  const generatePrompt = () => {
    let prompt = asset.template;
    asset.fields.forEach(field => {
      let value = formData[field.name];
      if (Array.isArray(value)) value = value.join(', ');
      const placeholder = `[${field.name}]`;
      prompt = prompt.split(placeholder).join(value || placeholder);
    });
    return prompt;
  };

  const generatedContent = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('copy_asset', user?.id, asset.id, { 
        asset_title: asset.title,
        completion_rate: progress
    });
    setTimeout(() => setIsCopied(false), 3000);
    // Trigger Feedback 3s later
    setTimeout(() => setShowFeedback(true), 3000);
  };

  const handleGenerateAI = async () => {
      if (!user) { setShowLogin(true); return; }
      
      setIsGenerating(true);
      setGeneratedOutput(null);

      const result = await generateAssetOutput(
          asset, 
          formData, 
          generatedContent, 
          user.id, 
          userTier
      );

      setIsGenerating(false);

      if (result.success && result.output) {
          setGeneratedOutput(result.output);
          setUsageId(result.usageId || null);
          // Scroll to output
          setTimeout(() => {
              outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          
          // Trigger Feedback instead of Rating
          setTimeout(() => setShowFeedback(true), 5000);
      } else if (result.limitReached) {
          setShowPaywall(true);
      } else {
          alert(result.error || "Generation failed");
      }
  };

  const checkLogin = () => {
    if (!user) {
      setShowLogin(true);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!checkLogin()) return;
    try {
      const { error } = await supabase.from('saved_prompts').insert([{
        user_id: user!.id,
        asset_id: asset.id,
        prompt_name: saveName || asset.title,
        fill_values: formData,
        built_prompt: generatedContent,
        tags: [asset.tag]
      }]);
      if (error) throw error;
      setShowSaveModal(false);
      fetchSavedPrompts();
      alert("บันทึกแล้ว!");
    } catch (err) {
      alert("บันทึกไม่สำเร็จ");
    }
  };
  
  const handleSaveToTeam = async () => {
      if (!user || userTeams.length === 0) return alert("คุณยังไม่ได้เข้าร่วมทีม");
      const teamId = userTeams[0].id; // MVP: Save to first team
      
      await saveToTeamLibrary(teamId, user.id, {
          source_type: 'asset',
          source_id: String(asset.id),
          prompt_name: asset.title + ' (Saved)',
          fill_values: formData,
          generated_output: generatedOutput || ''
      });
      alert("Saved to Team Library!");
  };

  const handleSubmitWorkshop = async () => {
      if (!user || !workshopId) return;
      await submitWorkshopTask(workshopId, user.id, String(asset.id), generatedOutput || generatedContent, formData);
      alert("Submitted to Workshop! 🎉");
      navigate(-1); // Go back to workshop
  };

  const handleSendToPlatform = async () => {
      if (!user) return;
      let platform = '';
      if (asset.tag === 'LINE OA') platform = 'line_oa';
      else if (asset.tag === 'Planner') platform = 'google'; // Export to Sheets
      else if (asset.tag === 'Image') platform = 'canva';
      else platform = 'facebook';

      // Check connection
      const connected = integrations.find(i => i.platform === platform);
      if (!connected) {
          if (confirm(`Connect to ${platform} first?`)) {
              navigate('/settings/integrations');
          }
          return;
      }

      await sendToPlatform(user.id, platform as any, generatedOutput || generatedContent);
      alert(`Sent to ${platform} successfully!`);
  };

  const fetchSavedPrompts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_prompts')
      .select('*')
      .eq('user_id', user.id)
      .eq('asset_id', asset.id)
      .order('created_at', { ascending: false });
    
    if (data) setMySavedPrompts(data as any);
  };

  // Determine Platform Icon
  const getPlatformIcon = () => {
      if (asset.tag === 'LINE OA') return { icon: MessageCircle, color: '#06c755', name: 'LINE OA' };
      if (asset.tag === 'Planner') return { icon: Table, color: '#10b981', name: 'Sheets' };
      if (asset.tag === 'Image') return { icon: ImageIcon, color: '#8b5cf6', name: 'Canva' };
      return { icon: Facebook, color: '#3b82f6', name: 'Facebook' };
  };
  const platformInfo = getPlatformIcon();

  return (
    <div className="min-h-screen pb-40 bg-[#012840]">
      {/* Workshop Banner */}
      {workshopId && (
          <div className="bg-[#F27405] text-white text-center py-2 text-xs font-bold sticky top-0 z-[60]">
              🔴 WORKSHOP MODE
          </div>
      )}
      
      {/* Industry Pack Banner */}
      {packBadge && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-xs font-bold sticky top-0 z-[60] flex items-center justify-center gap-2">
              <Sparkles size={14} /> {packBadge}
          </div>
      )}

      <header className={`sticky ${packBadge || workshopId ? 'top-[32px]' : 'top-0'} z-50 bg-[#012840]/90 backdrop-blur-xl border-b border-white/5`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Icon size={24} style={{ color: asset.tagColor }} />
              <span className="font-bold text-[18px] truncate max-w-[180px] text-white">{asset.title}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setShowShare(true)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><Share2 size={24} className="text-[#05F2F2]" /></button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#6593A6]">เติมข้อมูล {filledSteps}/{totalSteps} ช่อง</span>
            {isComplete && <span className="text-[#58CC02] flex items-center gap-1"><Check size={14}/> พร้อม Copy แล้ว!</span>}
          </div>
          <div className="h-2 bg-[#011627] rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-gradient-to-r from-[#58CC02] to-[#4ADE80]' : 'bg-gradient-to-r from-[#F27405] to-[#F59E0B]'}`}
               style={{ width: `${progress}%` }}
             />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 max-w-2xl mx-auto">
        
        {/* Recommendation Banner */}
        {recommendations.length > 0 && !prefilled && (
            <div className="bg-[#05F2F2]/10 border border-[#05F2F2]/30 rounded-xl p-4 flex items-center justify-between anim-fadeSlideUp">
                <div className="flex items-center gap-3">
                    <div className="bg-[#05F2F2] p-2 rounded-full text-[#012840]"><Wand2 size={20}/></div>
                    <div>
                        <div className="text-white font-bold text-sm">แนะนำสำหรับ {profile?.business_type}</div>
                        <div className="text-[#05F2F2] text-xs">พบ {recommendations.length} การตั้งค่าที่เหมาะสม</div>
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

        {/* Inputs Loop */}
        <div className="space-y-6">
           {asset.fields.map((field, index) => {
              const isFilled = formData[field.name] && (Array.isArray(formData[field.name]) ? formData[field.name].length > 0 : String(formData[field.name]).trim() !== '');
              const isCustomMode = customFields[field.name];
              const isRemixField = getRemixTargetField(asset) === field.name && remixSource;
              const recommendation = recommendations.find(r => r.control_id === field.name);

              return (
                 <div key={field.name} className={`rounded-2xl p-5 border transition-all duration-300 ${isFilled ? 'bg-[#58CC02]/5 border-[#58CC02]/30' : 'bg-[#F27405]/5 border-[#F27405]/30 shadow-[0_0_15px_-5px_rgba(242,116,5,0.15)]'}`}>
                    <div className="flex items-start gap-4 mb-4">
                       <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${isFilled ? 'bg-[#58CC02] text-white' : 'bg-[#F27405] text-white'}`}>
                          {isFilled ? <Check size={20} /> : index + 1}
                       </div>
                       <div>
                          <h3 className="text-[18px] font-bold text-white flex items-center gap-2 flex-wrap">
                              {field.label}
                              {isRemixField && (
                                  <span className="text-[10px] bg-[#05F2F2]/20 text-[#05F2F2] border border-[#05F2F2]/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Repeat size={10} /> Remixed from: {remixSource}
                                  </span>
                              )}
                              {recommendation && (
                                  <span className="text-[10px] bg-[#05F2F2]/20 text-[#05F2F2] border border-[#05F2F2]/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Wand2 size={10} /> แนะนำ
                                  </span>
                              )}
                          </h3>
                          {field.hint && <p className="text-[14px] text-[#6593A6] mt-1">{field.hint}</p>}
                       </div>
                    </div>

                    <div className="pl-14">
                       {(field.options && !isCustomMode) && (
                          <div className="flex flex-wrap gap-2">
                             {field.options.map(opt => {
                                const isSelected = field.type === 'Multi' 
                                   ? (formData[field.name] || []).includes(opt)
                                   : formData[field.name] === opt;
                                const isRecommended = recommendation?.recommended_value === opt;
                                
                                return (
                                   <button
                                      key={opt}
                                      onClick={() => field.type === 'Multi' ? handleMultiSelect(field.name, opt) : handleInputChange(field.name, opt)}
                                      className={`px-4 py-3 rounded-xl text-[16px] font-medium transition-all text-left min-h-[48px] relative ${
                                          isSelected 
                                          ? 'bg-[#F27405] text-white shadow-lg' 
                                          : isRecommended 
                                            ? 'bg-[#012840] border border-[#05F2F2] text-white shadow-[0_0_10px_rgba(5,242,242,0.3)]' 
                                            : 'bg-[#012840] border border-[#05F2F2]/30 text-white hover:border-[#05F2F2]'
                                      }`}
                                   >
                                      {isSelected && <Check size={16} className="inline mr-2" />}
                                      {isRecommended && !isSelected && <Wand2 size={12} className="inline mr-2 text-[#05F2F2]"/>}
                                      {opt}
                                   </button>
                                );
                             })}
                             {field.allowCustom && (
                                <button
                                   onClick={() => setCustomFields(prev => ({...prev, [field.name]: true}))}
                                   className="px-4 py-3 rounded-xl text-[16px] font-medium transition-all border border-dashed border-[#05F2F2] text-[#05F2F2] hover:bg-[#05F2F2]/10 flex items-center gap-2 min-h-[48px]"
                                >
                                   <PenLine size={16} /> พิมพ์เอง
                                </button>
                             )}
                          </div>
                       )}

                       {(isCustomMode || !field.options) && (
                          <div className={`anim-fadeSlideRight ${isRemixField ? 'ring-2 ring-[#05F2F2] rounded-xl' : ''}`}>
                             <textarea 
                                rows={3}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                placeholder={`พิมพ์ ${field.label} ของคุณ...`}
                                className="w-full bg-[#011627] border border-[#05F2F2]/30 rounded-xl p-4 text-[18px] text-white focus:border-[#F27405] focus:outline-none focus:shadow-[0_0_10px_rgba(242,116,5,0.3)] min-h-[52px]"
                                autoFocus={isCustomMode && !isRemixField}
                             />
                             {field.allowCustom && isCustomMode && (
                                <button 
                                  onClick={() => { setCustomFields(prev => ({...prev, [field.name]: false})); handleInputChange(field.name, ''); }}
                                  className="text-sm text-[#05F2F2] mt-2 underline"
                                >
                                   กลับไปเลือกจากรายการ
                                </button>
                             )}
                          </div>
                       )}
                    </div>
                 </div>
              );
           })}
        </div>

        {/* Prompt Preview Toggle */}
        <div className="pt-4 pb-8">
           <button 
             onClick={() => setShowPreview(!showPreview)}
             className="w-full flex items-center justify-center gap-2 py-3 border border-[#05F2F2]/30 rounded-xl text-[#6593A6] hover:bg-[#05F2F2]/5 transition-colors min-h-[48px]"
           >
              {showPreview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              {showPreview ? "ซ่อน Prompt" : "ดู Prompt ที่จะได้"}
           </button>
           
           {showPreview && (
              <div className="mt-4 bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6 anim-fadeSlideUp max-h-[300px] overflow-y-auto">
                 <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-[#6593A6]">
                    {generatedContent}
                 </p>
              </div>
           )}
        </div>

        {/* Generation Output Section (New in Phase 6) */}
        {generatedOutput && (
            <div ref={outputRef} className="bg-[#58CC02]/5 border border-[#58CC02]/30 rounded-2xl p-6 anim-scaleIn mt-4 mb-20 scroll-mt-24">
                <div className="flex items-center gap-2 mb-4 text-[#58CC02]">
                    <Sparkles size={24} />
                    <h3 className="text-xl font-bold">Output พร้อมใช้</h3>
                </div>
                <div className="bg-[#011627] rounded-xl p-4 text-white/90 whitespace-pre-wrap font-mono text-base border border-white/10 mb-4 leading-relaxed">
                    {generatedOutput}
                </div>
                
                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedOutput)}
                        className="py-3 bg-[#F27405] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                        <Copy size={20} /> Copy
                    </button>
                    {/* Integration Button */}
                    <button 
                        onClick={handleSendToPlatform}
                        className="py-3 bg-[#012840] border border-[#05F2F2]/50 text-[#05F2F2] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#05F2F2]/10"
                    >
                        <platformInfo.icon size={20} /> Send to {platformInfo.name}
                    </button>
                </div>

                <div className="flex gap-3">
                    {workshopId && (
                         <button 
                             onClick={handleSubmitWorkshop}
                             className="flex-1 py-3 bg-[#58CC02] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg animate-pulse"
                         >
                             <Send size={20} /> ส่งงาน Workshop
                         </button>
                    )}
                    {!workshopId && (
                        <button 
                            onClick={() => setShowRemix(true)}
                            className="flex-1 py-3 bg-[#011627] border border-[#8B5CF6]/50 text-[#8B5CF6] font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <Repeat size={20} /> Remix
                        </button>
                    )}
                    <button 
                        onClick={() => { setSaveName(`${asset.title} Output`); setShowSaveModal(true); }}
                        className="flex-1 py-3 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                        <BookmarkPlus size={20} /> Save
                    </button>
                </div>
            </div>
        )}

      </main>

      {/* Sticky Bottom Actions */}
      {!generatedOutput && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#012840] via-[#012840] to-transparent z-50">
            <div className="max-w-2xl mx-auto">
            {isComplete ? (
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button 
                        onClick={handleCopy}
                        className="flex-1 rounded-full min-h-[56px] font-bold text-[18px] border border-[#05F2F2] text-[#05F2F2] bg-[#011627] flex items-center justify-center gap-2"
                    >
                        <Copy size={20} /> Copy Prompt
                    </button>
                    <button 
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className="flex-[1.5] rounded-full min-h-[56px] font-extrabold text-[20px] shadow-[0_6px_30px_rgba(242,116,5,0.4)] bg-gradient-to-r from-[#F27405] to-[#F97316] text-white flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform"
                    >
                        {isGenerating ? 'Generating...' : <><Zap size={24} fill="currentColor" /> Generate ด้วย AI</>}
                    </button>
                </div>
            ) : (
                <div className="w-full bg-[#011627]/90 backdrop-blur border border-white/10 rounded-full min-h-[56px] flex items-center justify-center text-[#6593A6] gap-2">
                    <ArrowUp size={20} />
                    เติมข้อมูลให้ครบก่อน ({filledSteps}/{totalSteps})
                </div>
            )}
            </div>
        </div>
      )}

      {/* Modals */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fadeSlideUp">
           <div className="bg-[#011627] border border-[#05F2F2]/30 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-2 mb-4 text-[#05F2F2]">
                 <BookmarkPlus size={24} />
                 <h3 className="text-xl font-bold text-white">บันทึก Prompt</h3>
              </div>
              <input 
                 type="text" 
                 value={saveName} 
                 onChange={(e) => setSaveName(e.target.value)}
                 className="w-full bg-[#012840] border border-white/10 rounded-xl p-4 text-white text-[18px] mb-6 focus:border-[#F27405] outline-none"
                 placeholder="ตั้งชื่อ Prompt ของคุณ..."
              />
              <div className="flex gap-3">
                 <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 text-[#6593A6] font-medium hover:text-white">ยกเลิก</button>
                 <button onClick={handleSave} className="flex-1 py-3 bg-[#F27405] rounded-full text-white font-bold shadow-lg hover:shadow-orange-500/20">บันทึก</button>
              </div>
           </div>
        </div>
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
      <ShareModal 
        isOpen={showShare} 
        onClose={() => setShowShare(false)} 
        title={asset.title} 
        textToShare={generatedOutput || `Check out this AI Asset: ${asset.title}`} 
        type={generatedOutput ? "output" : "asset"} 
      />
      
      <SavedPromptsSheet 
        isOpen={showSavedSheet} 
        onClose={() => setShowSavedSheet(false)}
        savedPrompts={mySavedPrompts}
        onSelect={(prompt) => {
          setFormData(prompt.fill_values);
          setSaveName(prompt.title);
          setShowSavedSheet(false);
        }}
      />

      <FeedbackSheet 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        usageId={usageId || 'temp'}
        usageType="asset"
      />

      <RemixSheet 
        isOpen={showRemix}
        onClose={() => setShowRemix(false)}
        sourceContent={generatedOutput || ''}
        sourceTitle={asset.title}
      />

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
};

export default AssetDetail;
