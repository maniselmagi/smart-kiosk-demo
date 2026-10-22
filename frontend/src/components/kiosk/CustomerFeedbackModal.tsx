import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { 
  Star, 
  X, 
  Check, 
  Utensils, 
  Receipt,
  Sparkles,
  Crown,
  Award,
  ArrowRight,
  Flame,
  Building2,
  MessageSquare
} from 'lucide-react';

interface CustomerFeedbackModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt?: () => void;
  onReturnToMenu?: () => void;
}

export const CustomerFeedbackModal: React.FC<CustomerFeedbackModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenReceipt,
  onReturnToMenu,
}) => {
  const { tableNumber, submitFeedback, updateOrderStatus, showToast } = useKiosk();

  const targetTable = order?.tableNumber || tableNumber || 12;
  const waiter = getAssignedWaiter(targetTable);

  // 3 Essential Ratings
  const [mealRating, setMealRating] = useState<number>(5);
  const [hoverMealRating, setHoverMealRating] = useState<number>(0);

  const [waiterRating, setWaiterRating] = useState<number>(5);
  const [hoverWaiterRating, setHoverWaiterRating] = useState<number>(0);

  const [ambianceRating, setAmbianceRating] = useState<number>(5);
  const [hoverAmbianceRating, setHoverAmbianceRating] = useState<number>(0);

  // Curated praise tags with micro-icons
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Delicious Food',
    'Friendly Waiter'
  ]);

  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPraiseTags = [
    { label: 'Delicious Food', icon: '🍲' },
    { label: 'Hot & Fresh', icon: '🔥' },
    { label: 'Friendly Waiter', icon: '🤵' },
    { label: 'Speedy Service', icon: '⚡' },
    { label: 'Lovely Presentation', icon: '✨' },
    { label: 'Royal Ambiance', icon: '🏰' }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingFeedback = (rating: number, type: 'meal' | 'waiter' | 'ambiance') => {
    if (type === 'meal') {
      if (rating === 5) return 'Exceptional Flavor & Freshness';
      if (rating === 4) return 'Delicious & Satisfying';
      if (rating === 3) return 'Good, Met Expectations';
      if (rating === 2) return 'Fair Flavor';
      return 'Needs Improvement';
    }
    if (type === 'waiter') {
      if (rating === 5) return `Outstanding Hospitality by ${waiter.name}`;
      if (rating === 4) return 'Prompt & Courteous Service';
      if (rating === 3) return 'Attentive Service';
      if (rating === 2) return 'Delayed Service';
      return 'Inattentive Service';
    }
    if (rating === 5) return 'Royal & Immaculate Ambiance';
    if (rating === 4) return 'Pleasant & Clean Atmosphere';
    if (rating === 3) return 'Comfortable Environment';
    if (rating === 2) return 'Average Atmosphere';
    return 'Subpar Experience';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const overallRating = Math.round((mealRating + waiterRating + ambianceRating) / 3);
    const feedbackComment = comment.trim()
      ? `${comment.trim()} [Waiter: ${waiter.fullName} • Table ${targetTable}]`
      : `Splendid dining at Table ${targetTable}. Hospitality by Waiter ${waiter.fullName} and delicious meal.`;

    submitFeedback(overallRating, selectedTags, feedbackComment);

    if (order?.id) {
      updateOrderStatus(order.id, 'COMPLETED');
    }

    setIsSubmitted(true);
    showToast(`Thank you! Feedback recorded for Waiter ${waiter.name}.`);
  };

  const handleReturn = () => {
    onClose();
    if (onReturnToMenu) {
      onReturnToMenu();
    }
  };

  // 12 rising ember particles for dynamic atmospheric animation
  const emberParticles = [
    { left: '15%', delay: '0s', duration: '3.8s', drift: '-20px', size: '5px' },
    { left: '25%', delay: '1.2s', duration: '4.2s', drift: '18px', size: '4px' },
    { left: '38%', delay: '0.5s', duration: '3.5s', drift: '-15px', size: '6px' },
    { left: '48%', delay: '2.1s', duration: '4.0s', drift: '22px', size: '3px' },
    { left: '55%', delay: '0.8s', duration: '3.7s', drift: '-10px', size: '5px' },
    { left: '68%', delay: '1.6s', duration: '4.4s', drift: '15px', size: '4px' },
    { left: '78%', delay: '0.2s', duration: '3.9s', drift: '-25px', size: '6px' },
    { left: '86%', delay: '2.4s', duration: '4.1s', drift: '12px', size: '3px' },
    { left: '10%', delay: '1.8s', duration: '3.6s', drift: '16px', size: '4px' },
    { left: '32%', delay: '2.7s', duration: '4.3s', drift: '-18px', size: '5px' },
    { left: '62%', delay: '1.0s', duration: '3.8s', drift: '20px', size: '4px' },
    { left: '92%', delay: '0.4s', duration: '4.5s', drift: '-14px', size: '5px' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* CUSTOM UNIQUE CSS ANIMATIONS FOR CELEBRATORY CARD */}
      <style>{`
        @keyframes royalStampDrop {
          0% { transform: scale(2.5) rotate(-10deg); opacity: 0; filter: blur(10px); }
          55% { transform: scale(0.92) rotate(2deg); opacity: 1; filter: blur(0px); }
          75% { transform: scale(1.08) rotate(-1deg); }
          90% { transform: scale(0.98) rotate(0.5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes shockwaveRing1 {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes shockwaveRing2 {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        @keyframes sunburstSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes sacredRaysCounter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes emberAscend {
          0% { transform: translateY(40px) translateX(0) scale(0.3); opacity: 0; }
          20% { opacity: 0.9; }
          70% { opacity: 0.7; }
          100% { transform: translateY(-110px) translateX(var(--drift)) scale(1.1); opacity: 0; }
        }

        @keyframes goldFoilSheen {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes cascadeCardSlide {
          0% { transform: translateY(24px) scale(0.94); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes ribbonGlint {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.2); }
        }
      `}</style>

      {/* MODAL CONTAINER: Compact for Feedback, Spacious for Thank You Card */}
      <div 
        className={`w-full ${
          isSubmitted ? 'max-w-2xl lg:max-w-3xl min-h-[560px]' : 'max-w-lg sm:max-w-xl'
        } bg-slate-900/98 text-slate-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.92)] border border-amber-500/25 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative backdrop-blur-2xl my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* MODAL HEADER */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-850/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
                Table {targetTable}
              </span>
              {order && (
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  Order #{order.orderNumber}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>{isSubmitted ? 'Royal Ember Guest Appreciation' : 'How Was Your Dining Experience?'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT */}
        {isSubmitted ? (
          /* ==============================================================
             SPECTACULAR UNCONVENTIONAL THANK YOU CARD ANIMATION
             (Solar Sunburst + Royal Wax Seal Stamp + Concentric Shockwaves + Rising Embers)
             ============================================================== */
          <div className="p-8 sm:p-12 text-center space-y-7 my-auto animate-in zoom-in-95 duration-300 relative overflow-hidden flex-1 flex flex-col justify-center">
            
            {/* 1. RISING EMBER SPARKS PARTICLES EFFECT */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {emberParticles.map((p, idx) => (
                <div
                  key={idx}
                  className="absolute bottom-12 rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    animation: `emberAscend ${p.duration} ease-in-out infinite`,
                    animationDelay: p.delay,
                    ['--drift' as string]: p.drift,
                  }}
                />
              ))}
            </div>

            {/* Ambient Warm Center Backlight */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* 2. SOLAR SUNBURST BEAMS & ROYAL STAMP MEDALLION */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              
              {/* Rotating Celestial Sunburst Aura Rays */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{ animation: 'sunburstSpin 20s linear infinite' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 fill-current">
                  {[...Array(16)].map((_, i) => (
                    <polygon
                      key={i}
                      points="48,15 52,15 50,0"
                      transform={`rotate(${i * 22.5} 50 50)`}
                      className="opacity-70"
                    />
                  ))}
                  <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
              </div>

              {/* Counter-Rotating Sacred Geometry Ring */}
              <div 
                className="absolute w-32 h-32 pointer-events-none opacity-30"
                style={{ animation: 'sacredRaysCounter 14s linear infinite' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300">
                  <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1" />
                  <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 50 50)" />
                </svg>
              </div>

              {/* Triple Concentric Shockwave Golden Rings rippling out from Stamp */}
              <div 
                className="absolute w-24 h-24 rounded-full border-2 border-amber-400 pointer-events-none"
                style={{ animation: 'shockwaveRing1 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite' }}
              />
              <div 
                className="absolute w-24 h-24 rounded-full border border-yellow-300 pointer-events-none"
                style={{ animation: 'shockwaveRing2 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 0.6s' }}
              />

              {/* Central Royal Ember Crest with Elastic Stamp Drop Animation */}
              <div 
                className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-1 shadow-[0_0_50px_rgba(245,158,11,0.65)]"
                style={{ animation: 'royalStampDrop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
              >
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center border border-amber-300/50 text-amber-300 shadow-inner relative overflow-hidden">
                  {/* Subtle internal shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-transparent" />
                  <Crown className="w-11 h-11 text-amber-400 drop-shadow-md" />
                </div>
              </div>

              {/* Orbiting Sparkle Star Jewels */}
              <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-bounce" />
              <Sparkles className="w-5 h-5 text-yellow-200 absolute -bottom-2 -left-2 animate-pulse" />
            </div>

            {/* 3. HEADLINE WITH GOLDEN SASH BANNER */}
            <div className="space-y-2.5 relative z-10 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Royal Ember Dining Honors</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Thank You for Dining with Us!
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your generous rating and feedback have been officially presented to{' '}
                <strong className="text-amber-300 font-extrabold">Waiter {waiter.fullName}</strong>{' '}
                and Executive Chef Anand.
              </p>
            </div>

            {/* 4. SPACIOUS CASCADING RATINGS HONORS CARDS */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto w-full relative z-10"
              style={{ animation: 'cascadeCardSlide 0.6s ease-out forwards 0.2s' }}
            >
              {/* Card 1: Food & Taste */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-400/30 shadow-lg text-center flex flex-col items-center justify-center space-y-1">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center mb-1">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Food & Culinary
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                  ⭐ {mealRating}.0 / 5
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium">
                  {getRatingFeedback(mealRating, 'meal')}
                </span>
              </div>

              {/* Card 2: Waiter Suresh */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-400/30 shadow-lg text-center flex flex-col items-center justify-center space-y-1 ring-1 ring-amber-400/30">
                <div className={`w-8 h-8 rounded-xl ${waiter.avatarBg} text-white font-black text-xs flex items-center justify-center mb-1 shadow-sm`}>
                  {waiter.initial}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Waiter {waiter.name}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                  ⭐ {waiterRating}.0 / 5
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium">
                  Zone {waiter.zone}
                </span>
              </div>

              {/* Card 3: Restaurant Ambiance */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-400/30 shadow-lg text-center flex flex-col items-center justify-center space-y-1">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center mb-1">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ambiance
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                  ⭐ {ambianceRating}.0 / 5
                </span>
                <span className="text-[10px] text-amber-300/80 font-medium">
                  {getRatingFeedback(ambianceRating, 'ambiance')}
                </span>
              </div>
            </div>

            {/* Respectful Hospitality Note */}
            <p className="text-xs sm:text-sm text-slate-400 italic max-w-md mx-auto relative z-10 leading-relaxed">
              “Table {targetTable} • It was our highest honor hosting you today. We eagerly look forward to welcoming you back for another unforgettable meal!”
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto w-full relative z-10">
              <button
                type="button"
                onClick={handleReturn}
                className="w-full sm:w-auto flex-1 py-3.5 sm:py-4 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-slate-950" />
                <span>Return to Table Menu</span>
              </button>

              {onOpenReceipt && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReceipt();
                  }}
                  className="w-full sm:w-auto py-3.5 sm:py-4 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10 font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>View Receipt</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ==============================================================
             MEDIUM SIZE & MEDIUM SPACING RATING FORM
             (Balanced: not big size, not small size - true medium)
             ============================================================== */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-4.5 overflow-y-auto max-h-[82vh] custom-scrollbar flex-1">
            
            {/* 1. MEAL & FOOD QUALITY SECTION (MEDIUM) */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-850/80 border border-white/[0.08] space-y-2.5 hover:border-amber-400/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/20 shrink-0">
                    <Utensils className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      1. Meal & Food Quality
                    </h4>
                    <span className="text-xs text-slate-400">
                      Flavor, freshness & dish temperature
                    </span>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                  {mealRating}.0 ★
                </span>
              </div>

              {/* 5 Stars with Dynamic Feedback (Medium) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverMealRating || mealRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverMealRating(star)}
                        onMouseLeave={() => setHoverMealRating(0)}
                        onClick={() => setMealRating(star)}
                        className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`Rate food ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_7px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs sm:text-sm font-medium text-amber-300/90 text-left sm:text-right">
                  {getRatingFeedback(hoverMealRating || mealRating, 'meal')}
                </span>
              </div>
            </div>

            {/* 2. DEDICATED WAITER SECTION (MEDIUM & BALANCED) */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-slate-850 to-slate-800/95 border border-amber-400/30 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center font-black text-base ${waiter.avatarBg} text-white shrink-0 border border-white/20 shadow-sm`}>
                    {waiter.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                        Assigned Waiter
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Zone {waiter.zone}
                      </span>
                    </div>

                    {/* PROMINENT WAITER NAME */}
                    <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                      <span>Waiter {waiter.fullName}</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </h4>
                    <span className="text-xs text-slate-400">
                      Dedicated floor attendant for Table {targetTable}
                    </span>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/25">
                  {waiterRating}.0 ★
                </span>
              </div>

              {/* 5 Stars for Waiter (Medium) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverWaiterRating || waiterRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverWaiterRating(star)}
                        onMouseLeave={() => setHoverWaiterRating(0)}
                        onClick={() => setWaiterRating(star)}
                        className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`Rate waiter ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_7px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs sm:text-sm font-medium text-amber-300/90 text-left sm:text-right">
                  {getRatingFeedback(hoverWaiterRating || waiterRating, 'waiter')}
                </span>
              </div>
            </div>

            {/* 3. RESTAURANT AMBIANCE & EXPERIENCE SECTION (MEDIUM) */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-850/80 border border-white/[0.08] space-y-2.5 hover:border-amber-400/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/20 shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      3. Restaurant Service & Ambiance
                    </h4>
                    <span className="text-xs text-slate-400">
                      Atmosphere, cleanliness & ambient music
                    </span>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                  {ambianceRating}.0 ★
                </span>
              </div>

              {/* 5 Stars for Ambiance (Medium) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverAmbianceRating || ambianceRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverAmbianceRating(star)}
                        onMouseLeave={() => setHoverAmbianceRating(0)}
                        onClick={() => setAmbianceRating(star)}
                        className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`Rate ambiance ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_7px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs sm:text-sm font-medium text-amber-300/90 text-left sm:text-right">
                  {getRatingFeedback(hoverAmbianceRating || ambianceRating, 'ambiance')}
                </span>
              </div>
            </div>

            {/* QUICK COMPLIMENT PILLS (MEDIUM) */}
            <div className="space-y-2 pt-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                What Made Your Visit Special? (Optional)
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPraiseTags.map((item) => {
                  const isSelected = selectedTags.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleTag(item.label)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm scale-102'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPACT COMMENT BOX (MEDIUM) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Special Compliment or Chef Note (Optional):</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder={`Share kind words for Waiter ${waiter.name} or Chef Anand...`}
                className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all resize-none"
              />
            </div>

            {/* SUBMIT BUTTON (MEDIUM) */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Dining Feedback</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default CustomerFeedbackModal;
