import React, { useState } from 'react';
import { Share2, Copy, Check, X, Smartphone } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  textToShare: string; // For clipboard/native share content
  urlToShare?: string; // For link sharing
  type: 'asset' | 'prompt' | 'output';
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, textToShare, urlToShare, type }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const watermark = "\n\n✨ สร้างจาก AI Asset Library";
  const finalContent = type === 'output' ? textToShare + watermark : textToShare;
  const finalUrl = urlToShare || window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: type === 'output' ? finalContent : `Check out this ${type}: ${title}`,
          url: finalUrl,
        });
        onClose();
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert("Browser does not support native share");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(finalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-[#012840]/90 backdrop-blur-md anim-fadeSlideUp">
      <div className="w-full sm:max-w-md bg-[#011627] border-t sm:border border-[#05F2F2]/30 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="text-[#05F2F2]" /> แชร์ {type === 'asset' ? 'Asset' : type === 'output' ? 'ผลลัพธ์' : 'Prompt'}
          </h3>
          <button onClick={onClose} className="text-[#6593A6] hover:text-white"><X size={24} /></button>
        </div>

        <div className="space-y-3">
          {/* Native Share (Mobile First) */}
          <button 
            onClick={handleNativeShare}
            className="w-full py-4 bg-[#F27405] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#d96400] transition-all"
          >
            <Smartphone size={20} /> แชร์ผ่านแอป (Native)
          </button>

          {/* Copy Link */}
          {(type === 'asset' || type === 'prompt') && (
            <button 
              onClick={handleCopyLink}
              className="w-full py-4 bg-[#012840] border border-[#05F2F2]/30 text-[#05F2F2] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#05F2F2]/10"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์'}
            </button>
          )}

           {/* Copy Content (For Output) */}
           {type === 'output' && (
            <button 
              onClick={handleCopyContent}
              className="w-full py-4 bg-[#012840] border border-[#05F2F2]/30 text-[#05F2F2] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#05F2F2]/10"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'คัดลอกข้อความ + Watermark' : 'คัดลอกข้อความ'}
            </button>
          )}
        </div>
        
        {type === 'output' && (
            <p className="text-center text-xs text-[#6593A6] mt-4 opacity-70">
                พร้อมลายน้ำ "✨ สร้างจาก AI Asset Library"
            </p>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
