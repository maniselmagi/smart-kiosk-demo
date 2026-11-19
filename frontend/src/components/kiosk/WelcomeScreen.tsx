import React, { useState, useMemo, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import restaurantFoodImg from '../../assets/restaurant_food_welcome.jpg';
import { LanguageFlagBadge } from '../common/LanguageFlagBadge';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { 
  Crown,
  Sparkles, 
  ShieldCheck,
  Sun, 
  Moon,
  Search,
  Check,
  X
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenLanguage?: () => void;
  onOpenStaffLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  onOpenStaffLogin
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
  const [selectedLang, setSelectedLang] = useState<Language>(language || 'en');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 250ms initial pause so the customer sees the glowing golden royal crest before doors glide apart
    const timer = setTimeout(() => setIsOpenAnimated(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // Sync internal selected language when context language updates
  useEffect(() => {
    if (language) {
      setSelectedLang(language);
    }
  }, [language]);

  // Filter languages by search query (supports English label, native script, and code)
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return AVAILABLE_LANGUAGES;
    return AVAILABLE_LANGUAGES.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.nativeLabel.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentSelectedObj = useMemo(() => {
    return AVAILABLE_LANGUAGES.find((l) => l.code === selectedLang) || AVAILABLE_LANGUAGES[0];
  }, [selectedLang]);

  const handleSelectLanguage = (code: Language) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selectedLang);
    onStart();
  };

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-start relative overflow-y-auto overflow-x-hidden transition-colors duration-500 select-none ${
        isAccessibilityMode 
          ? 'bg-slate-950 text-white' 
          : theme === 'dark'
            ? 'bg-[#080B11] text-slate-100'
            : 'bg-gradient-to-b from-amber-50/40 via-white to-slate-100 text-slate-900'
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

      {/* 1. TOP FLOATING BRAND & CONTROLS BAR (OVER THE IMAGE) */}
      <header className={`absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 lg:inset-x-12 flex items-center justify-between z-30 pointer-events-none transition-all duration-700 delay-150 ${
        isOpenAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        {/* Subtle Brand Watermark Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-amber-500/30 text-amber-300 shadow-lg pointer-events-auto">
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
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-amber-500/40 hover:border-amber-300 active:scale-95 cursor-pointer shadow-xl text-xs font-bold group"
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
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-amber-300 hover:text-white transition-all border border-white/20 active:scale-95 cursor-pointer shadow-xl"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
          </button>
        </div>
      </header>

      {/* 2. HERO RESTAURANT FOOD PHOTOGRAPHY WITH ROYAL EMBER PLACED UP ON THE IMAGE */}
      <div className="relative w-full h-[32vh] sm:h-[36vh] md:h-[40vh] overflow-hidden shrink-0">
        <img
          src={restaurantFoodImg}
          alt="Royal Ember Gourmet Signature Culinary Presentation"
          className={`w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.08] transition-all duration-1200 ease-out ${
            isOpenAnimated ? 'scale-100 opacity-100 blur-0' : 'scale-115 opacity-20 blur-[8px]'
          }`}
        />

        {/* Ambient Top Golden Beam */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          isOpenAnimated ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Top gradient for header contrast */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

        {/* Darkening veil to make Royal Ember branding crystal-clear and radiant */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        {/* Bottom smooth fade melting photo into the background */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080B11] dark:from-[#080B11] via-[#080B11]/70 dark:via-[#080B11]/70 to-transparent pointer-events-none" />

        {/* ROYAL EMBER PLACED UP ON THE IMAGE */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-8 z-20 pointer-events-none transition-all duration-1000 delay-200 ease-out ${
          isOpenAnimated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
        }`}>
          {/* Subtitle Eyebrow */}
          <div className="inline-flex items-center justify-center gap-2 mb-1 sm:mb-1.5">
            <span className="h-[1px] w-6 sm:w-10 bg-amber-400/80" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {t.welcomeTo || 'Welcome To'}
            </span>
            <span className="h-[1px] w-6 sm:w-10 bg-amber-400/80" />
          </div>

          {/* Grand Prominent Highlighted Restaurant Title with Shimmer Glow */}
          <h1 className="font-royal text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] leading-tight animate-gold-shimmer">
            ROYAL EMBER
          </h1>
          
          {/* Elegant Sub-Brand Slogan */}
          <div className="flex items-center justify-center gap-2.5 mt-1 sm:mt-1.5">
            <span className="h-[1px] w-6 sm:w-12 bg-amber-400/50" />
            <p className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.25em] text-amber-200/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {t.diningAndBanquet || 'Restaurant & Grand Banquet'}
            </p>
            <span className="h-[1px] w-6 sm:w-12 bg-amber-400/50" />
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION: LANGUAGE SELECTION (PLACED EXACTLY IN MARKED POSITION) */}
      <main className="flex-1 w-full max-w-4xl lg:max-w-5xl mx-auto px-6 sm:px-10 md:px-12 py-4 flex flex-col justify-start z-10">
        
        {/* Title & Subtitle */}
        <div className="mt-1 mb-5 sm:mb-6 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
            {t.chooseLanguageHeader || 'Choose the language'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-2xl">
            {t.selectLanguageHelpText || 'Select your preferred language below This helps us serve you better.'}
          </p>
        </div>

        {/* "You Selected" Section */}
        <div className="mb-5 sm:mb-6 w-full">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-2.5">
            {t.youSelected || 'You Selected'}
          </h3>
          <div 
            className={`w-full h-15 sm:h-17 px-5 sm:px-6 rounded-2xl flex items-center justify-between border-2 border-[#00c5cd] transition-all shadow-md shadow-cyan-500/10 ${
              theme === 'dark'
                ? 'bg-[#161d27]'
                : 'bg-white'
            }`}
          >
            {/* Left: Circular Flag & Names */}
            <div className="flex items-center gap-4">
              <LanguageFlagBadge code={currentSelectedObj.code} size={38} />
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {currentSelectedObj.label}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  {currentSelectedObj.nativeLabel}
                </span>
              </div>
            </div>

            {/* Right: Filled Teal Checkmark Badge */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-sm shrink-0">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* "All Languages" Section */}
        <div className="flex-1 flex flex-col min-h-0 mb-6 sm:mb-8 w-full">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-2.5">
            {t.allLanguages || 'All Languages'}
          </h3>

          <div 
            className={`w-full flex-1 flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden shadow-sm transition-colors ${
              theme === 'dark'
                ? 'bg-[#151b24] border-slate-800'
                : 'bg-white border-slate-200/90'
            }`}
          >
            {/* Search Input Bar (Full Width) */}
            <div 
              className={`flex items-center gap-3.5 px-5 sm:px-6 py-3.5 border-b ${
                theme === 'dark' ? 'border-slate-800/80 bg-[#18202d]/50' : 'border-slate-100 bg-slate-50/40'
              }`}
            >
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder || 'Search'}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Scrollable Language List */}
            <div className="flex-1 overflow-y-auto max-h-[30vh] sm:max-h-[34vh] md:max-h-[38vh] divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLanguages.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  No language found matching "{searchQuery}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                        isSelected 
                          ? theme === 'dark'
                            ? 'bg-cyan-950/30'
                            : 'bg-cyan-50/70'
                          : theme === 'dark'
                            ? 'hover:bg-slate-800/40 active:bg-slate-800/60'
                            : 'hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      {/* Left: Flag + Language Name */}
                      <div className="flex items-center gap-4">
                        <LanguageFlagBadge code={lang.code} size={36} />
                        <div>
                          <span className={`text-sm sm:text-base md:text-lg font-semibold block leading-tight ${
                            isSelected 
                              ? 'text-slate-900 dark:text-white font-bold' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {lang.label}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium">
                            {lang.nativeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Right: Radio Selection Indicator */}
                      <div className="shrink-0 pl-3">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-slate-400 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* 4. BOTTOM ACTION BUTTON */}
        <div className="w-full pb-8 pt-1 shrink-0">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-14 sm:h-16 rounded-full bg-[#00c5cd] hover:bg-[#00b4bc] text-white font-black text-base sm:text-lg tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
          >
            {t.continueBtn || 'Continue'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default WelcomeScreen;
