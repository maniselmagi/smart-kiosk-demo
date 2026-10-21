import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { LanguageFlagBadge } from '../common/LanguageFlagBadge';
import { 
  ChevronLeft, 
  Search, 
  Check, 
  Sun, 
  Moon,
  Sparkles,
  ArrowRight,
  Globe2,
  X
} from 'lucide-react';

interface LanguageEntryScreenProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const LanguageEntryScreen: React.FC<LanguageEntryScreenProps> = ({ 
  onContinue, 
  onBack 
}) => {
  const { 
    language, 
    setLanguage, 
    t,
    theme, 
    toggleTheme, 
    isAccessibilityMode 
  } = useKiosk();

  const [selectedLang, setSelectedLang] = useState<Language>(language || 'en');
  const [searchQuery, setSearchQuery] = useState('');

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
    onContinue();
  };

  return (
    <div 
      className={`min-h-[100dvh] w-full flex flex-col justify-between transition-colors duration-300 select-none overflow-x-hidden ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : theme === 'dark'
            ? 'bg-[#0b0f15] text-white'
            : 'bg-gradient-to-br from-[#e3f7fa] via-[#f3fbfd] to-[#edf9fb] text-slate-900'
      }`}
    >
      {/* 1. TOP RESPONSIVE HEADER BAR (Spans Full Width across Tablet) */}
      <header className="w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-5 sm:pt-6 pb-2 flex items-center justify-between z-20 shrink-0">
        
        {/* Left: Back Button & Step Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#18202c] hover:bg-[#202a3a] text-white border border-slate-800'
                : 'bg-white hover:bg-[#d8f4f8] text-slate-800 border border-cyan-100 shadow-sm'
            }`}
            title={t.backBtn || "Back"}
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-wide">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Step 1 of 2</span>
          </div>
        </div>

        {/* Center: Restaurant Brand Name (Discreet) */}
        <div className="flex items-center gap-2">
          <span className="font-royal text-base sm:text-lg font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-500">
            ROYAL EMBER
          </span>
        </div>

        {/* Right: Theme Toggle Button */}
        <div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#18202c] text-amber-400 hover:text-white border border-slate-800'
                : 'bg-white text-slate-700 hover:text-slate-950 border border-cyan-100 shadow-sm'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300" /> : <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN RESPONSIVE FULL-PAGE BODY (2-Column Grid on Tablet, Full Width) */}
      <main className="flex-1 w-full px-5 sm:px-8 md:px-12 lg:px-16 py-4 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: TITLE, INFO & YOU SELECTED (5 Cols on Tablet) ================= */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            
            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Lingual Ordering</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {t.chooseLanguageHeader || 'Choose the language'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed pt-1">
                {t.selectLanguageHelpText || 'Select your preferred language below This helps us serve you better.'}
              </p>
            </div>

            {/* "You Selected" Card (Cyan Highlighted Box) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.youSelected || 'You Selected'}
                </h2>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  Active Language
                </span>
              </div>

              <div 
                className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 border-[#00c5cd] transition-all shadow-md shadow-cyan-500/10 ${
                  theme === 'dark'
                    ? 'bg-[#151c27]'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <LanguageFlagBadge code={currentSelectedObj.code} size={42} />
                  <div>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white block leading-tight">
                      {currentSelectedObj.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {currentSelectedObj.nativeLabel}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-md shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Tablet Hospitality Highlights */}
            <div className={`hidden md:block p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#121722]/80 border-slate-800' : 'bg-white/70 border-cyan-100 shadow-xs'
            }`}>
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Instant translation across all 60+ dishes and drinks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Digital bill & receipts printed in selected language</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>Switch language anytime during your meal</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ALL LANGUAGES CONTAINER (7 Cols on Tablet) ================= */}
          <div className="md:col-span-7 flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t.allLanguages || 'All Languages'}
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {filteredLanguages.length} Available
              </span>
            </div>

            {/* Container Box with Search & Grid of Languages */}
            <div 
              className={`w-full rounded-2xl sm:rounded-3xl border overflow-hidden shadow-lg transition-colors flex flex-col ${
                theme === 'dark'
                  ? 'bg-[#131923] border-slate-800 shadow-black/40'
                  : 'bg-white border-slate-200/90 shadow-slate-200/50'
              }`}
            >
              {/* Search Bar at Top */}
              <div 
                className={`flex items-center gap-3 px-4 py-3.5 border-b ${
                  theme === 'dark' ? 'border-slate-800/80 bg-[#161e2b]' : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder || 'Search by language or native script...'}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Scrollable Language Grid (2 Columns on Tablet for Full-Page Coverage!) */}
              <div className="p-3 sm:p-4 overflow-y-auto max-h-[50vh] sm:max-h-[56vh] md:max-h-[58vh]">
                {filteredLanguages.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">
                    No language found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredLanguages.map((lang) => {
                      const isSelected = selectedLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer border group ${
                            isSelected 
                              ? theme === 'dark'
                                ? 'bg-cyan-950/40 border-[#00c5cd] shadow-sm'
                                : 'bg-[#e7f9fb] border-[#00c5cd] shadow-sm'
                              : theme === 'dark'
                                ? 'bg-[#18202d]/70 hover:bg-[#1f293a] border-slate-800/80 active:scale-[0.99]'
                                : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200/70 active:scale-[0.99]'
                          }`}
                        >
                          {/* Flag + Name */}
                          <div className="flex items-center gap-3">
                            <LanguageFlagBadge code={lang.code} size={36} />
                            <div>
                              <span className={`text-sm sm:text-base font-bold block leading-tight ${
                                isSelected 
                                  ? 'text-[#0098a0] dark:text-cyan-400' 
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {lang.label}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {lang.nativeLabel}
                              </span>
                            </div>
                          </div>

                          {/* Radio Selection Indicator */}
                          <div className="shrink-0 pl-2">
                            {isSelected ? (
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-sm">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 transition-colors" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Prominent Continue Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-14 sm:h-15 rounded-2xl sm:rounded-full bg-[#00c5cd] hover:bg-[#00b4bc] text-white font-black text-base sm:text-lg tracking-wide shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>{t.continueBtn || 'Continue'}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* 3. SUBTLE FULL-PAGE FOOTER */}
      <footer className="w-full px-5 sm:px-8 md:px-12 lg:px-16 py-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <span>Royal Ember Smart Table-Side Kiosk</span>
        <span>Table-Side Digital Ordering System</span>
      </footer>
    </div>
  );
};

export default LanguageEntryScreen;
