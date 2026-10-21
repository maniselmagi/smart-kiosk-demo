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
            ? 'bg-[#0f1319] text-white'
            : 'bg-gradient-to-b from-[#e3f7fa] via-[#f7fdfe] to-white text-slate-900'
      }`}
    >
      {/* 1. TOP HEADER BAR (Full Width Spanning Tablet) */}
      <header className="w-full max-w-4xl lg:max-w-5xl mx-auto px-6 sm:px-10 md:px-12 pt-6 sm:pt-8 flex items-center justify-between z-20 shrink-0">
        {/* Back Button (Circular Style from Reference Mockup) */}
        <button
          type="button"
          onClick={onBack}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#1c232f] hover:bg-[#252f3e] text-white border border-slate-800'
              : 'bg-[#daf3f7] hover:bg-[#cdecf2] text-slate-800'
          }`}
          title={t.backBtn || "Back"}
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#1c232f] text-amber-400 hover:text-white border border-slate-800'
              : 'bg-[#daf3f7] text-slate-700 hover:text-slate-950'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
        </button>
      </header>

      {/* 2. MAIN CONTENT AREA (Full Width on Tablet: max-w-4xl / lg:max-w-5xl) */}
      <main className="flex-1 w-full max-w-4xl lg:max-w-5xl mx-auto px-6 sm:px-10 md:px-12 py-4 flex flex-col justify-start">
        
        {/* Title & Subtitle */}
        <div className="mt-2 mb-6 sm:mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            {t.chooseLanguageHeader || 'Choose the language'}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-2xl">
            {t.selectLanguageHelpText || 'Select your preferred language below This helps us serve you better.'}
          </p>
        </div>

        {/* "You Selected" Section (Full Width Across Tablet) */}
        <div className="mb-6 sm:mb-8 w-full">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2.5 sm:mb-3">
            {t.youSelected || 'You Selected'}
          </h2>
          <div 
            className={`w-full h-16 sm:h-18 px-5 sm:px-6 rounded-2xl flex items-center justify-between border-2 border-[#00c5cd] transition-all shadow-md shadow-cyan-500/10 ${
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

        {/* "All Languages" Section (Full Width Box Across Tablet) */}
        <div className="flex-1 flex flex-col min-h-0 mb-6 sm:mb-8 w-full">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2.5 sm:mb-3">
            {t.allLanguages || 'All Languages'}
          </h2>

          <div 
            className={`w-full flex-1 flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden shadow-sm transition-colors ${
              theme === 'dark'
                ? 'bg-[#151b24] border-slate-800'
                : 'bg-white border-slate-200/90'
            }`}
          >
            {/* Search Input Bar (Full Width) */}
            <div 
              className={`flex items-center gap-3.5 px-5 sm:px-6 py-4 border-b ${
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

            {/* Scrollable Language List (Full Width Across Tablet) */}
            <div className="flex-1 overflow-y-auto max-h-[36vh] sm:max-h-[38vh] md:max-h-[42vh] divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLanguages.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
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
                      className={`w-full px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
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

      </main>

      {/* 3. BOTTOM ACTION BUTTON (Full Width Across Tablet: max-w-4xl / lg:max-w-5xl) */}
      <footer className="w-full max-w-4xl lg:max-w-5xl mx-auto px-6 sm:px-10 md:px-12 pb-6 sm:pb-10 pt-2 shrink-0">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-14 sm:h-16 rounded-full bg-[#00c5cd] hover:bg-[#00b4bc] text-white font-black text-base sm:text-lg tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
        >
          {t.continueBtn || 'Continue'}
        </button>
      </footer>
    </div>
  );
};

export default LanguageEntryScreen;
