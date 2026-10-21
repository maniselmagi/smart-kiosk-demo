import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import chefPlatingImg from '../../assets/chef_plating_welcome.jpg';
import { 
  ShoppingBag, 
  ChevronRight, 
  Sun, 
  Moon, 
  Utensils
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenLanguage?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  onOpenLanguage 
}) => {
  const { 
    theme,
    toggleTheme,
    isAccessibilityMode
  } = useKiosk();

  return (
    <div 
      className={`min-h-[calc(100vh-45px)] w-full flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isAccessibilityMode 
          ? 'bg-slate-950 text-white' 
          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* 1. TOP MINIMAL CONTROLS (Discreet Dark/Light Mode Only - Table/Battery/Wifi removed as requested) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-white/20 active:scale-95 cursor-pointer shadow-lg"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* 2. UPPER PORTION: GOURMET CHEF PLATING PHOTOGRAPHY (Tags removed, scales with tablet) */}
      <div className="relative w-full h-[52vh] sm:h-[54vh] md:h-[56vh] overflow-hidden shrink-0">
        <img
          src={chefPlatingImg}
          alt="Master Chef Plating Gourmet Food at Royal Ember"
          className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
        />

        {/* Soft top vignette */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* SMOOTH VERTICAL GRADIENT FADE INTO WHITE/DARK BACKGROUND */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* 3. LOWER PORTION: HIGHLIGHTED RESTAURANT NAME & SUPPORTING CONTENT */}
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-20 pb-8 sm:pb-12 pt-2 z-10 max-w-3xl mx-auto w-full">
        
        {/* Main Brand Typography Hierarchy */}
        <div className="space-y-4 text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Highlighted Grand Restaurant Title as Main Star */}
          <div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400 block mb-1">
              WELCOME TO
            </span>
            <h1 className="font-royal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
              ROYAL EMBER
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-2">
              <span className="h-[1.5px] w-8 sm:w-12 bg-amber-500/60" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Restaurant &amp; Grand Banquet
              </span>
              <span className="h-[1.5px] w-8 sm:w-12 bg-amber-500/60 sm:hidden" />
            </div>
          </div>

          {/* Supporting Headline & Description */}
          <div className="space-y-1.5 pt-1 sm:pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Exceptional Food, Delivered Fresh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mx-auto sm:mx-0">
              Experience gourmet-quality culinary meals prepared with care and delivered faster than ever — straight to your table.
            </p>
          </div>

        </div>

        {/* 4. BOTTOM ACTION CONTROLLER BAR (Matching Mockup Pill) */}
        <div className="pt-6 sm:pt-10">
          <div className="p-1.5 sm:p-2 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 max-w-lg mx-auto sm:mx-0">
            
            {/* Left Circular Button (Food Cloche / Menu Icon) */}
            <button
              type="button"
              onClick={onOpenLanguage || onStart}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center border border-slate-200/70 dark:border-slate-700/70 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer group"
              title="View Languages & Menu"
              aria-label="View Languages"
            >
              <div className="p-2 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors">
                <Utensils className="w-5 h-5" />
              </div>
            </button>

            {/* Right Action Button (Start with black circle badge and >>> chevrons) */}
            <button
              type="button"
              onClick={onStart}
              className="flex-1 h-13 sm:h-14 px-2.5 pr-6 rounded-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer group"
            >
              {/* Black Circular Icon on the Left */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center shadow-sm shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              {/* Start Label */}
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-wide">
                Start
              </span>

              {/* Triple Chevrons >>> */}
              <div className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-amber-500 group-hover:translate-x-1.5 transition-all">
                <ChevronRight className="w-4 h-4 -mr-2.5" />
                <ChevronRight className="w-4 h-4 -mr-2.5" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
