import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Category } from '../../types';
import { 
  Sparkles, 
  Flame, 
  Tag, 
  ArrowRight, 
  Crown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  CheckCircle2
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
          badge: '🌅 SUNRISE BREAKFAST OFFER • TODAY ONLY',
          badgeColor: 'bg-amber-500 text-slate-950 font-black',
          title: 'Crispy Ghee Dosa & Degree Filter Coffee',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Golden slow-roasted dosa prepared with pure cow ghee, served with 3 stone-ground chutneys & aromatic degree coffee.',
          discountPill: 'Get 40% OFF',
          discountSubtext: 'on morning breakfast orders',
          ctaText: 'Order Breakfast Now',
          categoryTarget: 'Starters' as Category,
          accentColor: 'from-amber-400 to-yellow-500',
          typeBadge: 'Special Offer',
          rating: '4.9 (140+ reviews)'
        },
        {
          id: 'morning-combo',
          badge: '🍱 MORNING CHEF VALUE COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Royal Breakfast Executive Combo Spread',
          highlightText: 'Chef Combo Deal',
          subtitle: 'Crispy Ghee Roast Dosa + 2 Medu Vadas + Kesari + Kumbakonam Degree Filter Coffee @ Special Price ₹199 (Save ₹70).',
          discountPill: 'Save ₹70',
          discountSubtext: 'Special Combo ₹199',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          accentColor: 'from-emerald-500 to-teal-600',
          typeBadge: 'Chef Combo',
          rating: '4.8 (85+ reviews)'
        },
        {
          id: 'morning-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Authentic Degree Filter Coffee & Ghee Roast',
          highlightText: 'Signature Blend',
          subtitle: 'Freshly decoted chicory-blend coffee whipped with unadulterated cow milk in traditional brass dabarah with slow-roasted melt-in-mouth kesari.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Handcrafted Heritage',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          accentColor: 'from-amber-500 to-orange-600',
          typeBadge: 'Signature Dish',
          rating: '5.0 (210+ reviews)'
        }
      ];
    } else if (mealTime === 'lunch') {
      return [
        {
          id: 'lunch-offer',
          badge: '☀️ GRAND AFTERNOON LUNCH FEAST',
          badgeColor: 'bg-orange-500 text-white font-black',
          title: 'Royal Grand Meals Thali — 12-Item Luxury Spread',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Authentic South & North Indian traditional curries, fresh artisanal naans, aromatic basmati rice & unlimited royal desserts.',
          discountPill: 'Get 40% OFF',
          discountSubtext: 'on grand lunch thalis',
          ctaText: 'Order Lunch Feast',
          categoryTarget: 'Main Course' as Category,
          accentColor: 'from-orange-400 to-amber-500',
          typeBadge: 'Lunch Special',
          rating: '4.9 (180+ reviews)'
        },
        {
          id: 'lunch-combo',
          badge: '🍱 POPULAR EXECUTIVE CHEF COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Royal Paneer Makhani & Butter Naan Combo',
          highlightText: 'Value Combo Deal',
          subtitle: 'Rich creamy Makhani curry + 2 Tandoor Garlic Naans + Jeera Pulao + Chilled Mango Lassi @ Special Price ₹499 (Save ₹120).',
          discountPill: 'Save ₹120',
          discountSubtext: 'Special Price ₹499',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          accentColor: 'from-emerald-500 to-teal-600',
          typeBadge: 'Chef Combo',
          rating: '4.8 (115+ reviews)'
        },
        {
          id: 'lunch-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Awadhi Slow-Dum Royal Handi Biryani',
          highlightText: 'Royal Signature',
          subtitle: 'Aromatic aged basmati cooked in sealed clay handi with tender spiced cuts, saffron ghee, fried onions & chilled burani raita.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Piping Hot Service',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          accentColor: 'from-amber-500 to-orange-600',
          typeBadge: 'Signature Dish',
          rating: '5.0 (320+ reviews)'
        }
      ];
    } else {
      // Dinner mealTime
      return [
        {
          id: 'dinner-offer',
          badge: '🌙 EVENING DINNER & LATE NIGHT SIZZLER',
          badgeColor: 'bg-amber-500 text-slate-950 font-black',
          title: 'Cast-Iron Sizzling Tandoor & Grill Platters',
          highlightText: 'Good Food, Good Mood',
          subtitle: 'Charcoal-grilled kebabs, smoked malai tikkas & clay-oven delights served piping hot to your table till 2:00 AM.',
          discountPill: 'Get 50% OFF',
          discountSubtext: 'on evening sizzler platters',
          ctaText: 'Order Dinner Now',
          categoryTarget: 'Main Course' as Category,
          accentColor: 'from-amber-400 to-orange-500',
          typeBadge: 'Dinner Special',
          rating: '4.9 (240+ reviews)'
        },
        {
          id: 'dinner-combo',
          badge: '🍱 CHEF VALUE DINNER COMBO',
          badgeColor: 'bg-emerald-500 text-white font-black',
          title: 'Royal Makhani & Sizzling Brownie Feast Combo',
          highlightText: 'Dinner Combo',
          subtitle: 'Tandoori Sizzler Platter + 2 Butter Naans + Dal Makhani + Sizzling Walnut Fudge Brownie with Vanilla Scoop @ ₹549.',
          discountPill: 'Save ₹130',
          discountSubtext: 'Complete Dinner Combo',
          ctaText: 'Explore Combos',
          categoryTarget: 'Combo' as Category,
          accentColor: 'from-emerald-500 to-teal-600',
          typeBadge: 'Value Combo',
          rating: '4.9 (160+ reviews)'
        },
        {
          id: 'dinner-signature',
          badge: '👑 ROYAL EMBER SIGNATURE',
          badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
          title: 'Signature Butter Chicken & Sizzling Brownie',
          highlightText: 'Royal Signature',
          subtitle: 'Silky satin makhani gravy infused with butter, kasuri methi & tender tandoori cuts, followed by smoking hot sizzling brownie.',
          discountPill: 'Chef Signature',
          discountSubtext: 'Table-Side Experience',
          ctaText: 'View Signatures',
          categoryTarget: 'Signature' as Category,
          accentColor: 'from-amber-500 to-orange-600',
          typeBadge: 'Signature Dish',
          rating: '5.0 (450+ reviews)'
        }
      ];
    }
  }, [mealTime]);

  // Reset to slide 0 when mealTime changes
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
      className="mb-6 select-none relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Container Styled like the Reference Image (Chicken Grill House Theme) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-amber-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* Decorative Golden Ambient Aura / Curve in Background */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-full bg-gradient-to-l from-amber-200/40 via-amber-100/30 to-transparent dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent rounded-l-full pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LEFT COLUMN: Headline, Eyebrow & Actions */}
          <div className="flex-1 space-y-3 sm:space-y-4 max-w-xl text-left">
            
            {/* Top Eyebrow Badge & Rating Pill */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 ${slide.badgeColor}`}>
                <Flame className="w-3.5 h-3.5" />
                <span>{slide.badge}</span>
              </span>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{slide.rating}</span>
              </div>
            </div>

            {/* Main Catchy Headline (Good Food, Good Mood Style from Image) */}
            <div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {slide.highlightText}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight mt-1">
                {slide.title}
              </h2>
            </div>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
              {slide.subtitle}
            </p>

            {/* Trust Badges (like reference image: 500+ / 15 mins / 100% Quality) */}
            <div className="flex items-center gap-4 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Fast Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Fresh</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Royal Quality</span>
              </div>
            </div>

            {/* Action Buttons: Yellow Pill Button (Reference Image Style) */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCta}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory('All')}
                className="px-5 py-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Explore Full Menu
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Circular Plate Presentation with Floating Hot Deal Card (Image Style) */}
          <div className="relative shrink-0 flex items-center justify-center w-64 sm:w-72 md:w-80 aspect-square">
            
            {/* Soft Organic Backdrop Blob */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400/20 via-amber-300/30 to-yellow-400/20 dark:from-amber-500/20 dark:to-transparent animate-pulse-subtle pointer-events-none" />

            {/* Circular Food Plate Image */}
            <div 
              onClick={handleCta}
              className="relative w-52 sm:w-60 md:w-64 h-52 sm:h-60 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 cursor-pointer group-hover:scale-102 transition-transform duration-500"
            >
              <img
                src={restaurantFoodImg}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating "Hot Deal" Card (Exactly like the Reference Image!) */}
            <div className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-0 bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-200/90 dark:border-slate-700 max-w-[170px] sm:max-w-[190px] animate-float-gentle text-left select-none">
              <div className="flex items-center gap-1.5 text-rose-500 text-[10px] sm:text-xs font-black uppercase">
                <Flame className="w-3.5 h-3.5 fill-rose-500" />
                <span>Hot Deal</span>
              </div>
              <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight mt-0.5">
                {slide.discountPill}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {slide.discountSubtext}
              </p>
              <button
                type="button"
                onClick={handleCta}
                className="mt-2 w-full py-1 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide uppercase transition-colors text-center"
              >
                Order Now
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM SLIDE CONTROLLER BAR: Arrows & Pagination Dots */}
        <div className="px-5 sm:px-8 py-3 bg-amber-100/50 dark:bg-slate-950/50 border-t border-amber-200/60 dark:border-slate-800/80 flex items-center justify-between">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-8 bg-amber-500 shadow-sm' 
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-amber-400'
                }`}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-2">
              Offer {currentSlide + 1} of {slides.length}
            </span>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Previous offer"
              aria-label="Previous offer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Next offer"
              aria-label="Next offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PromoAdBanner;
