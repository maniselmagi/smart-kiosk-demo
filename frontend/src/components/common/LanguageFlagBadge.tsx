import React from 'react';
import { Language } from '../../utils/translations';

interface LanguageFlagBadgeProps {
  code: Language;
  className?: string;
  size?: number;
}

export const LanguageFlagBadge: React.FC<LanguageFlagBadgeProps> = ({ 
  code, 
  className = '',
  size = 40 
}) => {
  return (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-amber-400/40 ${className}`}
      style={{ width: size, height: size }}
    >
      {code === 'en' && (
        // United Kingdom (Union Jack) - crisp vector SVG
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <clipPath id="circle-clip-en">
            <circle cx="30" cy="30" r="30" />
          </clipPath>
          <g clipPath="url(#circle-clip-en)">
            {/* Blue background */}
            <rect width="60" height="60" fill="#012169" />
            {/* White diagonals */}
            <path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFF" strokeWidth="8" />
            {/* Red diagonals */}
            <path d="M0,0 L60,60" stroke="#C8102E" strokeWidth="4" />
            <path d="M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
            {/* White cross */}
            <path d="M30,0 L30,60 M0,30 L60,30" stroke="#FFF" strokeWidth="12" />
            {/* Red cross */}
            <path d="M30,0 L30,60 M0,30 L60,30" stroke="#C8102E" strokeWidth="6" />
          </g>
          <circle cx="30" cy="30" r="29" fill="none" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
        </svg>
      )}

      {(code === 'ta' || code === 'hi' || code === 'te') && (
        // India Tricolor (Saffron, White with Ashoka Chakra, Green)
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <clipPath id="circle-clip-in">
            <circle cx="30" cy="30" r="30" />
          </clipPath>
          <g clipPath="url(#circle-clip-in)">
            {/* Saffron Top */}
            <rect x="0" y="0" width="60" height="20" fill="#FF9933" />
            {/* White Center */}
            <rect x="0" y="20" width="60" height="20" fill="#FFFFFF" />
            {/* Green Bottom */}
            <rect x="0" y="40" width="60" height="20" fill="#138808" />
            {/* Ashoka Chakra Center */}
            <circle cx="30" cy="30" r="7.5" fill="none" stroke="#000080" strokeWidth="1.2" />
            <circle cx="30" cy="30" r="1.5" fill="#000080" />
            {/* 24 Spokes */}
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="30"
                y1="23"
                x2="30"
                y2="37"
                stroke="#000080"
                strokeWidth="0.8"
                transform={`rotate(${i * 15} 30 30)`}
              />
            ))}
          </g>
          <circle cx="30" cy="30" r="29" fill="none" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
        </svg>
      )}

      {code === 'es' && (
        // Spain Flag (Red, Yellow with Coat of Arms, Red)
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <clipPath id="circle-clip-es">
            <circle cx="30" cy="30" r="30" />
          </clipPath>
          <g clipPath="url(#circle-clip-es)">
            {/* Red top */}
            <rect x="0" y="0" width="60" height="15" fill="#AA151B" />
            {/* Yellow middle */}
            <rect x="0" y="15" width="60" height="30" fill="#F1BF00" />
            {/* Red bottom */}
            <rect x="0" y="45" width="60" height="15" fill="#AA151B" />
            {/* Emblem representation */}
            <circle cx="20" cy="30" r="5" fill="#AA151B" opacity="0.85" />
            <circle cx="20" cy="30" r="3" fill="#FFF" opacity="0.9" />
          </g>
          <circle cx="30" cy="30" r="29" fill="none" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
};

export default LanguageFlagBadge;
