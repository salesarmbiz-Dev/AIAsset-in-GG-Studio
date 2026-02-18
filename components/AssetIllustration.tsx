import React, { useEffect, useState } from 'react';

const AssetIllustration: React.FC<{ assetId: number; className?: string }> = ({ assetId, className }) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimKey(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const svgProps = {
    viewBox: "0 0 280 120",
    className: `w-full h-full ${className || ''}`,
    preserveAspectRatio: "xMidYMid meet"
  };

  switch (assetId) {
    case 1: // Campaign Calendar
      return (
        <svg {...svgProps} key={animKey}>
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#011E33" />
              <stop offset="100%" stopColor="#012840" />
            </linearGradient>
          </defs>
          <rect width="280" height="120" fill="url(#bgGrad)" />
          
          {/* Header */}
          <rect x="20" y="15" width="200" height="12" rx="2" fill="#6593A6" opacity="0.2" className="anim-fadeSlideUp" style={{animationDelay: '0s'}} />
          
          {/* Week 1 */}
          <rect x="20" y="40" width="80" height="8" rx="2" fill="#05F2F2" opacity="0.3" className="anim-fadeSlideRight" style={{animationDelay: '0.4s'}} />
          {/* Week 2 (Long) */}
          <rect x="20" y="55" width="220" height="8" rx="2" fill="#F27405" opacity="0.5" className="anim-fadeSlideRight" style={{animationDelay: '0.7s'}} />
          {/* Week 3 */}
          <rect x="20" y="70" width="120" height="8" rx="2" fill="#58CC02" opacity="0.3" className="anim-fadeSlideRight" style={{animationDelay: '1.0s'}} />
          {/* Week 4 */}
          <rect x="20" y="85" width="60" height="8" rx="2" fill="#8B5CF6" opacity="0.3" className="anim-fadeSlideRight" style={{animationDelay: '1.2s'}} />
          <rect x="90" y="85" width="100" height="8" rx="2" fill="#6593A6" opacity="0.3" className="anim-fadeSlideRight" style={{animationDelay: '1.3s'}} />
          
          {/* Budget Bar */}
          <g className="anim-fadeSlideUp" style={{animationDelay: '1.6s'}}>
             <rect x="20" y="105" width="80" height="4" fill="#F27405" />
             <rect x="105" y="105" width="60" height="4" fill="#05F2F2" />
             <rect x="170" y="105" width="40" height="4" fill="#58CC02" />
          </g>
        </svg>
      );

    case 2: // Image Prompt
      return (
        <svg {...svgProps} key={animKey}>
          <rect width="280" height="120" fill="#011E33" />
          
          {/* Prompt Box */}
          <g className="anim-fadeSlideRight" style={{animationDelay: '0.1s'}}>
            <rect x="20" y="25" width="100" height="70" rx="8" fill="#012840" stroke="#6593A6" strokeWidth="1" strokeOpacity="0.3" />
            <rect x="30" y="40" width="60" height="4" rx="1" fill="#6593A6" opacity="0.4" style={{animationDelay: '0.3s'}} className="anim-fadeSlideUp" />
            <rect x="30" y="50" width="40" height="4" rx="1" fill="#6593A6" opacity="0.4" style={{animationDelay: '0.4s'}} className="anim-fadeSlideUp" />
            <rect x="30" y="70" width="80" height="16" rx="8" fill="#F27405" style={{animationDelay: '0.5s'}} className="anim-scaleIn" />
          </g>

          {/* AI Circle */}
          <circle cx="140" cy="60" r="16" fill="#F27405" opacity="0.2" className="anim-scaleIn" style={{animationDelay: '0.9s'}} />
          <circle cx="140" cy="60" r="8" fill="#F27405" className="anim-scaleIn" style={{animationDelay: '1.0s'}} />
          
          {/* Arrow */}
          <path d="M 165 60 L 190 60" stroke="#05F2F2" strokeWidth="2" strokeDasharray="4 4" className="anim-drawLine" style={{animationDelay: '0.7s'}} />

          {/* Result Box */}
          <g className="anim-fadeSlideLeft" style={{animationDelay: '1.3s'}}>
            <rect x="200" y="25" width="60" height="70" rx="4" fill="#05F2F2" opacity="0.1" />
            <path d="M 200 75 L 220 55 L 240 65 L 260 45 L 260 95 L 200 95 Z" fill="#05F2F2" opacity="0.2" />
          </g>

          {/* Badges */}
          <rect x="210" y="10" width="40" height="10" rx="5" fill="#05F2F2" className="anim-scaleIn" style={{animationDelay: '1.8s'}} />
          <rect x="190" y="100" width="40" height="10" rx="5" fill="#F27405" className="anim-scaleIn" style={{animationDelay: '1.9s'}} />
        </svg>
      );

    case 3: // Content Converter
      return (
        <svg {...svgProps} key={animKey}>
          <rect width="280" height="120" fill="#011E33" />
          
          {/* Center Hub */}
          <g className="anim-scaleIn" style={{animationDelay: '0.1s'}}>
            <rect x="110" y="45" width="60" height="30" rx="8" fill="#012840" stroke="#F27405" strokeWidth="2" />
            <text x="140" y="65" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CONTENT</text>
          </g>

          {/* Lines */}
          <g stroke="#05F2F2" strokeWidth="1" strokeDasharray="3 3">
             <line x1="110" y1="60" x2="60" y2="30" className="anim-drawLine" style={{animationDelay: '0.5s'}} />
             <line x1="110" y1="60" x2="60" y2="90" className="anim-drawLine" style={{animationDelay: '0.6s'}} />
             <line x1="170" y1="60" x2="220" y2="30" className="anim-drawLine" style={{animationDelay: '0.5s'}} />
             <line x1="170" y1="60" x2="220" y2="90" className="anim-drawLine" style={{animationDelay: '0.6s'}} />
             <line x1="140" y1="45" x2="140" y2="20" className="anim-drawLine" style={{animationDelay: '0.7s'}} />
             <line x1="140" y1="75" x2="140" y2="100" className="anim-drawLine" style={{animationDelay: '0.7s'}} />
          </g>

          {/* Platforms */}
          <circle cx="60" cy="30" r="10" fill="#3b82f6" className="anim-scaleIn" style={{animationDelay: '0.8s'}} /> {/* FB */}
          <circle cx="60" cy="90" r="10" fill="#ec4899" className="anim-scaleIn" style={{animationDelay: '0.9s'}} /> {/* IG */}
          <circle cx="220" cy="30" r="10" fill="#06c755" className="anim-scaleIn" style={{animationDelay: '1.0s'}} /> {/* LINE */}
          <circle cx="220" cy="90" r="10" fill="#0077b5" className="anim-scaleIn" style={{animationDelay: '1.1s'}} /> {/* LinkedIn */}
          <circle cx="140" cy="20" r="10" fill="white" className="anim-scaleIn" style={{animationDelay: '1.2s'}} />   {/* TikTok */}
          <circle cx="140" cy="100" r="10" fill="#1da1f2" className="anim-scaleIn" style={{animationDelay: '1.3s'}} /> {/* X */}

        </svg>
      );

    case 4: // Video Script
      return (
        <svg {...svgProps} key={animKey}>
          <rect width="280" height="120" fill="#011E33" />
          
          {/* Arrows */}
          <path d="M 80 60 L 95 60 M 175 60 L 190 60" stroke="#05F2F2" strokeWidth="2" />

          {/* Frame 1 HOOK */}
          <g className="anim-fadeSlideUp" style={{animationDelay: '0.1s'}}>
             <rect x="20" y="30" width="60" height="60" rx="4" fill="#012840" stroke="#F27405" strokeWidth="2" />
             <text x="50" y="65" textAnchor="middle" fill="#F27405" fontSize="10">HOOK</text>
             <rect x="30" y="20" width="40" height="8" rx="4" fill="#F27405" />
          </g>

           {/* Frame 2 SCENE 1 */}
           <g className="anim-fadeSlideUp" style={{animationDelay: '0.5s'}}>
             <rect x="100" y="30" width="70" height="60" rx="4" fill="#012840" stroke="#05F2F2" strokeWidth="1" />
             <text x="135" y="65" textAnchor="middle" fill="#05F2F2" fontSize="10">SCENE 1</text>
             <rect x="115" y="20" width="40" height="8" rx="4" fill="#05F2F2" />
          </g>

           {/* Frame 3 CTA */}
           <g className="anim-fadeSlideUp" style={{animationDelay: '0.9s'}}>
             <rect x="195" y="35" width="50" height="50" rx="4" fill="#012840" stroke="#58CC02" strokeWidth="1" />
             <text x="220" y="63" textAnchor="middle" fill="#58CC02" fontSize="10">CTA</text>
             <rect x="205" y="25" width="30" height="8" rx="4" fill="#58CC02" />
          </g>

        </svg>
      );

    case 5: // LINE OA
      return (
        <svg {...svgProps} key={animKey}>
           <rect width="280" height="120" fill="#011E33" />
           
           {/* Phone Frame */}
           <rect x="40" y="10" width="80" height="100" rx="8" fill="#012840" stroke="#333" strokeWidth="2" className="anim-fadeSlideUp" style={{animationDelay: '0.1s'}} />
           
           {/* Header */}
           <rect x="42" y="12" width="76" height="15" fill="#06c755" opacity="0.2" className="anim-fadeSlideUp" style={{animationDelay: '0.3s'}} />
           
           {/* Bubble 1 */}
           <rect x="48" y="35" width="50" height="20" rx="4" fill="white" className="anim-fadeSlideRight" style={{animationDelay: '0.6s'}} />
           <rect x="52" y="48" width="30" height="4" rx="2" fill="#F27405" />

           {/* Bubble 2 */}
           <rect x="48" y="60" width="60" height="30" rx="4" fill="white" className="anim-fadeSlideRight" style={{animationDelay: '1.0s'}} />
           <rect x="52" y="75" width="40" height="8" rx="4" fill="#F27405" />

           {/* Versions */}
           <g className="anim-fadeSlideLeft" style={{animationDelay: '1.4s'}}>
              <text x="140" y="40" fill="#6593A6" fontSize="10">Ver A · สั้น</text>
              <text x="140" y="60" fill="#6593A6" fontSize="10">Ver B · เล่าเรื่อง</text>
              <text x="140" y="80" fill="#6593A6" fontSize="10">Ver C · Urgency</text>
           </g>

           {/* Badge */}
           <rect x="180" y="90" width="80" height="20" rx="10" fill="#06c755" className="anim-scaleIn" style={{animationDelay: '1.7s'}} />
           <text x="220" y="103" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Open → Buy</text>
        </svg>
      );
      
      case 6: // RAG
      return (
        <svg {...svgProps} key={animKey}>
           <rect width="280" height="120" fill="#011E33" />
           
           {/* Doc */}
           <g className="anim-fadeSlideRight" style={{animationDelay: '0.1s'}}>
             <rect x="20" y="20" width="60" height="80" rx="2" fill="#012840" stroke="#6593A6" />
             <line x1="30" y1="30" x2="70" y2="30" stroke="#6593A6" strokeWidth="2" />
             <line x1="30" y1="40" x2="70" y2="40" stroke="#6593A6" strokeWidth="2" />
             <line x1="30" y1="50" x2="60" y2="50" stroke="#6593A6" strokeWidth="2" />
           </g>

           {/* Lightning */}
           <circle cx="110" cy="60" r="15" fill="#012840" stroke="#F27405" className="anim-scaleIn" style={{animationDelay: '0.5s'}} />
           <text x="110" y="65" textAnchor="middle" fill="#F27405" fontSize="16">⚡</text>

           {/* Chunks */}
           <rect x="150" y="20" width="40" height="20" rx="2" fill="#012840" stroke="#05F2F2" className="anim-fadeSlideLeft" style={{animationDelay: '0.8s'}} />
           <rect x="150" y="50" width="40" height="20" rx="2" fill="#012840" stroke="#05F2F2" className="anim-fadeSlideLeft" style={{animationDelay: '1.0s'}} />
           <rect x="150" y="80" width="40" height="20" rx="2" fill="#012840" stroke="#05F2F2" className="anim-fadeSlideLeft" style={{animationDelay: '1.2s'}} />

           {/* Chatbot */}
           <rect x="210" y="20" width="60" height="80" rx="4" fill="#012840" stroke="#8B5CF6" className="anim-fadeSlideLeft" style={{animationDelay: '1.5s'}} />
           <text x="220" y="45" fill="#05F2F2" fontSize="8" className="anim-fadeSlideUp" style={{animationDelay: '1.8s'}}>Q: ราคา?</text>
           <text x="220" y="65" fill="#58CC02" fontSize="8" className="anim-fadeSlideUp" style={{animationDelay: '1.9s'}}>A: 590.- ✓</text>

        </svg>
      );

    default:
      return null;
  }
};

export default AssetIllustration;