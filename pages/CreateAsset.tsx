import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CreateAsset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
      title: '',
      description: '',
      category: 'Planner',
      template: '',
      fields: [] as any[]
  });

  const handleSave = async () => {
      const { error } = await supabase.from('submitted_assets').insert([{
          user_id: user!.id,
          asset_data: data,
          status: 'pending'
      }]);
      
      if (!error) {
          alert("Submission Received! Pending Review.");
          navigate('/creator-studio');
      }
  };

  return (
    <div className="min-h-screen bg-[#012840] p-4">
       <header className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-xl font-bold text-white">Create Asset</h1>
      </header>

      <div className="space-y-4">
          <div className="bg-[#011627] border border-[#05F2F2]/30 rounded-2xl p-6">
              <label className="block text-white mb-2">Asset Title</label>
              <input 
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full bg-[#012840] p-3 rounded-lg text-white border border-white/10 mb-4 focus:border-[#05F2F2] outline-none"
              />
              
              <label className="block text-white mb-2">Prompt Template</label>
              <textarea 
                value={data.template}
                onChange={e => setData({...data, template: e.target.value})}
                className="w-full bg-[#012840] p-3 rounded-lg text-white border border-white/10 h-32 mb-4 focus:border-[#05F2F2] outline-none"
                placeholder="Use [variable_name] for inputs..."
              />

              <div className="bg-[#F27405]/10 p-3 rounded-lg text-[#F27405] text-sm mb-4">
                  ⚠️ Note: This feature is in Beta. Admin will review before publishing.
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-[#05F2F2] text-[#012840] font-bold rounded-xl flex items-center justify-center gap-2"
              >
                  <Save size={20} /> Submit for Review
              </button>
          </div>
      </div>
    </div>
  );
};

export default CreateAsset;
