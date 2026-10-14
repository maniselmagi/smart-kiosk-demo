import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { HotelBrand } from '../common/HotelBrand';
import { Check, ArrowRight, Sparkles, Globe2 } from 'lucide-react';

interface LanguageEntryScreenProps {
  onContinue: () => void;
}

interface LanguageMeta {
  code: Language;
  greeting: string;
  sub: string;
  description: string;
}

const LANGUAGE_DETAILS: Record<Language, LanguageMeta> = {
  en: {
    code: 'en',
    greeting: 'Welcome!',
    sub: 'English',
    description: 'Explore gourmet menus & order directly'
  },
  ta: {
    code: 'ta',
    greeting: 'வணக்கம்!',
    sub: 'Tamil',
    description: 'சுவையான உணவுகளை தமிழில் ஆர்டர் செய்யவும்'
  },
  hi: {
    code: 'hi',
    greeting: 'नमस्ते!',
    sub: 'Hindi',
    description: 'स्वादिष्ट व्यंजन अपनी भाषा में देखें और ऑर्डर करें'
  },
  te: {
    code: 'te',
    greeting: 'నమస్కారం!',
    sub: 'Telugu',
    description: 'రుచికరమైన వంటకాలను తెలుగులో ఆర్డర్ చేయండి'
  },
  es: {
    code: 'es',
    greeting: '¡Hola y Bienvenidos!',
    sub: 'Spanish',
    description: 'Disfrute de nuestro menú gourmet en español'
  }
};

export const LanguageEntryScreen: React.FC<LanguageEntryScreenProps> = ({ onContinue }) => {
  const { language, setLanguage, isAccessibilityMode } = useKiosk();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const handleSelect = (code: Language) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleProceed = () => {
    setLanguage(selectedLang);
    onContinue();
  };

  const activeLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === selectedLang) || AVAILABLE_LANGUAGES[0];

  return (
    <div 
      className={`min-h-[calc(100vh-45px)] flex flex-col justify-between items-center px-4 py-8 md:py-12 relative overflow-hidden transition-colors duration-300 ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : 'bg-gradient-to-b from-amber-50/40 via-white to-amber-100/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* Subtle Golden Ambient Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Hotel Brand Section */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center pt-2 md:pt-4 z-10 animate-fade-in">
        <HotelBrand size="hero" align="center" showTagline={true} showDescriptor={true} />
      </div>

      {/* Center: Language Selection Box */}
      <div className="w-full max-w-2xl my-auto py-6 z-10 animate-scale-up">
        {/* Title Prompt */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Select Dining Language</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Choose your language for dining
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
            மொழியைத் தேர்ந்தெடுக்கவும் • अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి
          </p>
        </div>

        {/* 5 Language Touch Cards */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-amber-500/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              const meta = LANGUAGE_DETAILS[lang.code];

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/40 shadow-lg shadow-brand-500/15 scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-amber-400 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {/* National / Regional Flag */}
                  <span className="text-3xl shrink-0 select-none drop-shadow-xs">
                    {lang.flag}
                  </span>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                        {lang.nativeLabel}
                      </span>
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0 group-hover:border-amber-400" />
                      )}
                    </div>
                    
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                      {meta.greeting} • {meta.sub}
                    </span>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {meta.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>UI updates instantly across all dishes &amp; ordering steps.</span>
            </div>

            <button
              onClick={handleProceed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 text-white font-black text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>Continue ({activeLangObj.nativeLabel})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Version Details */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 z-10 pt-4">
        <span>Royal Ember Table-Side Kiosk System • v1.0 Presentation Build</span>
      </div>
    </div>
  );
};

export default LanguageEntryScreen;
