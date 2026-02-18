import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, Palette, Users, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createMockTenant, getTenantByOwner, updateTenantSettings } from '../lib/whiteLabelService';
import { WhiteLabelTenant } from '../types';

const WhiteLabelAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tenant, setTenant] = useState<WhiteLabelTenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (user) {
          // Try fetch or create mock
          getTenantByOwner(user.id).then(async (data) => {
              if (data) {
                  setTenant(data);
              } else {
                  // For demo: create mock
                  const newTenant = await createMockTenant(user.id);
                  setTenant(newTenant);
              }
              setLoading(false);
          });
      }
  }, [user]);

  const handleSave = async () => {
      if (tenant) {
          await updateTenantSettings(tenant.id, tenant);
          alert('Settings Saved! Refresh to see changes.');
      }
  };

  if (loading) return <div className="p-8 text-white">Loading Admin...</div>;
  if (!tenant) return <div className="p-8 text-white">Error loading tenant</div>;

  return (
    <div className="min-h-screen bg-[#012840] pb-24">
      <header className="p-4 bg-[#011627] border-b border-[#05F2F2]/20 sticky top-0 z-40 flex items-center justify-between">
         <h1 className="text-xl font-bold text-white flex items-center gap-2">
             <Settings className="text-[#F27405]"/> WL Admin
         </h1>
         <button onClick={handleSave} className="bg-[#F27405] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
             <Save size={16}/> Save
         </button>
      </header>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
          
          <div className="bg-[#011627] p-5 rounded-2xl border border-white/10">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-[#05F2F2]"/> General</h2>
              <div className="space-y-4">
                  <div>
                      <label className="block text-[#6593A6] text-xs mb-1">Brand Name</label>
                      <input 
                        value={tenant.brand_name}
                        onChange={e => setTenant({...tenant, brand_name: e.target.value})}
                        className="w-full bg-[#012840] p-3 rounded-lg text-white border border-white/10"
                      />
                  </div>
                  <div>
                      <label className="block text-[#6593A6] text-xs mb-1">Slug (URL)</label>
                      <input 
                        value={tenant.slug}
                        disabled
                        className="w-full bg-[#012840] p-3 rounded-lg text-white/50 border border-white/5 cursor-not-allowed"
                      />
                  </div>
                  <div>
                      <label className="block text-[#6593A6] text-xs mb-1">Welcome Message</label>
                      <textarea 
                        value={tenant.welcome_message || ''}
                        onChange={e => setTenant({...tenant, welcome_message: e.target.value})}
                        className="w-full bg-[#012840] p-3 rounded-lg text-white border border-white/10 h-24"
                      />
                  </div>
              </div>
          </div>

          <div className="bg-[#011627] p-5 rounded-2xl border border-white/10">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Palette size={20} className="text-[#F27405]"/> Branding Colors</h2>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-[#6593A6] text-xs mb-1">Primary Color</label>
                      <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={tenant.primary_color}
                            onChange={e => setTenant({...tenant, primary_color: e.target.value})}
                            className="h-10 w-10 rounded border-none cursor-pointer"
                          />
                          <input 
                            value={tenant.primary_color}
                            onChange={e => setTenant({...tenant, primary_color: e.target.value})}
                            className="flex-1 bg-[#012840] p-2 rounded-lg text-white border border-white/10"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[#6593A6] text-xs mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={tenant.secondary_color}
                            onChange={e => setTenant({...tenant, secondary_color: e.target.value})}
                            className="h-10 w-10 rounded border-none cursor-pointer"
                          />
                          <input 
                            value={tenant.secondary_color}
                            onChange={e => setTenant({...tenant, secondary_color: e.target.value})}
                            className="flex-1 bg-[#012840] p-2 rounded-lg text-white border border-white/10"
                          />
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-[#011627] p-5 rounded-2xl border border-white/10">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Users size={20} className="text-[#8B5CF6]"/> Users (Mock)</h2>
              <div className="text-[#6593A6] text-sm text-center py-4 bg-[#012840] rounded-xl border border-dashed border-white/10">
                  User management available in Pro tier
              </div>
          </div>

      </div>
    </div>
  );
};

export default WhiteLabelAdmin;
