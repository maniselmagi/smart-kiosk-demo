import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AVAILABLE_LANGUAGES, Language } from '../../utils/translations';
import { LanguageFlagBadge } from '../common/LanguageFlagBadge';
import royalEmberLogo from '../../assets/royal_ember_logo.jpg';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Globe2, 
  Crown, 
  Flame, 
  UtensilsCrossed, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface LanguageEntryScreenProps {
  onContinue: () => void;
}

interface LanguageMeta {
  code: Language;
  nativeTitle: string;
  englishName: string;
  greeting: string;
  description: string;
  popularDishTag: string;
}

const LUXURY_LANGUAGE_DATA: Record<Language, LanguageMeta> = {
  en: {
    code: 'en',
    nativeTitle: 'English',
    englishName: 'English (Global)',
    greeting: 'Welcome to Royal Ember',
    description: 'Explore artisan charcoal grills, clay-pot dum biryanis & royal curries',
    popularDishTag: 'Chettinad & Awadhi Specialities'
  },
  ta: {
    code: 'ta',
    nativeTitle: 'தமிழ்',
    englishName: 'Tamil (தமிழ்நாடு)',
    greeting: 'வணக்கம்! நல்வரவு',
    description: 'மரபு மாறாத செட்டிநாடு மசாலா, மண் பானை தம்பிரியாணி மற்றும் சுவையான விருந்து',
    popularDishTag: 'பாரம்பரிய செட்டிநாடு விருந்து'
  },
  hi: {
    code: 'hi',
    nativeTitle: 'हिंदी',
    englishName: 'Hindi (भारत)',
    greeting: 'नमस्ते! आपका हार्दिक स्वागत है',
    description: 'शाही अवधी जायका, रसीले कबाब, दम बिरयानी और आत्मीय भारतीय आतिथ्य',
    popularDishTag: 'नवाबी दस्तरख्वान व कबाब'
  },
  te: {
    code: 'te',
    nativeTitle: 'తెలుగు',
    englishName: 'Telugu (తెలుగు రాష్ట్రాలు)',
    greeting: 'నమస్కారం! స్వాగతం',
    description: 'అసలైన ఘుమఘుమలాడే రాయలసీమ రుచులు, దమ్ బిర్యానీ మరియు రాజభోజనం',
    popularDishTag: 'హైదరాబాదీ దమ్ బిర్యానీ'
  },
  es: {
    code: 'es',
    nativeTitle: 'Español',
    englishName: 'Spanish (Internacional)',
    greeting: '¡Bienvenidos a Royal Ember!',
    description: 'Descubra nuestra alta cocina a la brasa, arroces dum y hospitalidad de cinco estrellas',
    popularDishTag: 'Cocina Real & Sabores Auténticos'
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
  const activeMeta = LUXURY_LANGUAGE_DATA[selectedLang] || LUXURY_LANGUAGE_DATA.en;

  return (
    <div 
      className={`min-h-[calc(100vh-45px)] flex flex-col justify-between items-center px-4 py-6 sm:py-8 md:py-10 relative overflow-hidden transition-colors duration-300 ${
        isAccessibilityMode
          ? 'bg-slate-950 text-white'
          : 'bg-[#080B11] text-slate-100'
      }`}
    >
      {/* 1. LUXURIOUS AMBIENT LIGHTING & GOLDEN MIST */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% -10%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 35%, transparent 70%),
            radial-gradient(circle at 10% 90%, rgba(234, 88, 12, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 90% 85%, rgba(217, 119, 6, 0.15) 0%, transparent 45%)
          `
        }}
      />

      {/* Subtle Luxury Pattern Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. TOP BRANDING CREST & LUXURY TITLE */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center pt-1 md:pt-3 z-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        
        {/* VIP Hospitality Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-3 backdrop-blur-md">
          <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Table-Side Smart Self-Ordering Lounge</span>
        </div>

        {/* Gilded Brand Seal */}
        <div className="relative group cursor-pointer mb-2">
          {/* Glowing Aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-600/40 blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
          
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-black">
            <img 
              src={royalEmberLogo} 
              alt="Royal Ember Emblem" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-transparent to-white/20 pointer-events-none" />
          </div>
        </div>

        {/* Royal Title Typography */}
        <h1 className="font-royal text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_2px_20px_rgba(245,158,11,0.4)]">
          ROYAL EMBER
        </h1>

        {/* Sub-Header with Decorative Golden Lines */}
        <div className="flex items-center justify-center gap-3 mt-1.5 w-full max-w-md">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <span className="font-sans text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-300/90 whitespace-nowrap">
            Restaurant &amp; Grand Banquet
          </span>
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </div>

        <p className="font-luxury italic text-slate-400 text-xs sm:text-sm mt-1">
          "Good Food • Great Moments • Five-Star Table-Side Hospitality"
        </p>
      </div>

      {/* 3. CENTER: LUXURY LANGUAGE SELECTION SHOWCASE */}
      <div className="w-full max-w-3xl my-auto py-4 z-10 animate-in zoom-in-95 duration-500">
        
        {/* Main Glassmorphic Panel */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-amber-500/30 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.12)] space-y-6">
          
          {/* Section Header */}
          <div className="text-center space-y-1.5 border-b border-slate-800/80 pb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Your Dining Language</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white tracking-tight">
              Choose language for digital dining
            </h2>

            <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
              மொழியைத் தேர்ந்தெடுக்கவும் • अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి
            </p>
          </div>

          {/* 5 Language Choice Cards (With Crisp SVG Circular Flags) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              const meta = LUXURY_LANGUAGE_DATA[lang.code] || LUXURY_LANGUAGE_DATA.en;

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`group relative text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-r from-amber-500/25 via-amber-600/15 to-slate-900/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-[1.02] ring-2 ring-amber-400/50'
                      : 'border-slate-800/90 bg-slate-800/40 hover:border-amber-500/60 hover:bg-slate-800/80 hover:shadow-lg'
                  }`}
                >
                  {/* High Definition Circular Vector SVG Flag (Never renders as ugly letters on Windows) */}
                  <div className="relative shrink-0">
                    <LanguageFlagBadge 
                      code={lang.code} 
                      size={44} 
                      className={`transition-transform duration-300 ${isSelected ? 'scale-105 ring-2 ring-amber-400' : 'group-hover:scale-105'}`}
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>

                  {/* Language Native Name & Cultural Tagline */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-black text-lg sm:text-xl text-white tracking-tight font-display">
                        {meta.nativeTitle}
                      </span>

                      {/* Selected Radio / Check Icon */}
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/40 shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0 group-hover:border-amber-400/70 transition-colors" />
                      )}
                    </div>

                    {/* Greeting & Region Subtitle */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-amber-400">
                        {meta.greeting}
                      </span>
                      <span className="text-[10px] text-slate-400">• {meta.englishName}</span>
                    </div>

                    {/* Rich Culinary Preview */}
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-1 leading-snug">
                      {meta.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row & Live Notification */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">Instant Bilingual Translation</span>
                <span className="text-[11px] text-slate-400">All dishes, spice controls &amp; receipts translate into {activeMeta.nativeTitle}.</span>
              </div>
            </div>

            {/* Glowing CTA Button */}
            <button
              onClick={handleProceed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-[0_10px_35px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
            >
              <span>Continue ({activeLangObj.nativeLabel})</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

      </div>

      {/* 4. LUXURY AMENITIES TICKER BAR AT BOTTOM */}
      <div className="w-full max-w-4xl mx-auto z-10 pt-2">
        <div className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 flex flex-wrap items-center justify-around gap-2 text-[11px] font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Artisanal Clay-Pot Biryanis</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Live Wood-Fired Tandoor</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Table-Side Kiosk</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>5-Star Hospitality Experience</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LanguageEntryScreen;
