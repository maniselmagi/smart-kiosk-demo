import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Category } from '../../types';
import { 
  Flame, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import restaurantFoodImg from '../../assets/restaurant_food_welcome.jpg';

interface PromoAdBannerProps {
  onSelectCategory?: (category: Category) => void;
}

export const PromoAdBanner: React.FC<PromoAdBannerProps> = ({ onSelectCategory }) => {
  const { mealTime } = useKiosk();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Time-aware dynamic slides (Offers, Combos, and Signatures synchronized to mealTime)
  const slides = React.useMemo(() => {
    if (mealTime === 'morning') {
      return [
        {
          id: 'morning-offer',
          badge: '🌅 SUNRISE SPECIAL • TODAY ONLY',
          badgeColor: 'bg-amber-400 text-slate-950 font-black',
          title: 'Crispy Ghee Dosa & Degree Filter Coffee',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Golden slow-roasted dosa prepared with pure cow ghee & 3 stone-ground chutneys.',
          discountPill: 'Get 40% OFF',
          discountSubtext: 'Breakfast Special',
          ctaText: 'Order Breakfast',
          categoryTarget: 'Starters' as Category,
          rating: '4.9 ⭐'
        },
        {
          id: 'morning-combo',
          badge: '🍱 MORNING CHEF COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Royal Breakfast Executive Combo Spread',
          highlightText: 'Chef Combo Deal',
          subtitle: 'Ghee Roast Dosa + 2 Medu Vadas + Kesari + Filter Coffee @ ₹199 (Save ₹70).',
          discountPill: 'Save ₹70',
          discountSubtext: 'Special ₹199',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          rating: '4.8 ⭐'
        },
        {
          id: 'morning-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Kumbakonam Degree Filter Coffee & Ghee Roast',
          highlightText: 'Signature Heritage',
          subtitle: 'Decoted chicory blend whipped with unadulterated milk in brass dabarah.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Royal Heritage',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          rating: '5.0 ⭐'
        }
      ];
    } else if (mealTime === 'lunch') {
      return [
        {
          id: 'lunch-offer',
          badge: '☀️ GRAND LUNCH FEAST',
          badgeColor: 'bg-orange-500 text-white font-black',
          title: 'Royal Grand Meals Thali — 12-Item Luxury Spread',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Traditional South & North Indian curries, artisanal naans, basmati rice & sweets.',
          discountPill: 'Get 40% OFF',
          discountSubtext: 'Grand Lunch Thali',
          ctaText: 'Order Lunch Feast',
          categoryTarget: 'Main Course' as Category,
          rating: '4.9 ⭐'
        },
        {
          id: 'lunch-combo',
          badge: '🍱 EXECUTIVE CHEF COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Paneer Makhani & Garlic Naan Executive Combo',
          highlightText: 'Value Combo Deal',
          subtitle: 'Creamy Makhani + 2 Garlic Naans + Jeera Pulao + Mango Lassi @ ₹499 (Save ₹120).',
          discountPill: 'Save ₹120',
          discountSubtext: 'Special ₹499',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          rating: '4.8 ⭐'
        },
        {
          id: 'lunch-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Awadhi Slow-Dum Royal Handi Biryani',
          highlightText: 'Royal Signature',
          subtitle: 'Aged basmati slow-dum cooked in sealed clay handi with saffron ghee & burani raita.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Piping Hot',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          rating: '5.0 ⭐'
        }
      ];
    } else {
      // Dinner mealTime
      return [
        {
          id: 'dinner-offer',
          badge: '🌙 EVENING DINNER & LATE SIZZLER',
          badgeColor: 'bg-amber-400 text-slate-950 font-black',
          title: 'Cast-Iron Sizzling Tandoor & Grill Platters',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Charcoal-grilled kebabs, malai tikkas & smoky delights served hot till 2:00 AM.',
          discountPill: 'Get 50% OFF',
          discountSubtext: 'Evening Sizzler',
          ctaText: 'Order Dinner Now',
          categoryTarget: 'Main Course' as Category,
          rating: '4.9 ⭐'
        },
        {
          id: 'dinner-combo',
          badge: '🍱 CHEF VALUE DINNER COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Royal Makhani & Sizzling Brownie Feast Combo',
          highlightText: 'Dinner Combo',
          subtitle: 'Tandoori Sizzler + 2 Butter Naans + Dal Makhani + Sizzling Walnut Fudge Brownie @ ₹549.',
          discountPill: 'Save ₹130',
          discountSubtext: 'Complete Combo',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          rating: '4.9 ⭐'
        },
        {
          id: 'dinner-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Signature Butter Chicken & Sizzling Brownie',
          highlightText: 'Royal Signature',
          subtitle: 'Silky satin makhani gravy infused with butter & kasuri methi + smoking hot brownie.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Signature Feast',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          rating: '5.0 ⭐'
        }
      ];
    }
  }, [mealTime]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [mealTime]);

  // Automatic slide rotation every 4.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const slide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleCta = () => {
    if (onSelectCategory) {
      onSelectCategory(slide.categoryTarget);
    }
  };

  return (
    <section 
      aria-label="Promotional Slide Bar"
      className="mb-3 select-none relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Streamlined Compact Slide Container with Luxury Obsidian Gradient */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-amber-500/40 transition-all duration-300">
        
        {/* Soft Golden Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-transparent rounded-l-full pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-4">
          
          {/* LEFT: Compact Headline & Quick CTA */}
          <div className="flex-1 space-y-2 text-left min-w-0">
            
            {/* Eyebrow & Rating */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 ${slide.badgeColor}`}>
                <Flame className="w-3 h-3" />
                <span>{slide.badge}</span>
              </span>

              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{slide.rating}</span>
              </span>
            </div>

            {/* Title (Streamlined height) */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-amber-400/90 block leading-tight">
                {slide.highlightText}
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight leading-snug line-clamp-1 mt-0.5">
                {slide.title}
              </h2>
            </div>

            {/* 1-2 Line Subtitle */}
            <p className="text-xs text-slate-300 font-normal line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Action Button: Compact Sunny Yellow Pill */}
            <div className="pt-1 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCta}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory('All')}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 font-bold text-xs border border-white/10 shadow-xs active:scale-95 transition-all cursor-pointer hidden sm:inline-block"
              >
                Explore Menu
              </button>
            </div>

          </div>

          {/* RIGHT: Compact Circular Food Plate & Floating Hot Deal Pill */}
          <div className="relative shrink-0 flex items-center justify-center w-28 sm:w-36 md:w-44 aspect-square">
            
            {/* Compact Plate Photo with Gold Halo */}
            <div 
              onClick={handleCta}
              className="relative w-24 sm:w-32 md:w-38 h-24 sm:h-32 md:h-38 rounded-full overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.25)] border-2 border-amber-400/50 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img
                src={restaurantFoodImg}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.98]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Compact Floating "Hot Deal" Sticker */}
            <div className="absolute -bottom-1 -right-1 bg-slate-900/95 rounded-xl p-1.5 sm:p-2 shadow-xl border border-amber-500/40 max-w-[110px] sm:max-w-[130px] text-left select-none">
              <div className="flex items-center gap-1 text-amber-400 text-[9px] font-black uppercase">
                <Flame className="w-2.5 h-2.5 fill-amber-400" />
                <span>Hot Deal</span>
              </div>
              <h4 className="font-display font-black text-[11px] sm:text-xs text-white leading-tight">
                {slide.discountPill}
              </h4>
            </div>

          </div>

        </div>

        {/* BOTTOM SLIDE CONTROLLER BAR: Slim 28px Strip */}
        <div className="px-4 sm:px-6 py-1.5 bg-slate-950/70 border-t border-white/[0.06] flex items-center justify-between text-xs">
          
          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-6 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-xs' 
                    : 'w-2 bg-slate-700 hover:bg-amber-400'
                }`}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] font-bold text-slate-400 ml-1.5">
              Offer {currentSlide + 1} of {slides.length}
            </span>
          </div>

          {/* Previous / Next Arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-amber-400 hover:text-slate-950 border border-white/10 text-slate-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Previous offer"
              aria-label="Previous offer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-amber-400 hover:text-slate-950 border border-white/10 text-slate-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Next offer"
              aria-label="Next offer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PromoAdBanner;
