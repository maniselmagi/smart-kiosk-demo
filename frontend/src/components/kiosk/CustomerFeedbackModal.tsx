import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  UtensilsCrossed, 
  UserCheck, 
  Award, 
  Building2, 
  MessageSquareHeart, 
  ArrowRight,
  Receipt,
  Heart
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

  // Ratings across 3 dimensions requested by user
  const [mealRating, setMealRating] = useState<number>(5);
  const [hoverMealRating, setHoverMealRating] = useState<number>(0);

  const [waiterRating, setWaiterRating] = useState<number>(5);
  const [hoverWaiterRating, setHoverWaiterRating] = useState<number>(0);

  const [serviceRating, setServiceRating] = useState<number>(5);
  const [hoverServiceRating, setHoverServiceRating] = useState<number>(0);

  // Selected tag pills
  const [selectedMealTags, setSelectedMealTags] = useState<string[]>([
    'Hot & Fresh',
    'Sensational Flavor',
    'Artisanal Plating'
  ]);

  const [selectedWaiterTags, setSelectedWaiterTags] = useState<string[]>([
    'Very Courteous & Polite',
    'Prompt & Speedy'
  ]);

  const [selectedServiceTags, setSelectedServiceTags] = useState<string[]>([
    'Royal Luxury Ambiance',
    'Effortless Tablet Ordering'
  ]);

  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const mealTagsList = [
    'Hot & Fresh',
    'Sensational Flavor',
    'Artisanal Plating',
    'Perfect Spice Level',
    'Authentic Spices',
    'Generous Portions'
  ];

  const waiterTagsList = [
    'Very Courteous & Polite',
    'Prompt & Speedy',
    'Attentive to Needs',
    'Warm Welcoming Smile',
    'Helpful Menu Guidance',
    'Kept Table Spotless'
  ];

  const serviceTagsList = [
    'Royal Luxury Ambiance',
    'Effortless Tablet Ordering',
    'Pristine Hygiene',
    'Pleasant Background Music',
    'Fast Kitchen Prep',
    'Great Value for Luxury'
  ];

  const toggleTag = (
    tag: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingLabel = (score: number, type: 'meal' | 'waiter' | 'service') => {
    if (type === 'meal') {
      if (score === 5) return 'Sensational Taste & Superb Presentation! 🌟';
      if (score === 4) return 'Delicious & Highly Satisfying Meal 👍';
      if (score === 3) return 'Good, Met Expectations 🙂';
      if (score === 2) return 'Fair, Needs Flavor Refinement 😐';
      return 'Disappointing Meal Experience 😞';
    }
    if (type === 'waiter') {
      if (score === 5) return `Exemplary Hospitality from Waiter ${waiter.name}! 👏`;
      if (score === 4) return `Courteous & Prompt Service 👍`;
      if (score === 3) return `Helpful Table Assistance 🙂`;
      if (score === 2) return `Delayed Floor Response 😐`;
      return `Inattentive Service 😞`;
    }
    if (score === 5) return 'Royal Ambiance & Flawless Dining! 👑';
    if (score === 4) return 'Pleasant & Clean Dining Atmosphere ✨';
    if (score === 3) return 'Comfortable Environment 🙂';
    if (score === 2) return 'Average Hospitality 😐';
    return 'Needs Service Improvement 😞';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const overallRating = Math.round((mealRating + waiterRating + serviceRating) / 3);
    const combinedTags = [
      ...selectedMealTags.map((t) => `Meal: ${t}`),
      ...selectedWaiterTags.map((t) => `Waiter ${waiter.name}: ${t}`),
      ...selectedServiceTags.map((t) => `Service: ${t}`)
    ];

    const customerComment = comment.trim() 
      ? `${comment.trim()} [Waiter: ${waiter.fullName} • Table ${targetTable}]`
      : `Splendid dining at Table ${targetTable}. Outstanding hospitality by Waiter ${waiter.fullName} and delicious dishes!`;

    // Submit to store & management dashboard
    submitFeedback(overallRating, combinedTags, customerComment);

    if (order?.id) {
      updateOrderStatus(order.id, 'COMPLETED');
    }

    setIsSubmitted(true);
    showToast(`Thank you! Your feedback for Waiter ${waiter.name} and the meal has been recorded.`);
  };

  const handleFinishAndReturn = () => {
    onClose();
    if (onReturnToMenu) {
      onReturnToMenu();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl bg-slate-900/98 text-slate-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-amber-500/20 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-300 relative backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[2px]" />

        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-amber-600/30 text-amber-400 flex items-center justify-center border border-amber-400/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Table {targetTable}
                </span>
                {order && (
                  <span className="text-xs text-slate-400 font-mono">
                    Order #{order.orderNumber}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-display text-white mt-0.5 tracking-tight">
                Customer Dining Rating & Feedback
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
            aria-label="Close Feedback"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT: Form OR Celebratory Thank You Card */}
        {isSubmitted ? (
          /* ==============================================================
             CELEBRATORY ATTRACTIVE THANK YOU CARD MESSAGE
             ============================================================== */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center my-auto animate-in zoom-in-95 duration-300 relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Royal Crest Seal */}
            <div className="relative inline-flex items-center justify-center mb-1">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/25 via-yellow-400/30 to-amber-600/30 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.4)] relative">
                <div className="absolute inset-1 rounded-full border border-amber-300/30 animate-spin-slow" />
                <Award className="w-12 h-12 text-amber-300 drop-shadow-md animate-bounce" />
              </div>
              <span className="absolute -bottom-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                Honored Guest
              </span>
            </div>

            {/* Gratitude Headlines */}
            <div className="space-y-2 relative z-10">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Royal Ember Dining Experience <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                Thank You for Dining with Us!
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Your gracious feedback has been received and shared directly with{' '}
                <strong className="text-amber-300 font-extrabold">Waiter {waiter.name} ({waiter.code})</strong>{' '}
                and our Executive Culinary Brigade.
              </p>
            </div>

            {/* Dedicated Waiter Praise & Kitchen Honors Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left relative z-10">
              {/* Waiter Card */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-amber-400/30 flex items-center gap-3 shadow-md">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md ${waiter.avatarBg} text-white shrink-0 border border-white/20`}>
                  {waiter.initial}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                    Waiter Service Rated
                  </span>
                  <span className="text-sm font-black text-white block">
                    {waiter.fullName}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex text-amber-400">
                      {[...Array(waiterRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 font-mono ml-1">
                      {waiterRating}.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Meal & Kitchen Card */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-amber-400/30 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-base shadow-md shrink-0 border border-white/20">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                    Culinary Meal Rated
                  </span>
                  <span className="text-sm font-black text-white block">
                    Chef Anand’s Kitchen
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex text-amber-400">
                      {[...Array(mealRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 font-mono ml-1">
                      {mealRating}.0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings Summary Badges Banner */}
            <div className="p-4 rounded-2xl bg-slate-850/90 border border-white/[0.08] max-w-lg mx-auto flex items-center justify-around gap-2 text-center relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">The Meal</span>
                <span className="text-sm font-black text-amber-400 font-mono">⭐ {mealRating}.0 / 5</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Waiter {waiter.name}</span>
                <span className="text-sm font-black text-emerald-400 font-mono">⭐ {waiterRating}.0 / 5</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Restaurant</span>
                <span className="text-sm font-black text-amber-400 font-mono">⭐ {serviceRating}.0 / 5</span>
              </div>
            </div>

            {/* Warm Farewell Note */}
            <div className="max-w-md mx-auto text-xs text-slate-400 leading-relaxed italic relative z-10">
              “It was an honor hosting your party at Table {targetTable}. We look forward to crafting your next dining experience with royal perfection.”
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto relative z-10">
              <button
                type="button"
                onClick={handleFinishAndReturn}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-slate-950" />
                <span>Return to Table Menu</span>
              </button>

              {onOpenReceipt && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReceipt();
                  }}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white border border-white/10 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>View Digital Receipt</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* ==============================================================
             FEEDBACK & RATING INPUT FORM
             ============================================================== */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

            {/* HERO NOTIFICATION: Time's Up / Food Plated */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <CheckCircle2 className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-black text-white block">
                  Dishes Served & Dining In Progress
                </span>
                <p className="text-[11px] text-slate-300">
                  Please rate your meal, restaurant ambiance, and dedicated table service by{' '}
                  <strong className="text-amber-300 font-bold">Waiter {waiter.name}</strong>.
                </p>
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 1: THE MEAL & CULINARY DELIGHT
                ------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/25">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">
                      1. The Meal & Culinary Quality
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Flavor, freshness, presentation & temperature
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                  {mealRating}.0 / 5
                </span>
              </div>

              {/* 5-Star Interactive Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverMealRating || mealRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverMealRating(star)}
                        onMouseLeave={() => setHoverMealRating(0)}
                        onClick={() => setMealRating(star)}
                        className="p-1 hover:scale-115 active:scale-95 transition-all cursor-pointer"
                        aria-label={`Rate meal ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-amber-300/90 text-center sm:text-right">
                  {getRatingLabel(hoverMealRating || mealRating, 'meal')}
                </span>
              </div>

              {/* Meal Tag Pills */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  What did you enjoy about the dishes?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mealTagsList.map((tag) => {
                    const isSelected = selectedMealTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag, selectedMealTags, setSelectedMealTags)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/20'
                            : 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-750'
                        }`}
                      >
                        {tag} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 2: PROMINENT WAITER RATING & FEEDBACK
                ------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-850/95 to-slate-800/90 border-2 border-amber-400/40 space-y-4 shadow-xl relative overflow-hidden">
              {/* Ambient Waiter Card Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* PROMINENT WAITER HERO BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${waiter.avatarBg} text-white shrink-0 border-2 border-white/30`}>
                    {waiter.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                        Assigned Table Attendant
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Zone {waiter.zone}
                      </span>
                    </div>
                    {/* PROMINENT WAITER NAME */}
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5 tracking-tight flex items-center gap-2">
                      <span>Waiter {waiter.fullName}</span>
                      <Award className="w-5 h-5 text-amber-400" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      {waiter.role} • Dedicated service for Table {targetTable}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Waiter Score</span>
                  <span className="text-base font-black text-amber-400 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-xl border border-amber-400/25">
                    {waiterRating}.0 / 5
                  </span>
                </div>
              </div>

              {/* 5-Star Interactive Selector for Waiter */}
              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverWaiterRating || waiterRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverWaiterRating(star)}
                          onMouseLeave={() => setHoverWaiterRating(0)}
                          onClick={() => setWaiterRating(star)}
                          className="p-1 hover:scale-115 active:scale-95 transition-all cursor-pointer"
                          aria-label={`Rate Waiter ${waiter.name} ${star} stars`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 text-center sm:text-right">
                    {getRatingLabel(hoverWaiterRating || waiterRating, 'waiter')}
                  </span>
                </div>
              </div>

              {/* Waiter Praise Tags */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Praise Waiter {waiter.name}’s Hospitality:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {waiterTagsList.map((tag) => {
                    const isSelected = selectedWaiterTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag, selectedWaiterTags, setSelectedWaiterTags)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/20'
                            : 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-750'
                        }`}
                      >
                        {tag} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 3: RESTAURANT SERVICE & AMBIANCE
                ------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/25">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">
                      3. Restaurant Service & Dining Atmosphere
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Ambiance, hygiene, table comfort & kiosk ordering
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                  {serviceRating}.0 / 5
                </span>
              </div>

              {/* 5-Star Interactive Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverServiceRating || serviceRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverServiceRating(star)}
                        onMouseLeave={() => setHoverServiceRating(0)}
                        onClick={() => setServiceRating(star)}
                        className="p-1 hover:scale-115 active:scale-95 transition-all cursor-pointer"
                        aria-label={`Rate service ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-amber-300/90 text-center sm:text-right">
                  {getRatingLabel(hoverServiceRating || serviceRating, 'service')}
                </span>
              </div>

              {/* Service Tag Pills */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  What highlights your restaurant visit?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {serviceTagsList.map((tag) => {
                    const isSelected = selectedServiceTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag, selectedServiceTags, setSelectedServiceTags)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/20'
                            : 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-750'
                        }`}
                      >
                        {tag} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 4: DETAILED COMPLIMENT OR SUGGESTION (OPTIONAL)
                ------------------------------------------------------------- */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MessageSquareHeart className="w-4 h-4 text-amber-400" />
                <span>Special Compliments or Suggestions for Waiter {waiter.name} & Chef Anand:</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={`Share your kind words for Waiter ${waiter.name}, compliments for our kitchen chef, or suggestions for our next visit...`}
                className="w-full p-3.5 rounded-2xl bg-slate-850 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none transition-all"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Complete Feedback & View Thank You</span>
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
