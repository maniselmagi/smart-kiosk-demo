import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Order } from '../../types';
import { getAssignedWaiter } from '../../utils/waiterAssignment';
import { 
  Star, 
  Heart, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Utensils, 
  User, 
  ThumbsUp, 
  ShieldCheck,
  Receipt,
  ArrowRight
} from 'lucide-react';

interface FinishMealModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishDiningSuccess?: () => void;
}

export const FinishMealModal: React.FC<FinishMealModalProps> = ({
  order,
  isOpen,
  onClose,
  onFinishDiningSuccess,
}) => {
  const { tableNumber, submitFeedback, updateOrderStatus, showToast } = useKiosk();

  // Waiter for this table
  const targetTable = order?.tableNumber || tableNumber || 12;
  const waiter = getAssignedWaiter(targetTable);

  // Feedback State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Delicious Food',
    'Fast Kitchen Prep',
    'Attentive Waiter'
  ]);
  const [comment, setComment] = useState('');

  // Waiter Tip State
  const [selectedTip, setSelectedTip] = useState<number>(50); // default ₹50
  const [customTip, setCustomTip] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const tipOptions = [0, 30, 50, 100, 150];

  const experienceTags = [
    'Delicious Food',
    'Fast Kitchen Prep',
    'Attentive Waiter',
    'Perfect Spice Level',
    'Clean Ambience',
    'Great Value'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getEffectiveTip = (): number => {
    if (isCustom) {
      const parsed = parseFloat(customTip);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    return selectedTip;
  };

  const handleCompleteDining = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveTip = getEffectiveTip();

    // 1. Submit feedback to storage
    submitFeedback(
      rating,
      selectedTags,
      comment.trim() || `Wonderful dining experience at Table ${targetTable}. Waiter ${waiter.fullName} was very courteous!`
    );

    // 2. Mark order as COMPLETED in KDS and system
    if (order?.id) {
      updateOrderStatus(order.id, 'COMPLETED');
    }

    setIsSubmitted(true);
    showToast(`Dining completed! ₹${effectiveTip} tip sent to Waiter ${waiter.name}.`);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      onFinishDiningSuccess?.();
    }, 2800);
  };

  const effectiveTip = getEffectiveTip();
  const mealTotal = order?.total || 150;
  const finalGrandTotal = mealTotal + effectiveTip;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-600 to-brand-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg font-display">
                  Finish Dining & Gratuity
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-black/25 text-amber-200 text-[10px] font-black uppercase">
                  Table {targetTable}
                </span>
              </div>
              <p className="text-xs text-white/90">
                Rate your meal experience & tip your table attendant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 my-auto animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-display mb-1">
                Thank You for Dining with Us!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your feedback has been recorded, and your tip of{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">₹{effectiveTip}</strong>{' '}
                has been credited directly to <strong>{waiter.fullName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Meal Subtotal & Taxes:</span>
                <span>₹{mealTotal}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Staff Gratuity Tip:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">+₹{effectiveTip}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-black text-sm text-slate-900 dark:text-white">
                <span>Total Settled:</span>
                <span className="text-brand-600 dark:text-brand-400 font-display">₹{finalGrandTotal}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Royal Ember looks forward to welcoming you back!
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteDining} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* ASSIGNED SERVER CARD */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${waiter.avatarBg}`}>
                  {waiter.initial}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                    Your Section Attendant
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {waiter.fullName}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {waiter.role}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Served Table {targetTable}
              </span>
            </div>

            {/* SECTION 1: 5-STAR RATING */}
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                How Was Your Food & Service?
              </span>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-3xl sm:text-4xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-9 sm:h-9 ${
                          isFilled
                            ? 'text-amber-500 fill-amber-500 drop-shadow-sm'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                {rating === 5 && '🌟 Exceptional Dining Experience!'}
                {rating === 4 && '👍 Great Food & Service'}
                {rating === 3 && '🙂 Satisfactory Dining'}
                {rating === 2 && '😐 Room for Improvement'}
                {rating === 1 && '😞 Disappointed with Experience'}
              </span>
            </div>

            {/* Experience Tags */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                What did you love most?
              </span>
              <div className="flex flex-wrap gap-1.5">
                {experienceTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional feedback for the kitchen chefs or management..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* SECTION 2: WAITER TIP PORTION */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-brand-500/10 to-amber-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                      Staff Gratuity Tip for {waiter.name} ({waiter.initial})
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      100% goes directly to your server
                    </span>
                  </div>
                </div>

                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{effectiveTip}
                </span>
              </div>

              {/* Tip Preset Chips */}
              <div className="grid grid-cols-5 gap-1.5">
                {tipOptions.map((amount) => {
                  const isSelected = !isCustom && selectedTip === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setIsCustom(false);
                        setSelectedTip(amount);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border text-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-102'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {amount === 0 ? 'No Tip' : `₹${amount}`}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tip Input */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    isCustom 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Custom
                </button>
                {isCustom && (
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      placeholder="Enter tip amount"
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Final Total Summary */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Final Total (Meal + Tip)</span>
                <span className="font-mono text-slate-400 text-[10px]">Settled via Table Kiosk</span>
              </div>
              <div className="text-right">
                <span className="font-black text-lg text-brand-600 dark:text-brand-400 font-display">
                  ₹{finalGrandTotal}
                </span>
              </div>
            </div>

            {/* Complete Dining CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Complete Meal & Submit Feedback</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default FinishMealModal;
