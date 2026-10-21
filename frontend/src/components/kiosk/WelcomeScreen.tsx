import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import chefPlatingImg from '../../assets/chef_plating_welcome.jpg';
import { 
  ShoppingBag, 
  ChevronRight, 
  Sun, 
  Moon, 
  Wifi, 
  Battery, 
  Sparkles,
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
    tableNumber, 
    theme,
    toggleTheme,
    isAccessibilityMode
  } = useKiosk();

  // Status bar live clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`min-h-[calc(100vh-45px)] w-full flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
        isAccessibilityMode 
          ? 'bg-slate-950 text-white' 
          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* 1. TOP MINIMAL MOBILE/TABLET STATUS HEADER */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-3.5 text-xs font-bold text-slate-900 dark:text-white drop-shadow-md">
        {/* Left: Time and Table Badge */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-black text-sm tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {currentTime || '12:30'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-300 border border-white/20">
            Table {tableNumber}
          </span>
        </div>

        {/* Right: Connectivity & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Subtle Dark/Light Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-white/20 active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-white" />}
          </button>

          <div className="flex items-center gap-1.5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 2. UPPER 60-65%: GOURMET CHEF PLATING PHOTOGRAPHY */}
      <div className="relative w-full h-[58vh] sm:h-[62vh] max-h-[640px] overflow-hidden">
        <img
          src={chefPlatingImg}
          alt="Master Chef Plating Gourmet Food at Royal Ember"
          className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
        />

        {/* Cinematic dark tint at top for readable status text */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />

        {/* FLOATING ARTISAN DISH LABEL (Exact match to reference mockup) */}
        <div className="absolute top-[52%] left-[43%] sm:left-[45%] z-20 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in-95 duration-700">
          {/* Frosted Translucent Badge */}
          <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-[10px] font-black tracking-wide text-white shadow-xl flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Fresh Lamb Chop</span>
          </div>
          {/* Delicate Dotted Pointer Line to the Plate */}
          <div className="w-[1px] h-6 border-l-2 border-dotted border-white/90 drop-shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
        </div>

        {/* SMOOTH VERTICAL GRADIENT FADE INTO WHITE/DARK BACKGROUND */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* 3. LOWER 35-40%: HEADLINE, SUBTITLE & BOTTOM CONTROLLER BAR */}
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 pt-1 z-10 max-w-2xl mx-auto w-full">
        
        {/* Typography Content */}
        <div className="space-y-2 sm:space-y-2.5 text-left animate-in fade-in slide-in-from-bottom-3 duration-500">
          
          {/* Hotel Brand Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Royal Ember Restaurant &amp; Banquet</span>
          </div>

          {/* Big Bold Headline (Exact match to reference mockup) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-display">
            Exceptional Food,<br />
            Delivered Fresh
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
            Experience gourmet-quality meals prepared with care and delivered faster than ever — straight to your table.
          </p>
        </div>

        {/* 4. BOTTOM ACTION CONTROLLER BAR (Exact match to reference mockup) */}
        <div className="pt-4 sm:pt-6">
          <div className="p-1.5 sm:p-2 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
            
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
