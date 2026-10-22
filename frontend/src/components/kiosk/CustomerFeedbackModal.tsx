import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { 
  Star, 
  X, 
  Check, 
  Utensils, 
  Heart,
  Receipt,
  Sparkles,
  Crown,
  Award,
  ArrowRight
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

  // Curated, non-cluttered compliment tags with micro-icons
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div 
        className="w-full max-w-lg bg-slate-900/95 text-slate-100 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-850/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
                Table {targetTable}
              </span>
              {order && (
                <span className="text-[11px] font-mono text-slate-400">
                  Order #{order.orderNumber}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-1.5">
              <span>{isSubmitted ? 'Guest Honors & Appreciation' : 'How Was Your Dining Experience?'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-white/5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT */}
        {isSubmitted ? (
          /* ==============================================================
             CELEBRATORY THANK YOU CARD WITH ROYAL EMBER MEDALLION ANIMATION
             ============================================================== */
          <div className="p-7 sm:p-9 text-center space-y-6 my-auto animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* CONCENTRIC RADIANT PULSING MEDALLION CREST */}
            <div className="relative w-24 h-24 mx-auto mb-2 flex items-center justify-center">
              {/* Expanding Ping Ring */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/25 opacity-75" />
              {/* Ambient Golden Blur Glow */}
              <div className="absolute w-32 h-32 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
              {/* Medallion Golden Ring */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center border border-amber-300/40 text-amber-300">
                  <Crown className="w-9 h-9 text-amber-400 animate-pulse" />
                </div>
              </div>
              {/* Floating micro sparkle dots */}
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>

            {/* Gratitude Headlines */}
            <div className="space-y-2 relative z-10">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Royal Ember Dining Honors <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Thank You for Dining with Us!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your gracious feedback has been conveyed directly to{' '}
                <strong className="text-amber-300 font-bold">Waiter {waiter.fullName}</strong>{' '}
                and Executive Chef Anand.
              </p>
            </div>

            {/* Clean, Refined Review Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-amber-400/20 flex items-center justify-around text-center max-w-sm mx-auto shadow-md relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Food & Taste</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">⭐ {mealRating}.0 / 5</span>
              </div>
              <div className="w-px h-7 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Waiter {waiter.name}</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">⭐ {waiterRating}.0 / 5</span>
              </div>
              <div className="w-px h-7 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ambiance</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">⭐ {ambianceRating}.0 / 5</span>
              </div>
            </div>

            {/* Respectful Hospitality Note */}
            <p className="text-xs text-slate-400 italic max-w-xs mx-auto relative z-10">
              “Table {targetTable} • It was our highest honor hosting you today. We look forward to welcoming you back!”
            </p>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <button
                type="button"
                onClick={handleReturn}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Receipt</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ==============================================================
             POLISHED, BALANCED RATING FORM (TASTEFUL & ENGAGING)
             ============================================================== */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[78vh] custom-scrollbar">
            
            {/* 1. MEAL & FOOD QUALITY */}
            <div className="p-3.5 rounded-2xl bg-slate-850/70 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/20">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">1. Meal & Food Quality</h4>
                    <span className="text-[10px] text-slate-400">Flavor, freshness & dish temperature</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {mealRating}.0 ★
                </span>
              </div>

              {/* 5 Stars with dynamic feedback text */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
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
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] font-medium text-amber-300/90 text-right">
                  {getRatingFeedback(hoverMealRating || mealRating, 'meal')}
                </span>
              </div>
            </div>

            {/* 2. DEDICATED WAITER SECTION (PROMINENT WAITER NAME & BADGE) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-850 to-slate-800/90 border border-amber-400/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${waiter.avatarBg} text-white shrink-0 border border-white/20 shadow-sm`}>
                    {waiter.initial}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      Dedicated Table Server
                    </span>
                    {/* PROMINENT WAITER NAME */}
                    <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                      <span>Waiter {waiter.fullName}</span>
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Floor Section • Zone {waiter.zone}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {waiterRating}.0 ★
                </span>
              </div>

              {/* 5 Stars for Waiter with dynamic feedback */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
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
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] font-medium text-amber-300/90 text-right">
                  {getRatingFeedback(hoverWaiterRating || waiterRating, 'waiter')}
                </span>
              </div>
            </div>

            {/* 3. RESTAURANT AMBIANCE & EXPERIENCE */}
            <div className="p-3.5 rounded-2xl bg-slate-850/70 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">3. Restaurant Ambiance & Cleanliness</h4>
                  <span className="text-[10px] text-slate-400">Atmosphere, hygiene & ambient music</span>
                </div>

                <span className="text-[11px] font-bold text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  {ambianceRating}.0 ★
                </span>
              </div>

              {/* 5 Stars for Ambiance */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverAmbianceRating || ambianceRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverAmbianceRating(star)}
                        onMouseLeave={() => setHoverAmbianceRating(0)}
                        onClick={() => setAmbianceRating(star)}
                        className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`Rate ambiance ${star} stars`}
                      >
                        <Star
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] font-medium text-amber-300/90 text-right">
                  {getRatingFeedback(hoverAmbianceRating || ambianceRating, 'ambiance')}
                </span>
              </div>
            </div>

            {/* QUICK COMPLIMENT PILLS (TASTEFUL & ENGAGING) */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                What Made Your Visit Special? (Optional)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPraiseTags.map((item) => {
                  const isSelected = selectedTags.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleTag(item.label)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-102'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPACT NOTE FIELD */}
            <div className="space-y-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Compliments for Waiter ${waiter.name} or Chef Anand (optional)...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>Submit Dining Feedback</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default CustomerFeedbackModal;
