import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { 
  UtensilsCrossed, 
  ArrowRight, 
  Globe, 
  Eye, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { 
    tableNumber, 
    language, 
    setLanguage, 
    isAccessibilityMode, 
    toggleAccessibility, 
    t 
  } = useKiosk();

  return (
    <div className={`min-h-[calc(100vh-45px)] flex flex-col justify-between p-6 md:p-12 transition-colors relative overflow-hidden ${
      isAccessibilityMode 
        ? 'bg-slate-950 text-white' 
        : 'bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 text-slate-900'
    }`}>
      
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto z-10">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight font-display text-slate-900">
              OrderEase
            </span>
            <p className="text-xs text-slate-600 font-medium">
              Gourmet Table-Side Dining
            </p>
          </div>
        </div>

        {/* Accessibility & Language */}
        <div className="flex items-center gap-3">
          
          {/* Accessibility toggle */}
          <button
            onClick={toggleAccessibility}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isAccessibilityMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-slate-700 border-slate-200/80 hover:bg-slate-100 shadow-sm'
            }`}
            title="Toggle Accessibility Mode"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">A11y</span>
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200/80 shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'ta'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              தமிழ்
            </button>
          </div>

        </div>
      </div>

      {/* Main Center Tablet Welcome Experience */}
      <div className="my-auto py-8 flex flex-col items-center text-center max-w-3xl mx-auto z-10">
        
        {/* Prominent Table Number Card */}
        <div className="mb-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white shadow-kiosk border border-slate-200/70 animate-bounce-subtle">
          <span className="text-xs uppercase tracking-widest font-black text-slate-400">
            {t.table}
          </span>
          <span className="text-3xl md:text-4xl font-black text-brand-600 font-display">
            {tableNumber}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Welcome Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-display leading-tight mb-4">
          {t.welcomeTo}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-600 to-brand-500">
            OrderEase
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          {t.welcomeSubtitle}
        </p>

        {/* Big Touch-Friendly Start Ordering Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-extrabold text-xl md:text-2xl shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>{t.startOrdering}</span>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </button>

        {/* Quick Kiosk Highlights */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 w-full max-w-lg text-slate-600 text-xs">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-1.5">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">Visual Menus</span>
            <span className="text-[11px] text-slate-500">High-res photos</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-brand-100/80 text-brand-700 flex items-center justify-center mb-1.5">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">Live Prep Times</span>
            <span className="text-[11px] text-slate-500">Direct kitchen sync</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">Instant Pay</span>
            <span className="text-[11px] text-slate-500">UPI, Card, Split Bill</span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-600 z-10">
        <span>OrderEase Table-Side Kiosk System • v1.0 Presentation Build</span>
      </div>

    </div>
  );
};

export default WelcomeScreen;
