import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import restaurantFoodImg from '../../assets/restaurant_food_welcome.jpg';
import { 
  ShoppingBag, 
  ChevronRight, 
  Sun, 
  Moon, 
  Utensils, 
  Sparkles, 
  Clock, 
  Wine,
  Crown,
  ShieldCheck
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenLanguage?: () => void;
  onOpenStaffLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  onOpenLanguage,
  onOpenStaffLogin
}) => {
  const { 
    theme, 
    toggleTheme,
    isAccessibilityMode
  } = useKiosk();

  const [isOpenAnimated, setIsOpenAnimated] = React.useState(false);

  React.useEffect(() => {
    // 250ms initial pause so the customer sees the glowing golden royal crest before doors glide apart
    const timer = setTimeout(() => setIsOpenAnimated(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-between relative overflow-hidden transition-colors duration-500 select-none ${
        isAccessibilityMode 
          ? 'bg-slate-950 text-white' 
          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* GRAND DINING DOUBLE-DOOR CINEMATIC OPENING EFFECT */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
          isOpenAnimated ? 'opacity-0 delay-700 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left Luxury Door Panel */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-r border-amber-500/40 shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-end ${
            isOpenAnimated ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Subtle vertical luxury gold border accents */}
          <div className="h-full w-1 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-60" />
        </div>

        {/* Right Luxury Door Panel */}
        <div 
          className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-slate-950 via-slate-900 to-slate-950 border-l border-amber-500/40 shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-start ${
            isOpenAnimated ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="h-full w-1 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-60" />
        </div>

        {/* Center Golden Medallion Crest (Scales gently and dissolves as doors glide open) */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isOpenAnimated ? 'scale-125 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Ambient Golden Halo Glow */}
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/30 blur-2xl animate-pulse" />
            
            {/* Medallion Badge */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-[0_0_40px_rgba(245,158,11,0.7)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-amber-300/40 text-amber-300">
                <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>

            <p className="font-royal text-xs font-black uppercase tracking-[0.3em] text-amber-400 mt-3 drop-shadow-md">
              Royal Ember
            </p>
          </div>
        </div>
      </div>

      {/* 1. TOP FLOATING BRAND & CONTROLS BAR */}
      <header className={`absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 lg:inset-x-12 flex items-center justify-between z-30 pointer-events-none transition-all duration-700 delay-150 ${
        isOpenAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        {/* Subtle Brand Watermark Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-lg pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-display">
            Royal Ember Dining
          </span>
        </div>

        {/* Top Right Controls: Staff Mode Login (Management & Kitchen) + Theme Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mode Change / Staff Login (Kitchen & Management) */}
          <button
            type="button"
            onClick={onOpenStaffLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-amber-500/40 hover:border-amber-300 active:scale-95 cursor-pointer shadow-xl text-xs font-bold group"
            title="Staff Station Login (Management & Kitchen)"
            aria-label="Staff Login"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-display tracking-wider text-[11px] uppercase">
              Login
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-white/20 active:scale-95 cursor-pointer shadow-xl"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
          </button>
        </div>
      </header>

      {/* 2. HERO RESTAURANT FOOD PHOTOGRAPHY (Cinematic Entrance Zoom & Fade) */}
      <div className="relative w-full h-[45vh] sm:h-[48vh] md:h-[50vh] lg:h-[52vh] overflow-hidden shrink-0">
        <img
          src={restaurantFoodImg}
          alt="Royal Ember Gourmet Signature Culinary Presentation"
          className={`w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.04] transition-all duration-1200 ease-out ${
            isOpenAnimated ? 'scale-100 opacity-100 blur-0' : 'scale-115 opacity-20 blur-[8px]'
          }`}
        />

        {/* Ambient Top Golden Beam */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          isOpenAnimated ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Soft top gradient for header readability */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />

        {/* Bottom smooth fade seamlessly melting photo into the page */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 md:h-52 bg-gradient-to-t from-white dark:from-slate-950 via-white/85 dark:via-slate-950/85 to-transparent pointer-events-none" />
      </div>

      {/* 3. LOWER SECTION: BALANCED TABLET TYPOGRAPHY & INTERACTIVE CONTROLS */}
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-24 pt-2 sm:pt-4 pb-8 sm:pb-12 md:pb-14 z-10 max-w-4xl mx-auto w-full text-center">
        
        {/* Core Brand & Supporting Content */}
        <div className={`space-y-4 sm:space-y-5 transition-all duration-1000 delay-200 ease-out ${
          isOpenAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          
          {/* Subtitle Eyebrow */}
          <div className="inline-flex items-center justify-center gap-2">
            <span className="h-[1px] w-6 sm:w-10 bg-amber-500/60" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-600 dark:text-amber-400">
              Welcome To
            </span>
            <span className="h-[1px] w-6 sm:w-10 bg-amber-500/60" />
          </div>

          {/* Grand Prominent Highlighted Restaurant Title with Shimmer Glow */}
          <div>
            <h1 className="font-royal text-4xl sm:text-6xl md:text-7xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-400 drop-shadow-[0_4px_25px_rgba(245,158,11,0.4)] leading-tight animate-gold-shimmer">
              ROYAL EMBER
            </h1>
            
            {/* Elegant Sub-Brand Slogan */}
            <div className="flex items-center justify-center gap-3 mt-2 sm:mt-2.5">
              <span className="h-[1px] w-8 sm:w-16 bg-slate-300 dark:bg-slate-700" />
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                Restaurant &amp; Grand Banquet
              </p>
              <span className="h-[1px] w-8 sm:w-16 bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>

          {/* Supporting Headline & Description (Balanced across tablet width) */}
          <div className="max-w-2xl mx-auto space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Exceptional Food, Delivered Fresh
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
              Experience gourmet-quality culinary meals prepared with care and delivered faster than ever — straight to your table.
            </p>
          </div>

          {/* Tablet Feature Highlights (fills tablet width horizontally with luxury hospitality badges) */}
          <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>Chef's Artisanal Menu</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Fast Table-Side Service</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform">
              <Wine className="w-3.5 h-3.5 text-amber-500" />
              <span>Fine Dining Experience</span>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM ACTION CONTROLLER PILL (Balanced & Ergonomic for Tablet Touch with Open Animation) */}
        <div className={`pt-6 sm:pt-8 md:pt-10 w-full max-w-xl mx-auto transition-all duration-1000 delay-400 ease-out ${
          isOpenAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'
        }`}>
          <div className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl flex items-center justify-between gap-3 animate-pulse-ring">
            
            {/* Left Circular Button (Food Cloche / Menu Icon) */}
            <button
              type="button"
              onClick={onOpenLanguage || onStart}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center border border-slate-200/70 dark:border-slate-700/70 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer group"
              title="Explore Menu & Languages"
              aria-label="Explore Menu"
            >
              <div className="p-2.5 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </button>

            {/* Right Action Button (Start with black circle badge and >>> chevrons) */}
            <button
              type="button"
              onClick={onStart}
              className="flex-1 h-13 sm:h-15 px-3 sm:px-4 pr-6 sm:pr-8 rounded-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer group"
            >
              {/* Black Circular Icon on the Left */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Start Label */}
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-wider group-hover:text-amber-500 transition-colors">
                Start Ordering
              </span>

              {/* Triple Chevrons >>> */}
              <div className="flex items-center text-slate-400 dark:text-slate-500 group-hover:text-amber-500 group-hover:translate-x-1.5 transition-all">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -mr-2 sm:-mr-2.5" />
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -mr-2 sm:-mr-2.5" />
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>

          </div>

          {/* Gentle interactive instruction hint below the pill */}
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-3 tracking-wide">
            Tap <span className="text-amber-500 font-semibold">Start Ordering</span> to browse our digital menu
          </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
