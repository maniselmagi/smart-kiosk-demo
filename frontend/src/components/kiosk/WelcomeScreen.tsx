import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import restaurantFoodImg from '../../assets/restaurant_food_welcome.jpg';
import royalEmberLogo from '../../assets/royal_ember_logo.jpg';
import { LanguageFlagBadge } from '../common/LanguageFlagBadge';
import { Language, LanguageOption } from '../../utils/translations';
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
  ShieldCheck,
  Globe,
  Check,
  ArrowRight
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenLanguage?: () => void;
  onOpenStaffLogin?: () => void;
  isBookingMode?: boolean;
}

// Recommended order: Indian regional languages first, followed by international
const ORDERED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳', short: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', short: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳', short: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳', short: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', flag: '🇮🇳', short: 'മലയാളം' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇦🇪', short: 'AR' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪', short: 'DE' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷', short: 'KO' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  onOpenStaffLogin,
  isBookingMode = false
}) => {
  const { 
    theme, 
    toggleTheme,
    isAccessibilityMode,
    language,
    setLanguage,
    t
  } = useKiosk();

  const [isOpenAnimated, setIsOpenAnimated] = useState(false);

  React.useEffect(() => {
    // Smooth cinematic entrance
    const timer = setTimeout(() => setIsOpenAnimated(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
  };

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-between relative overflow-y-auto overflow-x-hidden transition-colors duration-500 select-none ${
        isAccessibilityMode 
          ? 'bg-slate-950 text-white' 
          : theme === 'dark'
            ? 'bg-[#080B11] text-slate-100'
            : 'bg-gradient-to-b from-amber-50/50 via-white to-slate-100 text-slate-900'
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

        {/* Center Golden Medallion Crest */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isOpenAnimated ? 'scale-125 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/30 blur-2xl animate-pulse" />
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

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP FLOATING BRAND & CONTROLS BAR */}
      <header className={`relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between gap-3 transition-all duration-700 ${
        isOpenAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        {/* Brand Crest Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-lg">
          <div className="w-6 h-6 rounded-lg overflow-hidden border border-amber-400/40 shrink-0">
            <img src={royalEmberLogo} alt="Royal Ember Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase font-display">
            Royal Ember Dining &amp; Banquet
          </span>
        </div>

        {/* Right Controls: Staff Mode Login + Theme Toggle */}
        <div className="flex items-center gap-2">
          {onOpenStaffLogin && (
            <button
              type="button"
              onClick={onOpenStaffLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-amber-500/40 hover:border-amber-300 active:scale-95 cursor-pointer shadow-lg text-xs font-bold group"
              title="Staff Station Login (Management & Kitchen)"
              aria-label="Staff Login"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-display tracking-wider text-[11px] uppercase">
                Login
              </span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-amber-400 hover:text-amber-300 transition-all border border-white/10 active:scale-95 cursor-pointer shadow-lg"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* 2. TOP SECTION: RESTAURANT NAME & ATMOSPHERE SHOWCASE */}
      <div className={`relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex flex-col items-center text-center transition-all duration-1000 delay-150 ${
        isOpenAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
      }`}>
        {/* Golden Medallion Crown */}
        <div className="relative mb-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-300/40">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Welcome Eyebrow */}
        <div className="inline-flex items-center justify-center gap-2 mb-1.5">
          <span className="h-[1px] w-6 sm:w-12 bg-amber-500/60" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-500 dark:text-amber-400">
            {t.welcomeTo || 'Welcome To'}
          </span>
          <span className="h-[1px] w-6 sm:w-12 bg-amber-500/60" />
        </div>

        {/* Prominent Highlighted Restaurant Name */}
        <h1 className="font-royal text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 drop-shadow-[0_4px_25px_rgba(245,158,11,0.4)] leading-tight animate-gold-shimmer">
          ROYAL EMBER
        </h1>

        {/* Restaurant Subtitle */}
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <span className="h-[1px] w-6 sm:w-12 bg-slate-300 dark:bg-slate-700" />
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-600 dark:text-amber-300/90">
            {t.diningAndBanquet || 'Restaurant & Grand Banquet'}
          </p>
          <span className="h-[1px] w-6 sm:w-12 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Compact Culinary Hero Showcase with Atmospheric Highlights */}
        <div className="relative w-full max-w-3xl mt-4 sm:mt-5 rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
          <div className="relative h-32 sm:h-40 md:h-44 w-full overflow-hidden">
            <img
              src={restaurantFoodImg}
              alt="Royal Ember Artisanal Presentation"
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Dark vignette overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            {/* Ambient slogan banner */}
            <div className="absolute bottom-3 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
              <div>
                <p className="text-sm sm:text-base font-extrabold text-white tracking-wide drop-shadow-md">
                  Exceptional Food, Delivered Fresh
                </p>
                <p className="text-[11px] sm:text-xs text-amber-300/90 font-medium">
                  {isBookingMode 
                    ? 'Instant live table allocation & prompt hospitality service'
                    : 'Gourmet artisanal meals prepared fresh & served directly to your table'}
                </p>
              </div>

              {/* Hospitality badges */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  <Utensils className="w-3 h-3 text-amber-400" />
                  Artisanal Kitchen
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Table-Side Service
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  <Wine className="w-3 h-3 text-amber-400" />
                  Fine Dining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: LANGUAGE SELECTION & PROCEED ACTION */}
      <div className={`relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-5 pb-8 sm:pb-10 flex flex-col transition-all duration-1000 delay-300 ${
        isOpenAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        
        {/* Section Header: Language Title & Guidance */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Globe className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white uppercase font-display flex items-center gap-2">
                <span>{t.chooseLanguageHeader || 'Choose Your Language'}</span>
                <span className="text-amber-400 text-xs font-bold font-sans">/ மொழியைத் தேர்ந்தெடுக்கவும்</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {t.selectLanguageHelpText || 'Select your preferred language below for personalized dining service.'}
              </p>
            </div>
          </div>

          {/* Current Selection Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black">
            <span>Active:</span>
            <span className="text-white uppercase tracking-wider">{ORDERED_LANGUAGES.find(l => l.code === language)?.label || 'English'}</span>
          </div>
        </div>

        {/* LANGUAGE SELECTION GRID (Touch-friendly 11 languages) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {ORDERED_LANGUAGES.map((langItem) => {
            const isSelected = language === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => handleSelectLanguage(langItem.code)}
                className={`relative px-3 py-2.5 sm:py-3 rounded-2xl flex items-center justify-between gap-2.5 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-yellow-500/20 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.02] text-white'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white'
                }`}
              >
                {/* Left: Flag & Native / English Names */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <LanguageFlagBadge code={langItem.code} size={30} />
                  <div className="flex flex-col leading-tight truncate">
                    <span className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-amber-300' : 'text-slate-100'}`}>
                      {langItem.nativeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {langItem.label}
                    </span>
                  </div>
                </div>

                {/* Right: Selected Checkmark Indicator */}
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm animate-scale-in">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 opacity-40" />
                )}
              </button>
            );
          })}
        </div>

        {/* 4. PROMINENT GRAND ACTION BUTTON */}
        <div className="mt-5 sm:mt-6 w-full max-w-xl mx-auto">
          <button
            type="button"
            onClick={onStart}
            className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base md:text-lg shadow-[0_8px_30px_rgba(245,158,11,0.45)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            {/* Left Circular Icon Badge */}
            <div className="w-10 h-10 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
              {isBookingMode ? (
                <Crown className="w-5 h-5" />
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </div>

            {/* Center Dynamic Label */}
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <span className="leading-tight tracking-wider uppercase">
                {isBookingMode 
                  ? (t.proceedToBookingBtn || 'Proceed to Table Booking')
                  : (t.startOrdering || 'Start Ordering')}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900/80 tracking-normal normal-case">
                {isBookingMode 
                  ? 'Tap to select table & dining slot' 
                  : 'Browse gourmet menu in selected language'}
              </span>
            </div>

            {/* Right Chevrons */}
            <div className="flex items-center text-slate-950 group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
            Royal Ember Smart Table-Side &amp; Booking Concierge
          </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
