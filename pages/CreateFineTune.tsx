import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CreateFineTune = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [basePrompt, setBasePrompt] = useState('');
  const [controls, setControls] = useState<any[]>([]);

  const addControl = () => {
      setControls([...controls, { id: Date.now(), label: 'New Control', variable_name: 'new_var', type: 'text' }]);
  };

  const updateControl = (idx: number, field: string, val: any) => {
      const newControls = [...controls];
      newControls[idx][field] = val;
      setControls(newControls);
  };

  const handleSave = async () => {
      const { error } = await supabase.from('user_fine_tunes').insert([{
          user_id: user!.id,
          title,
          base_prompt: basePrompt,
          controls: controls,
          submit_status: 'approved' // Personal use is auto-approved for MVP
      }]);
      
      if (!error) {
          alert("Fine-tune Created!");
          navigate('/creator-studio');
      }
  };

  return (
    <div className="min-h-screen bg-[#012840] p-4 pb-20">
       <header className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={24} className="text-[#6593A6]"/></button>
        <h1 className="text-xl font-bold text-white">New Fine-tune</h1>
      </header>

      <div className="space-y-6">
          <div className="space-y-2">
              <label className="text-white font-bold">Title</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#011627] p-3 rounded-xl text-white border border-white/10 focus:border-[#8B5CF6] outline-none"
              />
          </div>

          <div className="space-y-2">
              <label className="text-white font-bold">Base Prompt</label>
              <textarea 
                value={basePrompt}
                onChange={e => setBasePrompt(e.target.value)}
                className="w-full bg-[#011627] p-3 rounded-xl text-white border border-white/10 h-32 focus:border-[#8B5CF6] outline-none font-mono text-sm"
                placeholder="Use {{variable_name}} for dynamic inputs"
              />
          </div>

          <div className="space-y-3">
              <div className="flex justify-between items-center">
                  <label className="text-white font-bold">Controls</label>
                  <button onClick={addControl} className="text-[#05F2F2] text-sm flex items-center gap-1"><Plus size={16}/> Add</button>
              </div>
              
              {controls.map((ctrl, idx) => (
                  <div key={idx} className="bg-[#011627] p-4 rounded-xl border border-white/10 space-y-3">
                      <div className="flex gap-2">
                          <input 
                            value={ctrl.label} 
                            onChange={e => updateControl(idx, 'label', e.target.value)}
                            className="flex-1 bg-[#012840] p-2 rounded text-white text-sm border border-white/5"
                            placeholder="Label"
                          />
                          <input 
                            value={ctrl.variable_name} 
                            onChange={e => updateControl(idx, 'variable_name', e.target.value)}
                            className="flex-1 bg-[#012840] p-2 rounded text-[#05F2F2] font-mono text-sm border border-white/5"
                            placeholder="variable_name"
                          />
                      </div>
                      <select 
                        value={ctrl.type}
                        onChange={e => updateControl(idx, 'type', e.target.value)}
                        className="w-full bg-[#012840] p-2 rounded text-white text-sm border border-white/5"
                      >
                          <option value="text">Text Input</option>
                          <option value="textarea">Textarea</option>
                          <option value="slider">Slider</option>
                      </select>
                  </div>
              ))}
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
              <Save size={20} /> Save Fine-tune
          </button>
      </div>
    </div>
  );
};

export default CreateFineTune;
