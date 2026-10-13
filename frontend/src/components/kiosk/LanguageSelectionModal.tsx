import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { Globe, Check, ArrowRight, Sparkles, X } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
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
    sub: 'தமிழ் (Tamil)',
    description: 'சுவையான உணவுகளை தமிழில் பார்த்து ஆர்டர் செய்யவும்'
  },
  hi: {
    code: 'hi',
    greeting: 'नमस्ते!',
    sub: 'हिंदी (Hindi)',
    description: 'स्वादिष्ट व्यंजन अपनी भाषा में देखें और ऑर्डर करें'
  },
  te: {
    code: 'te',
    greeting: 'నమస్కారం!',
    sub: 'తెలుగు (Telugu)',
    description: 'రుచికరమైన వంటకాలను తెలుగులో సులభంగా ఆర్డర్ చేయండి'
  },
  es: {
    code: 'es',
    greeting: '¡Hola y Bienvenidos!',
    sub: 'Español (Spanish)',
    description: 'Disfrute de nuestro menú gourmet en español'
  }
};

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { language, setLanguage, t, isAccessibilityMode } = useKiosk();

  if (!isOpen) return null;

  const handleSelectLanguage = (langCode: Language) => {
    setLanguage(langCode);
  };

  const handleContinue = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className={`relative w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border transition-all duration-300 ${
          isAccessibilityMode
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-brand-500/10'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close / மூடு"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white shadow-lg shadow-brand-500/25 mb-3 animate-pulse">
            <Globe className="w-7 h-7" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            {t.selectLanguageTitle}
          </h2>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {t.chooseLanguagePrompt}
          </p>
        </div>

        {/* Language Grid: 5 Touch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            const meta = LANGUAGE_DETAILS[lang.code];

            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                {/* Flag Icon */}
                <div className="text-3xl shrink-0 select-none">
                  {lang.flag}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                      {lang.nativeLabel}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white shadow-sm shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block mt-0.5">
                    {meta.greeting} • {lang.label}
                  </span>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                    {meta.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Language Preview & Proceed Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              UI updates instantly across all dishes & ordering steps.
            </span>
          </div>

          <button
            onClick={handleContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 text-white font-black text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 active:scale-95 transition-all cursor-pointer"
          >
            <span>{t.continueInLanguage} ({AVAILABLE_LANGUAGES.find(l => l.code === language)?.nativeLabel})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
