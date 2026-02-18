import React from 'react';
import { FineTuneControl } from '../types';
import { Check } from 'lucide-react';

interface ControlProps {
  control: FineTuneControl;
  value: any;
  onChange: (val: any) => void;
}

export const FTControl: React.FC<ControlProps> = ({ control, value, onChange }) => {
  const isFilled = value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);

  return (
    <div className="bg-[#012840]/60 backdrop-blur-md border border-[#05F2F2]/15 rounded-2xl p-4">
      <div className="flex justify-between items-start mb-3">
        <label className="text-[16px] font-bold text-white">
          {control.label} {control.required && <span className="text-[#FF4B4B]">*</span>}
        </label>
        {isFilled && <Check size={16} className="text-[#58CC02]" />}
      </div>

      {control.type === 'text' && (
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#011627] border border-[#05F2F2]/30 rounded-xl p-4 text-[18px] text-white focus:border-[#F27405] focus:outline-none min-h-[52px]"
          placeholder={control.description}
        />
      )}

      {control.type === 'textarea' && (
        <div className="relative">
          <textarea 
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={control.rows || 3}
            className="w-full bg-[#011627] border border-[#05F2F2]/30 rounded-xl p-4 text-[18px] text-white focus:border-[#F27405] focus:outline-none min-h-[100px]"
            placeholder={control.description}
          />
          <div className="text-right text-xs text-[#6593A6] mt-1">{value?.length || 0} chars</div>
        </div>
      )}

      {control.type === 'select' && control.options && (
        <div className="flex flex-wrap gap-2">
          {control.options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-3 rounded-xl text-[16px] font-medium transition-all min-h-[48px] ${
                value === opt 
                ? 'bg-[#F27405] text-white shadow-lg' 
                : 'bg-[#011627] border border-[#05F2F2]/30 text-white hover:border-[#05F2F2]'
              }`}
            >
              {value === opt && <Check size={16} className="inline mr-2" />}
              {opt}
            </button>
          ))}
        </div>
      )}

      {control.type === 'slider' && (
        <div className="pt-2 pb-4 px-2">
           <div className="flex justify-between text-sm text-[#6593A6] mb-4">
             <span>{control.labels?.min}</span>
             <span className="text-[#F27405] text-2xl font-bold">{value || control.default_value}</span>
             <span>{control.labels?.max}</span>
           </div>
           <input 
             type="range"
             min={control.min}
             max={control.max}
             step={control.step}
             value={value || control.default_value}
             onChange={(e) => onChange(Number(e.target.value))}
             className="w-full"
           />
        </div>
      )}
    </div>
  );
};
