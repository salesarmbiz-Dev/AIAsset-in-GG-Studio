import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plug, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserIntegrations, connectPlatform, disconnectPlatform, PLATFORMS } from '../lib/integrationService';
import * as Icons from 'lucide-react';

const Integrations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
      if (user) loadIntegrations();
  }, [user]);

  const loadIntegrations = async () => {
      if (user) {
          const data = await getUserIntegrations(user.id);
          setIntegrations(data);
      }
  };

  const handleConnect = async (platformId: any) => {
      if (!user) return;
      setLoading(platformId);
      await connectPlatform(user.id, platformId);
      await loadIntegrations();
      setLoading(null);
  };

  const handleDisconnect = async (platformId: any) => {
      if (!user) return;
      if (confirm('Disconnect this platform?')) {
          await disconnectPlatform(user.id, platformId);
          await loadIntegrations();
      }
  };

  const IconComponent = ({ name, color }: { name: string, color: string }) => {
      const LucideIcon = (Icons as any)[name];
      return LucideIcon ? <LucideIcon size={24} style={{ color }} /> : <Plug size={24} style={{ color }} />;
  };

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 flex items-center gap-2 sticky top-0 bg-[#012840]/90 backdrop-blur z-50 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plug className="text-[#05F2F2]"/> Integrations
        </h1>
      </header>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
          <p className="text-[#6593A6] text-sm mb-4">เชื่อมต่อแพลตฟอร์มภายนอกเพื่อส่ง Output ไปใช้งานได้ทันที</p>

          {PLATFORMS.map(platform => {
              const connected = integrations.find(i => i.platform === platform.id);
              
              return (
                  <div key={platform.id} className="bg-[#011627] border border-white/10 rounded-xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#012840] flex items-center justify-center border border-white/5">
                              <IconComponent name={platform.icon} color={platform.color} />
                          </div>
                          <div>
                              <h3 className="text-white font-bold">{platform.name}</h3>
                              {connected ? (
                                  <div className="flex items-center gap-1 text-[#58CC02] text-xs">
                                      <Check size={12} /> Connected as {connected.platform_metadata?.channel_name || 'User'}
                                  </div>
                              ) : (
                                  <div className="text-[#6593A6] text-xs">Not connected</div>
                              )}
                          </div>
                      </div>

                      <div>
                          {loading === platform.id ? (
                              <RefreshCw className="animate-spin text-[#05F2F2]" />
                          ) : connected ? (
                              <button 
                                onClick={() => handleDisconnect(platform.id)}
                                className="px-3 py-1.5 border border-[#FF4B4B] text-[#FF4B4B] rounded-lg text-xs font-bold hover:bg-[#FF4B4B]/10"
                              >
                                  Disconnect
                              </button>
                          ) : (
                              <button 
                                onClick={() => handleConnect(platform.id)}
                                className="px-4 py-2 bg-[#F27405] text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-orange-500/20"
                              >
                                  Connect
                              </button>
                          )}
                      </div>
                  </div>
              );
          })}

          <div className="bg-[#011627] p-4 rounded-xl border border-dashed border-white/10 text-center text-[#6593A6] text-sm mt-8">
              More integrations coming soon (Zapier, TikTok, WordPress)
          </div>
      </div>
    </div>
  );
};

export default Integrations;
