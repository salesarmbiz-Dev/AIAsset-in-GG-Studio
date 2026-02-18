import React, { useState, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ASSETS } from './constants';
import { Asset, SavedPrompt, FineTunePrompt } from './types';
import AssetIllustration from './components/AssetIllustration';
import { 
  FolderOpen, Heart, Search, Check, Copy, ArrowLeft, Share2, 
  ArrowDown, PenLine, FileText, ChevronDown, ChevronUp, ArrowUp,
  BookmarkPlus, Bookmark, BookmarkX, Edit, Trash2, Sliders, CalendarDays,
  Palette, RefreshCw, Video, MessageCircle, Puzzle, Sparkles, Star, Crown, Wand2, LogOut, User as UserIcon, Store, Package, Settings, GraduationCap
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import SavedPromptsSheet from './components/SavedPromptsSheet';
import { getFineTunePrompts } from './lib/fineTuneService';
import { getTenantByOwner } from './lib/whiteLabelService';

// Pages
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import FineTuneDetail from './pages/FineTuneDetail';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites'; 
import AssetDetail from './pages/AssetDetail'; 
import CreatorStudio from './pages/CreatorStudio';
import CreateAsset from './pages/CreateAsset';
import CreateFineTune from './pages/CreateFineTune';
import TeamDashboard from './pages/TeamDashboard';
import WorkshopLive from './pages/WorkshopLive';
import UserPerformance from './pages/UserPerformance';

// Phase 9 Pages
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import CreatorDashboard from './pages/CreatorDashboard';
import IndustryPacks from './pages/IndustryPacks';
import PackDetail from './pages/PackDetail';

// Phase 10 Pages
import Integrations from './pages/Integrations';
import Certifications from './pages/Certifications';
import WhiteLabelAdmin from './pages/WhiteLabelAdmin';

// --- Icons Map ---
const ICON_MAP: Record<string, React.FC<any>> = {
  CalendarDays, Palette, RefreshCw, Video, MessageCircle, Puzzle, Sliders
};

// --- White Label Wrapper ---
const WhiteLabelWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    
    useEffect(() => {
        // Simulate checking if we are on a custom domain/slug
        // For demo, we check if the user is a tenant owner and apply their colors
        if (user) {
            getTenantByOwner(user.id).then(tenant => {
                if (tenant) {
                    document.documentElement.style.setProperty('--orange', tenant.primary_color);
                    document.documentElement.style.setProperty('--turquoise', tenant.secondary_color);
                    if (tenant.background_color) {
                        document.documentElement.style.setProperty('--deep-navy', tenant.background_color);
                    }
                }
            });
        }
    }, [user]);

    return <>{children}</>;
};

// --- Components ---

