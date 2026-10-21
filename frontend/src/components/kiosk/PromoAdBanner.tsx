import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Category } from '../../types';
import { 
  Sparkles, 
  Flame, 
  Tag, 
  ArrowRight, 
  Clock, 
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PromoAdBannerProps {
  onSelectCategory?: (category: Category) => void;
}

export const PromoAdBanner: React.FC<PromoAdBannerProps> = ({ onSelectCategory }) => {
  const { mealTime } = useKiosk();
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  // Dynamic promo cards based on Image 1 DelishDrop styling
  const promoCards = [
    {
      id: 'fresh-hot',
      eyebrow: 'Irresistibly Tasty Meals',
      title: 'MADE FRESH • SERVED HOT',
      subtitle: 'Slow-dum biryanis & clay tandoori kebabs grilled to perfection',
      discountBadge: 'Up to 40% OFF',
      discountNumber: '40%',
      discountLabel: 'OFF',
      ctaText: 'Order Now',
      categoryTarget: 'Signature' as Category,
      theme: 'yellow',
      bgClass: 'bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-400 text-slate-950',
      pillBg: 'bg-white/80 text-amber-950 border border-amber-600/30',
      badgeBg: 'bg-slate-950 text-amber-300',
      btnClass: 'bg-slate-950 hover:bg-slate-800 text-white',
      stickerBg: 'bg-amber-600 text-white',
      accentIcon: Flame,
      illustrationEmoji: '🔥'
    },
    {
      id: 'loaded-grill',
      eyebrow: 'Special Discount • Chef Combos',
      title: 'LOADED ROYAL SIZZLERS',
      subtitle: 'Creamy Makhani curries + artisanal garlic naans & lassi',
      discountBadge: 'Up to 30% OFF',
      discountNumber: '30%',
      discountLabel: 'OFF',
      ctaText: 'Order Combos',
      categoryTarget: 'Combo' as Category,
      theme: 'orange',
      bgClass: 'bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white',
      pillBg: 'bg-white/20 text-white backdrop-blur-md border border-white/30',
      badgeBg: 'bg-white text-rose-600',
      btnClass: 'bg-white hover:bg-amber-100 text-slate-950',
      stickerBg: 'bg-yellow-300 text-slate-950',
      accentIcon: Tag,
      illustrationEmoji: '🍱'
    },
    {
      id: 'super-delicious',
      eyebrow: mealTime === 'morning' ? 'Sunrise Special' : mealTime === 'lunch' ? 'Grand Afternoon Feast' : 'Evening Signature Special',
      title: mealTime === 'morning' ? 'DELICIOUS GARIFF BREAKFAST' : mealTime === 'lunch' ? 'ROYAL GRAND MEALS THALI' : 'CHEF SIGNATURE PLATTERS',
      subtitle: mealTime === 'morning' 
        ? 'Golden ghee dosas with 3 signature chutneys & filter coffee'
        : mealTime === 'lunch'
        ? '12-item South & North Indian royal lunch spread'
        : 'Cast-iron tandoori feast served piping hot to your table',
      discountBadge: 'Up to 50% OFF',
      discountNumber: '50%',
      discountLabel: 'OFF',
      ctaText: 'View Specials',
      categoryTarget: 'Signature' as Category,
      theme: 'emerald',
      bgClass: 'bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white',
      pillBg: 'bg-emerald-700/60 text-emerald-100 border border-emerald-500/40',
      badgeBg: 'bg-amber-400 text-slate-950',
      btnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
      stickerBg: 'bg-emerald-500 text-white',
      accentIcon: Crown,
      illustrationEmoji: '👑'
    }
  ];

  // Auto cycle on mobile if needed
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoCards.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [promoCards.length]);

  return (
    <section className="mb-6 select-none" aria-label="Special Offers and Promotions">
      
      {/* TABLET / DESKTOP VIEW: Multi-Card Vibrant Showcase (Inspired by Image 1 DelishDrop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {promoCards.map((card, idx) => {
          const Icon = card.accentIcon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectCategory && onSelectCategory(card.categoryTarget)}
              className={`relative rounded-3xl p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[185px] sm:min-h-[195px] border border-black/5 dark:border-white/10 ${card.bgClass} shadow-md group`}
            >
              {/* Background ambient circular watermarks */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/10 blur-xl pointer-events-none" />

              {/* Large translucent decorative emoji / icon in background */}
              <div className="absolute right-2 -bottom-2 text-6xl sm:text-7xl opacity-20 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform select-none">
                {card.illustrationEmoji}
              </div>

              {/* Top Row: Eyebrow Pill + Floating Discount Circle Sticker */}
              <div className="flex items-start justify-between gap-2 z-10">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs ${card.pillBg}`}>
                  <Icon className="w-3 h-3" />
                  <span>{card.eyebrow}</span>
                </span>

                {/* Circular Discount Sticker Badge (Inspired by Image 1: "Up to 40%", "Up to 30%") */}
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-black shadow-lg shrink-0 transform -rotate-6 group-hover:rotate-0 transition-transform ${card.badgeBg}`}>
                  <span className="text-[9px] uppercase leading-none font-extrabold tracking-tight">Up to</span>
                  <span className="text-sm sm:text-base font-black leading-tight tracking-tighter">{card.discountNumber}</span>
                  <span className="text-[8px] uppercase leading-none font-bold">{card.discountLabel}</span>
                </div>
              </div>

              {/* Middle Section: Bold Headline & Subtitle */}
              <div className="my-2 z-10 pr-2">
                <h3 className="font-display font-black text-lg sm:text-xl md:text-lg lg:text-xl tracking-tight leading-tight drop-shadow-xs">
                  {card.title}
                </h3>
                <p className="text-xs font-medium opacity-90 line-clamp-2 mt-1 leading-snug">
                  {card.subtitle}
                </p>
              </div>

              {/* Bottom Action Pill Button */}
              <div className="z-10 pt-2 flex items-center justify-between">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs shadow-md group-hover:scale-105 active:scale-95 transition-all cursor-pointer ${card.btnClass}`}
                >
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-75">
                  Tap to browse
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default PromoAdBanner;
