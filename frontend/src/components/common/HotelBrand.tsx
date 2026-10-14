import React from 'react';
import royalEmberLogo from '../../assets/royal_ember_logo.jpg';

interface HotelBrandProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  align?: 'left' | 'center';
  showTagline?: boolean;
  showDescriptor?: boolean;
  className?: string;
}

export const HotelBrand: React.FC<HotelBrandProps> = ({
  size = 'md',
  align = 'left',
  showTagline = true,
  showDescriptor = true,
  className = ''
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`flex ${isCenter ? 'flex-col items-center text-center' : 'items-center gap-3.5 text-left'} ${className}`}>
      {/* High Resolution Royal Ember Gold Crest Logo */}
      <div 
        className={`relative rounded-2xl overflow-hidden shrink-0 shadow-lg border border-amber-500/30 dark:border-amber-400/30 transition-transform duration-300 hover:scale-105 ${
          size === 'hero' 
            ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-amber-500/20' 
            : size === 'lg'
            ? 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-amber-500/15'
            : size === 'md'
            ? 'w-12 h-12 rounded-xl shadow-amber-500/10'
            : 'w-10 h-10 rounded-lg shadow-sm'
        }`}
      >
        <img 
          src={royalEmberLogo} 
          alt="Royal Ember Restaurant & Banquet Logo" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Luxury Glass Glare Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Hotel Typography */}
      <div className={`${isCenter ? 'mt-3' : ''} leading-tight`}>
        <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}>
          <h1 
            className={`font-black font-display tracking-tight text-slate-900 dark:text-white uppercase ${
              size === 'hero' 
                ? 'text-3xl sm:text-4xl md:text-5xl tracking-wide' 
                : size === 'lg'
                ? 'text-2xl sm:text-3xl tracking-wide'
                : size === 'md'
                ? 'text-lg sm:text-xl'
                : 'text-base font-extrabold'
            }`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500">
              Royal Ember
            </span>
          </h1>
        </div>

        {showDescriptor && (
          <p 
            className={`font-extrabold tracking-widest uppercase text-amber-700/80 dark:text-amber-300/80 mt-0.5 ${
              size === 'hero' ? 'text-xs sm:text-sm tracking-[0.25em]' : size === 'lg' ? 'text-[11px] sm:text-xs tracking-[0.2em]' : 'text-[10px] tracking-[0.15em]'
            }`}
          >
            Restaurant &amp; Banquet
          </p>
        )}

        {showTagline && (
          <p 
            className={`italic font-serif text-slate-500 dark:text-slate-400 mt-1 ${
              size === 'hero' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-xs sm:text-sm' : 'text-[11px]'
            }`}
          >
            Good Food • Great Moments
          </p>
        )}
      </div>
    </div>
  );
};

export default HotelBrand;
