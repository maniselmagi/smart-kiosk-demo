import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { LanguageFlagBadge } from '../common/LanguageFlagBadge';
import { 
  ChevronLeft, 
  Search, 
  Check, 
  Sun, 
  Moon 
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
    theme, 
    toggleTheme, 
    isAccessibilityMode 
  } = useKiosk();

  const [selectedLang, setSelectedLang] = useState<Language>(language || 'en');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages by search query (supports English label and native script)
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
      className={`min-h-[100dvh] w-full flex flex-col justify-between relative transition-colors duration-300 select-none ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : theme === 'dark'
            ? 'bg-[#0f1319] text-white'
            : 'bg-gradient-to-b from-[#e3f7fa] via-white to-white text-slate-900'
      }`}
    >
      {/* Top Floating Controls: Back Button & Discreet Theme Switcher */}
      <div className="w-full max-w-lg md:max-w-xl mx-auto px-5 sm:px-6 pt-5 sm:pt-7 flex items-center justify-between z-20">
        {/* Back Button (Exact Circular Style from Reference Image) */}
        <button
          type="button"
          onClick={onBack}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#1d2430] hover:bg-[#252e3d] text-white border border-slate-800'
              : 'bg-[#daf3f7] hover:bg-[#cdecf2] text-slate-800'
          }`}
          title="Back to Welcome Screen"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#1d2430] text-amber-400 hover:text-white border border-slate-800'
              : 'bg-[#daf3f7] text-slate-700 hover:text-slate-950'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Main Content Area (Centered for Tablet & Mobile) */}
      <div className="flex-1 w-full max-w-lg md:max-w-xl mx-auto px-5 sm:px-6 py-4 flex flex-col justify-start">
        
        {/* 1. Page Header (Exact Typography from Reference Image) */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
            Choose the language
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            Select your preferred language below This helps us serve you better.
          </p>
        </div>

        {/* 2. "You Selected" Section (Cyan Outlined Pill Card) */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2.5">
            You Selected
          </h2>
          <div 
            className={`w-full h-15 px-4 rounded-2xl flex items-center justify-between border-2 border-[#00c5cd] transition-all shadow-sm ${
              theme === 'dark'
                ? 'bg-[#171e28]'
                : 'bg-white'
            }`}
          >
            {/* Left: Circular Flag & Language Name */}
            <div className="flex items-center gap-3">
              <LanguageFlagBadge code={currentSelectedObj.code} size={34} />
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-base text-slate-900 dark:text-white">
                  {currentSelectedObj.label}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentSelectedObj.nativeLabel}
                </span>
              </div>
            </div>

            {/* Right: Filled Teal Checkmark Badge */}
            <div className="w-6 h-6 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-sm shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* 3. "All Languages" Section (Rounded Card Container with Search) */}
        <div className="flex-1 flex flex-col min-h-0 mb-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2.5">
            All Languages
          </h2>

          <div 
            className={`flex-1 flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden shadow-sm transition-colors ${
              theme === 'dark'
                ? 'bg-[#151b24] border-slate-800'
                : 'bg-white border-slate-200/90'
            }`}
          >
            {/* Search Input Bar */}
            <div 
              className={`flex items-center gap-3 px-4 py-3.5 border-b ${
                theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
              }`}
            >
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Scrollable Language List */}
            <div className="flex-1 overflow-y-auto max-h-[42vh] sm:max-h-[46vh] divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLanguages.length === 0 ? (
                <div className="py-8 text-center text-xs sm:text-sm text-slate-400">
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
                      className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                        isSelected 
                          ? theme === 'dark'
                            ? 'bg-cyan-950/25'
                            : 'bg-cyan-50/70'
                          : theme === 'dark'
                            ? 'hover:bg-slate-800/40 active:bg-slate-800/60'
                            : 'hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      {/* Left: Flag + Language Name */}
                      <div className="flex items-center gap-3.5">
                        <LanguageFlagBadge code={lang.code} size={32} />
                        <div>
                          <span className={`text-sm sm:text-base font-semibold block leading-tight ${
                            isSelected 
                              ? 'text-slate-900 dark:text-white font-bold' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {lang.label}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">
                            {lang.nativeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Right: Radio Selection Indicator */}
                      <div className="shrink-0 pl-3">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#00c5cd] text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-slate-400 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 4. Bottom Sticky / Anchored Continue Button */}
      <div className="w-full max-w-lg md:max-w-xl mx-auto px-5 sm:px-6 pb-6 sm:pb-8 pt-2">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-13 sm:h-14 rounded-full bg-[#00c5cd] hover:bg-[#00b4bc] text-white font-bold text-base sm:text-lg tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LanguageEntryScreen;