const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  return (
    <Link to={`/asset/${asset.id}`} className="block group relative">
      <div className="bg-[#012840]/60 backdrop-blur-md border border-[#05F2F2]/15 hover:border-[#05F2F2]/35 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(5,242,242,0.2)]">
        <div className="relative h-[120px] bg-gradient-to-b from-[#011E33] to-[#012840] overflow-hidden">
          <AssetIllustration assetId={asset.id} />
          <div className="absolute top-2 left-2 flex gap-1">
             {asset.badges?.includes('MEMBER') && (
               <span className="flex items-center gap-1 bg-[#F27405] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                 <Star size={10} /> MEMBER
               </span>
             )}
             {asset.badges?.includes('PRO') && (
               <span className="flex items-center gap-1 bg-[#FFD700] text-[#012840] text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                 <Crown size={10} /> PRO
               </span>
             )}
          </div>
          {asset.badges?.includes('NEW') && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#F27405] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              <Sparkles size={10} /> NEW
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[18px] font-bold text-white leading-tight pr-2">{asset.title}</h3>
            <Heart size={20} className="text-[#6593A6]/50 min-w-[20px]" />
          </div>
          <p className="text-[16px] text-[#6593A6] line-clamp-2 mb-3 leading-relaxed">{asset.oneLiner}</p>
          <div className="flex flex-wrap items-center gap-2 mt-auto">
            <span className="text-[#FFD700] text-sm flex items-center gap-1">★ 4.9</span>
            <span 
              className="text-[12px] font-medium px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${asset.tagColor}20`, color: asset.tagColor, border: `1px solid ${asset.tagColor}40` }}
            >
              {asset.tag}
            </span>
            <span className="text-[10px] bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              {asset.saved}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Pages ---

const AssetLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const categories = ["ทั้งหมด", "Planner", "Image", "Converter", "LINE OA", "RAG", "Fine-tune"];
  const { user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [fineTunes, setFineTunes] = useState<FineTunePrompt[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFineTunePrompts().then(setFineTunes);
  }, []);

  const filteredAssets = activeCategory === "ทั้งหมด" 
    ? ASSETS 
    : ASSETS.filter(a => a.tag === activeCategory);
  
  const showFineTunes = activeCategory === "ทั้งหมด" || activeCategory === "Fine-tune";

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-[#012840]/80 backdrop-blur-lg border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <FolderOpen className="text-[#05F2F2]" size={28} />
            <h1 className="text-2xl font-extrabold text-white">AI Assets</h1>
          </div>
          {user ? (
             <div className="flex items-center gap-3">
               <Link to="/pricing" className="text-[#F27405] text-xs font-bold border border-[#F27405] px-2 py-1 rounded">UPGRADE</Link>
               <Link to="/profile" className="w-8 h-8 rounded-full bg-[#05F2F2]/20 border border-[#05F2F2] flex items-center justify-center text-[#05F2F2] font-bold">
                 {user.email?.charAt(0).toUpperCase()}
               </Link>
             </div>
          ) : (
             <button onClick={() => setShowLogin(true)} className="text-[#05F2F2] text-sm font-bold flex items-center gap-1 hover:underline">
                <UserIcon size={16} /> Login
             </button>
          )}
        </div>
        <div className="flex items-center gap-2">
           <p className="text-[16px] text-[#6593A6]">เลือก → เติมข้อมูล → Copy ไปใช้เลย</p>
           <span className="text-[10px] bg-[#F27405] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
             <Sparkles size={10} /> Feb Drop
           </span>
        </div>
        
        {/* Marketplace & Packs Links */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            <button 
                onClick={() => navigate('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg min-w-max"
            >
                <Store size={16} /> Marketplace
            </button>
            <button 
                onClick={() => navigate('/industry-packs')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg min-w-max"
            >
                <Package size={16} /> Industry Packs
            </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-[14px] font-medium transition-all min-h-[44px] ${
                activeCategory === cat 
                ? cat === 'Fine-tune' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-[#F27405] text-white shadow-lg shadow-orange-500/20' 
                : 'bg-transparent border border-[#05F2F2]/30 text-[#6593A6]'
              }`}
            >
              {cat}
            </button>
          ))}
          <Link to="/favorites">
            <button className="px-4 py-2.5 rounded-full text-[14px] font-medium min-h-[44px] bg-transparent border border-[#FF4B4B]/30 text-[#FF4B4B] flex items-center gap-2">
              <Heart size={16} /> Favorites
            </button>
          </Link>
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showFineTunes && fineTunes.map(ft => (
          <Link to={`/fine-tune/${ft.id}`} key={ft.id} className="block group relative">
            <div className="bg-[#012840]/60 backdrop-blur-md border border-[#8B5CF6]/30 hover:border-[#8B5CF6] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1">
               <div className="h-[120px] bg-gradient-to-br from-[#2e1065] to-[#012840] flex items-center justify-center relative">
                  <div className="absolute top-2 left-2 bg-[#8B5CF6] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                     FINE-TUNE
                  </div>
                  {ft.tier_required !== 'free' && (
                     <div className="absolute top-2 right-2 bg-[#FFD700] text-[#012840] text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        {ft.tier_required}
                     </div>
                  )}
                  <Sliders size={48} className="text-[#8B5CF6] opacity-50" />
               </div>
               <div className="p-4">
                  <h3 className="text-[18px] font-bold text-white mb-1">{ft.title}</h3>
                  <p className="text-[16px] text-[#6593A6] line-clamp-2">{ft.description}</p>
               </div>
            </div>
          </Link>
        ))}

        {filteredAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WhiteLabelWrapper>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AssetLibrary />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/fine-tune/:id" element={<FineTuneDetail />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/creator-studio" element={<CreatorStudio />} />
            <Route path="/create-asset" element={<CreateAsset />} />
            <Route path="/create-finetune" element={<CreateFineTune />} />
            
            <Route path="/team/:slug" element={<TeamDashboard />} />
            <Route path="/workshop/:code" element={<WorkshopLive />} />
            <Route path="/me/performance" element={<UserPerformance />} />

            {/* Phase 9 Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ListingDetail />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/industry-packs" element={<IndustryPacks />} />
            <Route path="/packs/:slug" element={<PackDetail />} />

            {/* Phase 10 Routes */}
            <Route path="/settings/integrations" element={<Integrations />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/wl-admin" element={<WhiteLabelAdmin />} />
          </Routes>
        </HashRouter>
      </WhiteLabelWrapper>
    </AuthProvider>
  );
};

export default App;
