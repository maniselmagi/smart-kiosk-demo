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
  size = 36 
}) => {
  const clipId = `circle-clip-${code}-${Math.random().toString(36).substring(2, 6)}`;

  return (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 shadow-sm border border-black/10 dark:border-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <defs>
          <clipPath id={clipId}>
            <circle cx="30" cy="30" r="30" />
          </clipPath>
        </defs>
        
        <g clipPath={`url(#${clipId})`}>
          {/* 1. ARABIC (UAE Flag - exact match to reference image) */}
          {code === 'ar' && (
            <>
              {/* Green Top */}
              <rect x="0" y="0" width="60" height="20" fill="#00732f" />
              {/* White Center */}
              <rect x="0" y="20" width="60" height="20" fill="#ffffff" />
              {/* Black Bottom */}
              <rect x="0" y="40" width="60" height="20" fill="#000000" />
              {/* Red Hoist on Left */}
              <rect x="0" y="0" width="18" height="60" fill="#ff0000" />
            </>
          )}

          {/* 2. SPANISH (Spain Flag) */}
          {code === 'es' && (
            <>
              <rect x="0" y="0" width="60" height="15" fill="#AA151B" />
              <rect x="0" y="15" width="60" height="30" fill="#F1BF00" />
              <rect x="0" y="45" width="60" height="15" fill="#AA151B" />
              <circle cx="20" cy="30" r="4.5" fill="#AA151B" opacity="0.9" />
              <circle cx="20" cy="30" r="2.5" fill="#FFF" opacity="0.9" />
            </>
          )}

          {/* 3. FRENCH (France Flag) */}
          {code === 'fr' && (
            <>
              <rect x="0" y="0" width="20" height="60" fill="#002395" />
              <rect x="20" y="0" width="20" height="60" fill="#ffffff" />
              <rect x="40" y="0" width="20" height="60" fill="#ED2939" />
            </>
          )}

          {/* 4. GERMAN (Germany Flag) */}
          {code === 'de' && (
            <>
              <rect x="0" y="0" width="60" height="20" fill="#000000" />
              <rect x="0" y="20" width="60" height="20" fill="#DD0000" />
              <rect x="0" y="40" width="60" height="20" fill="#FFCC00" />
            </>
          )}

          {/* 5. INDIAN LANGUAGES (Hindi, Tamil, Telugu, Kannada, Malayalam - India Flag) */}
          {(code === 'hi' || code === 'ta' || code === 'te' || code === 'kn' || code === 'ml') && (
            <>
              <rect x="0" y="0" width="60" height="20" fill="#FF9933" />
              <rect x="0" y="20" width="60" height="20" fill="#FFFFFF" />
              <rect x="0" y="40" width="60" height="20" fill="#138808" />
              {/* Ashoka Chakra Center */}
              <circle cx="30" cy="30" r="7.5" fill="none" stroke="#000080" strokeWidth="1.2" />
              <circle cx="30" cy="30" r="1.5" fill="#000080" />
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
            </>
          )}

          {/* 6. KOREAN (South Korea Flag) */}
          {code === 'ko' && (
            <>
              <rect width="60" height="60" fill="#FFFFFF" />
              {/* Taegeuk Circle (Red top, Blue bottom) */}
              <path d="M 18,30 A 12,12 0 0,1 42,30 A 6,6 0 0,0 30,30 A 6,6 0 0,1 18,30" fill="#C60C30" />
              <path d="M 42,30 A 12,12 0 0,1 18,30 A 6,6 0 0,0 30,30 A 6,6 0 0,1 42,30" fill="#003478" />
              {/* Trigrams */}
              <line x1="8" y1="12" x2="16" y2="12" stroke="#000" strokeWidth="1.8" />
              <line x1="8" y1="16" x2="16" y2="16" stroke="#000" strokeWidth="1.8" />
              <line x1="44" y1="44" x2="52" y2="44" stroke="#000" strokeWidth="1.8" />
              <line x1="44" y1="48" x2="52" y2="48" stroke="#000" strokeWidth="1.8" />
            </>
          )}

          {/* 7. ENGLISH (United Kingdom Union Jack) */}
          {code === 'en' && (
            <>
              <rect width="60" height="60" fill="#012169" />
              <path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFF" strokeWidth="8" />
              <path d="M0,0 L60,60" stroke="#C8102E" strokeWidth="4" />
              <path d="M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
              <path d="M30,0 L30,60 M0,30 L60,30" stroke="#FFF" strokeWidth="12" />
              <path d="M30,0 L30,60 M0,30 L60,30" stroke="#C8102E" strokeWidth="6" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default LanguageFlagBadge;
