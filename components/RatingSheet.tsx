import React, { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RatingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  assetId?: number;
  fineTuneId?: string;
}

const RatingSheet: React.FC<RatingSheetProps> = ({ isOpen, onClose, assetId, fineTuneId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    const payload = {
      user_id: user.id,
      score: rating,
      comment: comment,
      asset_id: assetId || null,
      fine_tune_id: fineTuneId || null,
    };

    const { error } = await supabase.from('ratings').insert([payload]);
    if (!error) {
        setSubmitted(true);
        setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm anim-fadeSlideUp">
      <div className="w-full max-w-md bg-[#011627] border-t border-[#F27405]/30 rounded-t-2xl p-6 relative pb-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6593A6]"><X size={24}/></button>
        
        {submitted ? (
            <div className="flex flex-col items-center py-8 text-center anim-scaleIn">
                <div className="w-16 h-16 bg-[#58CC02]/20 rounded-full flex items-center justify-center text-[#58CC02] mb-4">
                    <Star fill="currentColor" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">ขอบคุณสำหรับความคิดเห็น!</h3>
                <p className="text-[#6593A6]">คะแนนของคุณช่วยให้เราปรับปรุง AI ให้ดีขึ้น</p>
            </div>
        ) : (
            <>
                <h3 className="text-xl font-bold text-white text-center mb-6">ให้คะแนนผลลัพธ์</h3>
                
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-2 transition-transform active:scale-95"
                        >
                            <Star 
                                size={44} 
                                className={star <= rating ? "fill-[#FFD700] text-[#FFD700]" : "text-[#6593A6]/30"} 
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>

                <div className="relative mb-6">
                    <MessageSquare className="absolute top-3 left-3 text-[#6593A6]" size={20} />
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="ความคิดเห็นเพิ่มเติม (Optional)..."
                        className="w-full bg-[#012840] rounded-xl border border-white/10 p-3 pl-10 text-white min-h-[100px] focus:border-[#F27405] outline-none resize-none"
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg ${rating > 0 ? 'bg-[#F27405] text-white shadow-lg' : 'bg-[#012840] text-[#6593A6] border border-white/10'}`}
                >
                    <Send size={20} /> ส่งคะแนน
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default RatingSheet;
