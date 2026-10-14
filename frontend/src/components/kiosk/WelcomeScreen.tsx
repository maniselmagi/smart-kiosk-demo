import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { HotelBrand } from '../common/HotelBrand';
import { 
  ArrowRight, 
  Clock as ClockIcon, 
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onChangeLanguage?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  onChangeLanguage 
}) => {
  const { 
    tableNumber, 
    theme,
    toggleTheme,
    isAccessibilityMode, 
    t 
  } = useKiosk();

  // Real-time live digital clock updating every second
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-[calc(100vh-45px)] flex flex-col justify-between p-4 md:p-8 transition-colors duration-300 relative overflow-hidden ${
      isAccessibilityMode 
        ? 'bg-slate-950 text-white' 
        : 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* Decorative Golden Ambient Atmosphere */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-400/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR: Left: Hotel Name & Logo | Middle: Dark/Light Mode | Right: Live Clock */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 z-10 py-2 border-b border-slate-200/60 dark:border-slate-800/60">
        
        {/* Left Side: Hotel Name and Logo */}
        <div 
          onClick={onChangeLanguage}
          className="cursor-pointer group"
          title="Royal Ember Restaurant & Banquet"
        >
          <HotelBrand size="md" align="left" showTagline={false} showDescriptor={true} />
        </div>

        {/* Middle: Dark and Light Mode Option */}
        <div className="flex items-center justify-center">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-amber-400 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 shadow-sm active:scale-95 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark and Light Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Live Digital Clock */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <ClockIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-right leading-tight">
            <span className="font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight block">
              {currentTime || '--:--:--'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium hidden sm:block">
              {currentDate}
            </span>
          </div>
        </div>

      </div>

      {/* CENTER / MIDDLE: Table Number, Welcome Note, Start Ordering */}
      <div className="my-auto py-10 flex flex-col items-center text-center max-w-3xl mx-auto z-10 animate-fade-in">
        
        {/* Table Number Pill */}
        <div className="mb-6 inline-flex items-center gap-3 px-7 py-3 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-amber-500/10 border border-amber-500/20 dark:border-amber-400/20">
          <span className="text-xs uppercase tracking-widest font-black text-slate-400 dark:text-slate-400">
            {t.table}
          </span>
          <span className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400 font-display">
            {tableNumber}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Welcome Note */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-display leading-tight mb-3">
          {t.welcomeTo}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500">
            Royal Ember
          </span>
        </h1>

        <p className="font-extrabold uppercase tracking-widest text-xs sm:text-sm text-amber-700/90 dark:text-amber-400/90 mb-3">
          Restaurant &amp; Banquet • Good Food • Great Moments
        </p>

        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
          {t.welcomeSubtitle || "Browse our chef's curated menu, customize dishes, and order instantly from your table."}
        </p>

        {/* Primary Start Ordering CTA */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 rounded-2xl bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 text-white font-black text-xl md:text-2xl shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>{t.startOrdering}</span>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </button>

        {/* Subtle quick language switch link */}
        {onChangeLanguage && (
          <button
            onClick={onChangeLanguage}
            className="mt-6 text-xs text-slate-400 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Need to change language? Tap here</span>
          </button>
        )}

      </div>

      {/* BOTTOM / LAST: Version Line Details */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-400 z-10 py-2">
        <span>Royal Ember Table-Side Kiosk System • v1.0 Presentation Build</span>
      </div>

    </div>
  );
};

export default WelcomeScreen;
