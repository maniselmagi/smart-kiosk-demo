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
  const { mealTime, language, t } = useKiosk();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Time-aware dynamic slides (Offers, Combos, and Signatures synchronized to mealTime and language)
  const slides = React.useMemo(() => {
    if (language === 'ta') {
      if (mealTime === 'morning') {
        return [
          {
            id: 'morning-offer',
            badge: '🌅 காலை சிறப்பு • இன்று மட்டும்',
            badgeColor: 'bg-amber-400 text-slate-950 font-black',
            title: 'மொறுமொறு நெய் தோசை & டிகிரி பில்டர் காபி',
            highlightText: 'சுவையான உணவு, நல்வாழ்வு',
            subtitle: 'சுத்தமான பசு நெய்யில் சுட்டெடுத்த மொறுமொறு தோசை & 3 வகை பாரம்பரிய சட்னி.',
            discountPill: '40% தள்ளுபடி',
            discountSubtext: 'காலை சிறப்பு',
            ctaText: 'ஆர்டர் செய்க',
            categoryTarget: 'Starters' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'morning-combo',
            badge: '🍱 காலை செஃப் காம்போ',
            badgeColor: 'bg-emerald-500 text-white font-black',
            title: 'ராயல் காலை உணவு எக்ஸிகியூட்டிவ் காம்போ',
            highlightText: 'செஃப் காம்போ ஆஃபர்',
            subtitle: 'நெய் ரோஸ்ட் தோசை + 2 மெது வடை + கேசரி + பில்டர் காபி @ ₹199 (ரூ. 70 சேமிப்பு).',
            discountPill: 'ரூ. 70 சேமிப்பு',
            discountSubtext: 'சிறப்பு ₹199',
            ctaText: 'காம்போக்களைப் பார்க்க',
            categoryTarget: 'Combo' as Category,
            rating: '4.8 ⭐'
          },
          {
            id: 'morning-signature',
            badge: '👑 ராயல் எம்பர் சிக்னேச்சர்',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
            title: 'கும்பகோணம் டிகிரி பில்டர் காபி & நெய் ரோஸ்ட்',
            highlightText: 'பாரம்பரிய சிக்னேச்சர்',
            subtitle: 'பித்தளை தபாராவில் ஆவி பறக்க சுடச்சுட வழங்கப்படும் பாரம்பரிய டிகிரி காபி.',
            discountPill: 'செஃப் சிக்னேச்சர்',
            discountSubtext: 'ராஜ பாரம்பரியம்',
            ctaText: 'சிக்னேச்சர் காண்க',
            categoryTarget: 'Signature' as Category,
            rating: '5.0 ⭐'
          }
        ];
      } else if (mealTime === 'lunch') {
        return [
          {
            id: 'lunch-offer',
            badge: '☀️ மதிய உணவு ராஜ விருந்து',
            badgeColor: 'bg-orange-500 text-white font-black',
            title: 'ராயல் கிராண்ட் மீல்ஸ் தாலி — 12 வகை ராஜ விருந்து',
            highlightText: 'சுவையான உணவு, நல்வாழ்வு',
            subtitle: 'பாரம்பரிய தென்னிந்திய மற்றும் வட இந்திய கூட்டு, குழம்பு, பாயாசம் & சுவையான சாதம்.',
            discountPill: '40% தள்ளுபடி',
            discountSubtext: 'மதிய சாப்பாடு தாலி',
            ctaText: 'சாப்பாடு ஆர்டர் செய்க',
            categoryTarget: 'Main Course' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'lunch-combo',
            badge: '🍱 எக்ஸிகியூட்டிவ் செஃப் காம்போ',
            badgeColor: 'bg-emerald-500 text-white font-black',
            title: 'பன்னீர் மக்கனி & கார்லிக் நான் எக்ஸிகியூட்டிவ் காம்போ',
            highlightText: 'சிறப்பு காம்போ ஆஃபர்',
            subtitle: 'கிரீமி மக்கனி + 2 கார்லிக் நான் + சீரக புலாவ் + மாம்பழ லஸ்ஸி @ ₹499 (ரூ. 120 சேமிப்பு).',
            discountPill: 'ரூ. 120 சேமிப்பு',
            discountSubtext: 'சிறப்பு ₹499',
            ctaText: 'காம்போக்களைப் பார்க்க',
            categoryTarget: 'Combo' as Category,
            rating: '4.8 ⭐'
          },
          {
            id: 'lunch-signature',
            badge: '👑 ராயல் எம்பர் சிக்னேச்சர்',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
            title: 'அவாதி ஸ்லோ-தம் ராயல் ஹண்டி பிரியாணி',
            highlightText: 'ராயல் சிக்னேச்சர்',
            subtitle: 'பாரம்பரிய மண்பானையில் குங்குமப்பூ நெய்யில் சுடச்சுட தயாராகும் தம் பிரியாணி & புரானி ரைத்தா.',
            discountPill: 'செஃப் சிக்னேச்சர்',
            discountSubtext: 'சுடச்சுட பரிமாறப்படும்',
            ctaText: 'சிக்னேச்சர் காண்க',
            categoryTarget: 'Signature' as Category,
            rating: '5.0 ⭐'
          }
        ];
      } else {
        return [
          {
            id: 'dinner-offer',
            badge: '🌙 இரவு உணவு & லேட் நைட் சிஸ்லர்',
            badgeColor: 'bg-amber-400 text-slate-950 font-black',
            title: 'தந்தூரி & கிரில் பிளாட்டர்ஸ்',
            highlightText: 'சுவையான உணவு, நல்வாழ்வு',
            subtitle: 'கரி அடுப்பில் சுடச்சுட வெந்த கபாப், மலாய் டிக்கா இரவு 2:00 மணி வரை கிடைக்கும்.',
            discountPill: '50% தள்ளுபடி',
            discountSubtext: 'இரவு சிஸ்லர்',
            ctaText: 'இரவு உணவு ஆர்டர் செய்க',
            categoryTarget: 'Main Course' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'dinner-combo',
            badge: '🍱 இரவு பார்ட்டி காம்போ',
            badgeColor: 'bg-emerald-500 text-white font-black',
            title: 'ராயல் தந்தூரி டிக்கா & பிரியாணி ஃபீஸ்ட்',
            highlightText: 'பார்ட்டி காம்போ ஆஃபர்',
            subtitle: 'சிக்கன் டிக்கா + சிக்கன் தம் பிரியாணி + 2 பட்டர் நான் + குலாப் ஜாமுன் @ ₹699.',
            discountPill: 'ரூ. 150 சேமிப்பு',
            discountSubtext: 'இரவு ஸ்பெஷல்',
            ctaText: 'காம்போக்களைப் பார்க்க',
            categoryTarget: 'Combo' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'dinner-signature',
            badge: '👑 ராயல் எம்பர் சிக்னேச்சர்',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
            title: 'பட்டர் சிக்கன் & சுடச்சுட கார்லிக் நான்',
            highlightText: 'செஃப் சிக்னேச்சர்',
            subtitle: 'வெண்ணெய், கஸ்தூரி மேத்தி மணக்கும் க்ரீமி பட்டர் சிக்கனுடன் மொறுமொறு கார்லிக் நான்.',
            discountPill: 'செஃப் சிக்னேச்சர்',
            discountSubtext: 'பாரம்பரிய ருசி',
            ctaText: 'சிக்னேச்சர் காண்க',
            categoryTarget: 'Signature' as Category,
            rating: '5.0 ⭐'
          }
        ];
      }
    }

    if (language === 'hi') {
      if (mealTime === 'morning') {
        return [
          {
            id: 'morning-offer',
            badge: '🌅 सुबह का खास ऑफर • केवल आज',
            badgeColor: 'bg-amber-400 text-slate-950 font-black',
            title: 'क्रिस्पी घी डोसा और डिग्री फिल्टर कॉफी',
            highlightText: 'स्वादिष्ट भोजन, उत्तम दिन',
            subtitle: 'शुद्ध देसी घी में भुना हुआ कुरकुरा डोसा और 3 ताज़ी स्वादिष्ट चटनी।',
            discountPill: '40% की छूट',
            discountSubtext: 'नाश्ता स्पेशल',
            ctaText: 'नाश्ता ऑर्डर करें',
            categoryTarget: 'Starters' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'morning-combo',
            badge: '🍱 मॉर्निंग शेफ कॉम्बो',
            badgeColor: 'bg-emerald-500 text-white font-black',
            title: 'रॉयल ब्रेकफास्ट एग्जीक्यूटिव कॉम्बो स्प्रेड',
            highlightText: 'शेफ कॉम्बो डील',
            subtitle: 'घी रोस्ट डोसा + 2 मेदु वड़ा + केसरी + फिल्टर कॉफी @ ₹199 (₹70 की बचत)।',
            discountPill: '₹70 की बचत',
            discountSubtext: 'स्पेशल ₹199',
            ctaText: 'कॉम्बो देखें',
            categoryTarget: 'Combo' as Category,
            rating: '4.8 ⭐'
          },
          {
            id: 'morning-signature',
            badge: '👑 रॉयल एम्बर सिग्नेचर',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
            title: 'कुंभकोणम डिग्री फिल्टर कॉफी और घी रोस्ट',
            highlightText: 'शाही विरासत',
            subtitle: 'पीतल के डबरे में गरमा-गरम परोसी गई प्रामाणिक फ़िल्टर कॉफ़ी।',
            discountPill: 'शेफ सिग्नेचर',
            discountSubtext: 'शाही स्वाद',
            ctaText: 'सिग्नेचर देखें',
            categoryTarget: 'Signature' as Category,
            rating: '5.0 ⭐'
          }
        ];
      } else if (mealTime === 'lunch') {
        return [
          {
            id: 'lunch-offer',
            badge: '☀️ शाही दोपहर का भोजन',
            badgeColor: 'bg-orange-500 text-white font-black',
            title: 'रॉयल ग्रैंड मील्स थाली — 12 व्यंजनों का शाही प्रसार',
            highlightText: 'शाही भोजन',
            subtitle: 'पारंपरिक दक्षिण और उत्तर भारतीय करी, कारीगरी नान, बासमती चावल और मिठाइयाँ।',
            discountPill: '40% की छूट',
            discountSubtext: 'ग्रैंड लंच थाली',
            ctaText: 'थाली ऑर्डर करें',
            categoryTarget: 'Main Course' as Category,
            rating: '4.9 ⭐'
          },
          {
            id: 'lunch-combo',
            badge: '🍱 एग्जीक्यूटिव शेफ कॉम्बो',
            badgeColor: 'bg-emerald-500 text-white font-black',
            title: 'पनीर मखनी और गार्लिक नान एग्जीक्यूटिव कॉम्बो',
            highlightText: 'वैल्यू कॉम्बो डील',
            subtitle: 'क्रीमी मखनी + 2 गार्लिक नान + जीरा पुलाव + मैंगो लस्सी @ ₹499 (₹120 की बचत)।',
            discountPill: '₹120 की बचत',
            discountSubtext: 'स्पेशल ₹499',
            ctaText: 'कॉम्बो देखें',
            categoryTarget: 'Combo' as Category,
            rating: '4.8 ⭐'
          },
          {
            id: 'lunch-signature',
            badge: '👑 रॉयल एम्बर सिग्नेचर',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black',
            title: 'अवधी स्लो-दम रॉयल हांडी बिरयानी',
            highlightText: 'रॉयल सिग्नेचर',
            subtitle: 'केसर घी और बुरानी रायता के साथ सील बंद मिट्टी की हांडी में पकी बासमती बिरयानी।',
            discountPill: 'शेफ सिग्नेचर',
            discountSubtext: 'गरमा-गरम',
            ctaText: 'सिग्नेचर देखें',
            categoryTarget: 'Signature' as Category,
            rating: '5.0 ⭐'
          }
        ];
      }
    }

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
  }, [mealTime, language]);

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
                {t.exploreMenu || 'Explore Menu'}
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
                <span>{t.saveDiscountLabel || 'Hot Deal'}</span>
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
