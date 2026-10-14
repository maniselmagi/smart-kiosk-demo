import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Category } from '../../types';
import { 
  Sparkles, 
  Flame, 
  Tag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  PartyPopper
} from 'lucide-react';

interface PromoAdBannerProps {
  onSelectCategory?: (category: Category) => void;
}

export const PromoAdBanner: React.FC<PromoAdBannerProps> = ({ onSelectCategory }) => {
  const { mealTime } = useKiosk();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Time-aware dynamic ad banners
  const slides = [
    {
      id: 'festival-fest',
      badge: 'FESTIVAL SPECIAL OFFER • TODAY ONLY',
      badgeColor: 'bg-rose-500/90 text-white',
      title: 'Grand Royal Ember Festival Feast',
      subtitle: 'Flat 20% OFF on all Signature Tandoori Platters & Slow-Dum Biryanis!',
      highlight: 'Use Kiosk Code: ROYALFEST',
      ctaText: 'View Signature Dishes',
      categoryTarget: 'Signature' as Category,
      gradient: 'from-amber-600 via-orange-600 to-rose-700',
      icon: PartyPopper
    },
    {
      id: 'combo-special',
      badge: 'POPULAR CHEF COMBO • SAVE UP TO ₹120',
      badgeColor: 'bg-emerald-500/95 text-white',
      title: 'Royal Makhani & Butter Naan Executive Combo',
      subtitle: 'Creamy Makhani Curry + 2 Tandoor Garlic Naans + Chilled Mango Lassi @ ₹499',
      highlight: 'Special Combo Price: ₹499 (Regular ₹619)',
      ctaText: 'Explore Combos',
      categoryTarget: 'Combo' as Category,
      gradient: 'from-emerald-700 via-teal-700 to-cyan-800',
      icon: Tag
    },
    {
      id: 'time-special',
      badge: mealTime === 'morning' ? 'MORNING SUNRISE SPECIAL' : mealTime === 'lunch' ? 'AFTERNOON LUNCH FEAST' : 'EVENING & LATE NIGHT SIZZLER',
      badgeColor: 'bg-cyan-500 text-slate-950 font-black',
      title: mealTime === 'morning' 
        ? 'Crispy Ghee Dosa + Degree Filter Coffee Combo' 
        : mealTime === 'lunch'
        ? 'Royal Grand Meals Thali — 12-Item Feast' 
        : 'Tandoori Sizzler Platter & Sizzling Brownie',
      subtitle: mealTime === 'morning'
        ? 'Fresh golden ghee roast dosa, 3 stone-ground chutneys & aromatic filter coffee'
        : mealTime === 'lunch'
        ? 'Traditional South Indian & North Indian luxury lunch spread with unlimited sweets'
        : 'Cast iron sizzling tandoori delights & hot chocolate walnut fudge brownie',
      highlight: mealTime === 'morning' ? 'Only ₹199' : mealTime === 'lunch' ? 'Only ₹320' : 'Served Hot Till 11:30 PM',
      ctaText: 'Order Special Now',
      categoryTarget: 'Signature' as Category,
      gradient: 'from-cyan-700 via-blue-800 to-indigo-900',
      icon: mealTime === 'morning' ? Clock : Flame
    }
  ];

  // Auto rotation every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  const handleCtaClick = () => {
    if (onSelectCategory) {
      onSelectCategory(slide.categoryTarget);
    }
  };

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden shadow-xl mb-6 group select-none transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Banner */}
      <div className={`relative bg-gradient-to-r ${slide.gradient} p-5 sm:p-7 md:p-8 text-white min-h-[160px] sm:min-h-[175px] flex flex-col justify-between overflow-hidden transition-all duration-500`}>
        
        {/* Decorative background visual elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-black/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-4 bottom-2 text-white/10 text-9xl font-black font-display pointer-events-none select-none">
          %
        </div>

        {/* Top Tag & Badge */}
        <div className="flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${slide.badgeColor}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-white/90 text-xs font-bold border border-white/15">
            <IconComponent className="w-3.5 h-3.5 text-amber-300" />
            <span>{slide.highlight}</span>
          </div>
        </div>

        {/* Middle Content: Title & Subtitle */}
        <div className="my-2.5 z-10 max-w-2xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white drop-shadow-sm leading-tight">
            {slide.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 leading-snug line-clamp-2">
            {slide.subtitle}
          </p>
        </div>

        {/* Bottom Bar: Action CTA and Slide Controls */}
        <div className="flex items-center justify-between gap-4 z-10 pt-2 border-t border-white/15">
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs sm:text-sm shadow-lg hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>{slide.ctaText}</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </button>

          {/* Dots & Nav Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Previous Offer"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Next Offer"
              aria-label="Next Offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromoAdBanner;
